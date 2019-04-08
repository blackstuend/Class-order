const puppeteer = require('puppeteer');
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/face');
const Schema = mongoose.Schema;
const Class = new Schema({
    name: String,
    value: String,
    class: [String],
    time: [String],
    class_number:[String]
});
const allClass = new Schema({
    class_name:String,
    class_number:String,
    class_time :String,
    class_teacher:String
})
var class_model = mongoose.model('Class', Class)
var allclass_model = mongoose.model('allClass',allClass)

function get_teachers(text) {
    var teachers = []
    var re = /<option value="(\w*)">([^<]*)<\/option>/g;
    while (true) {
        var obj = {};
        var myArray = re.exec(text)
        if (myArray == null)
            break;
        obj.name = RegExp.$2
        obj.value = RegExp.$1
        // teachers[`${RegExp.$2}`] = RegExp.$1
        teachers.push(obj)
    }
    return teachers;
}

(async () => {
    await class_model.remove({}) //先刪除原本的
    await allclass_model.remove({})
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('http://select.nqu.edu.tw/kmkuas/index_sky.html');
    const menu = (await page.frames())[2];  //get frame memu
    const main = (await page.frames())[3];  //get frame main 
    await main.evaluate(() => {  //模擬登入
        let input = document.querySelectorAll('.textone')
        input[0].value = '110510533'
        input[1].value = 'lion850724'
        let login = document.querySelectorAll('.button')[1];
        login.click()
    },1);
    await page.waitFor(500) //進入等待500毫秒
    await menu.evaluate(function () {  //模擬按下老師介面
        let choose = document.querySelectorAll('.ob_td')[19].querySelector('div')
        choose.click();
    }) 
    await page.waitFor(1500) //等待500
    const top = (await page.frames())[4];
    await top.select('select[name="unit"]', 'UE85'); //選擇資工系 
    await page.waitFor(1000) //等待500
    var option_text = await top.evaluate(() => { //get select 裡面的html
        var text = document.querySelector('select[name="tea_str1"]').innerHTML
        return text
    });
    var teachers_array = await get_teachers(option_text)
    for (let i in teachers_array) {
        await top.select('select[name="tea_str1"]', teachers_array[i].value);
        var top_button = await top.$('input')
        await top_button.click()
        const bottom = (await page.frames())[5];
        await page.waitFor(1500)
        var result = await bottom.evaluate(() => {
            var result = {}
            result.class=[]
            result.time=[]
            result.class_number= []
            var teacher_table = document.querySelectorAll('table')[0]
            var tr = teacher_table.querySelectorAll('tr');
            for (let j = 1; j < tr.length; j++) {
                let td = tr[j].querySelectorAll('td')
                result.class.push(td[1].innerText) //td[1] = 課堂名稱 td[8] = 時間
                result.time.push(td[8].innerText) //td[1] = 課堂名稱 td[8] = 時間
                result.class_number.push(td[0].innerText)
            }
            return result; // 
        })
        teachers_array[i].class_number=result.class_number
        teachers_array[i].class=result.class
        teachers_array[i].time=result.time
        await page.waitFor(1500) //等待500
    }
    for(let i in teachers_array){ //將資料存進db
        var class_save = await new class_model(teachers_array[i]);
        await class_save.save();
        for(let j in teachers_array[i].class){
            var obj  = {};
            obj.class_name = teachers_array[i].class[j]
            obj.class_time = teachers_array[i].time[j]
            obj.class_number = teachers_array[i].class_number[j]
            obj.class_teacher = teachers_array[i].name
            console.log(obj)
            var class_save = await new allclass_model(obj);
            var class_save = await class_save.save();
        }
    }
    console.log('finish') 
    browser.close(); //close all thing
    mongoose.disconnect()
    return 0;
})();

