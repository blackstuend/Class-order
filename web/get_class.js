const puppeteer = require('puppeteer');
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/face');
const Schema = mongoose.Schema;
const Class = new Schema({
    name: String,
    value: String,
    class: [String],
    Time: [String]
});
var class_model = mongoose.model('Class', Class)

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
    const browser = await puppeteer.launch({
        headless: true
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
    });
    await page.waitFor(500) //進入等待500毫秒
    await menu.evaluate(function () {  //模擬按下老師介面
        let choose = document.querySelectorAll('.ob_td')[19].querySelector('div')
        choose.click();
    })
    await page.waitFor(1000) //等待500
    const top = (await page.frames())[4];
    await top.select('select[name="unit"]', 'UE85'); //選擇資工系 
    await page.waitFor(1000) //等待500
    var option_text = await top.evaluate(() => { //get select 裡面的html
        var text = document.querySelector('select[name="tea_str1"]').innerHTML
        return text
    });
    var teachers_array = await get_teachers(option_text)
    for (i in teachers_array) {
        await top.select('select[name="tea_str1"]', teachers_array[i].value);
        var top_button = await top.$('input')
        await top_button.click()
        const bottom = (await page.frames())[5];
        await page.waitFor(500)
        var result = await bottom.evaluate(() => {
            var result = {}
            result.class=[]
            result.time=[]
            var teacher_table = document.querySelectorAll('table')[0]
            var tr = teacher_table.querySelectorAll('tr');
            for (let j = 1; j < tr.length; j++) {
                let td = tr[j].querySelectorAll('td')
                result.class.push(td[1].innerText) //td[1] = 課堂名稱 td[8] = 時間
                result.time.push(td[8].innerText) //td[1] = 課堂名稱 td[8] = 時間
            }
            return result;
        })
        teachers_array[i].class=result.class
        teachers_array[i].time=result.time
        await page.waitFor(1000) //等待500
    }
    console.log(teachers_array)
})();

