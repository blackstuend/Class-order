const db = require('./db/account')
const fs = require('fs')
const path = require('path')

const class_table ={
    星期一:0,星期二:1,星期三:2,星期四:3,星期五:4,星期六:5,星期日:6,第一節:0,第二節:1,第三節:2,第四節:3,第五節:4,
    第六節:5,第七節:6,第八節:7,第九節:8
}
module.exports = {
    stu_save: async function (body) {
        var save = new db.student_model(body);
        docs = await save.save()
        return docs
    },
    pro_save: async function (body) {
        var save = new db.professor_model(body);
        docs = await save.save()
        return docs
    },
    stu_find: async function (body) {
        var docs = await db.student_model.find(body)
        if (docs.length == 1)
            return docs[0]
        else
            return null
    },
    pro_find: async function (body) {
        var docs = await db.professor_model.find(body)
        if (docs.length == 1)
            return docs[0]
        else
            return null
    },
    create_dir: function (name) {
        console.log(name);
        path_name = name.toString();
        var url = path.join(__dirname,'..', 'public', 'user_images', path_name)
        console.log(url)
        fs.mkdir(url, { recursive: false }, (err) => {
            if (err)
                throw err;
            else
                console.log('mkdir suceessful at the name')
        });
    },
    save_photo :function(file,ID) {
        const reader = fs.createReadStream(file.path);
        console.log(file.name);
        var path_url = path.join(__dirname,'..', 'public', 'user_images', ID.toString())
        const stream = fs.createWriteStream(path.join(path_url, file.name));
        reader.pipe(stream);
    },
    save_class_data :async function(file){
        var save = new db.class_model(file)
        var docs = await save.save();
        return docs;
    },
    take_class_table:async function(ID){
        console.log(ID)
        var docs=await db.class_model.find({ID:ID})
        var table=[];
        for(var i=0;i<10;i++)
        {
            table[i]=[]
            for(var j=0;j<7;j++){
                table[i][j]=null
            }
        }
        for (content of docs){
            var start = class_table[content.start_time];
            var end = class_table[content.end_time];
            console.log(start +" "+end)
            for(var j=start;j<=end;j++){
                var week = class_table[content.date];
                console.log(content.name)
                table[week][j]=content.name;
            }
        }
        return table;
    }
}