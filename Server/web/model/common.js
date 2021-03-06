const db = require('./db/account')
const fs = require('fs')
const path = require('path')
const face_m = require('./face_model')
const zmq = require('zeromq')
// const sock = zmq.socket('push')
var requester = zmq.socket('req');
// sock.bindSync('tcp://127.0.0.1:3001');
const class_table = {
    星期一: 0, 星期二: 1, 星期三: 2, 星期四: 3, 星期五: 4, 星期六: 5, 星期日: 6, 第一節: 0, 第二節: 1, 第三節: 2, 第四節: 3, 第五節: 4,
    第六節: 5, 第七節: 6, 第八節: 7, 第九節: 8
}
requester.on('message', function (msg) {
    console.log(msg.toString());
})
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
        var url = path.join(__dirname, '..', 'public', 'user_images', path_name)
        fs.mkdir(url, { recursive: false }, (err) => {
            if (err)
                throw err;
            else
                console.log('mkdir suceessful at the name')
        });
    },
    save_photo: function (file, ID) {
        const reader = fs.createReadStream(file.path);
        // console.log(file.name);
        var path_url = path.join(__dirname, '..', 'public', 'user_images', ID.toString())
        const stream = fs.createWriteStream(path.join(path_url, file.name));
        // reader.pipe(stream);
        // setTimeout(()=>{face_m.cut_detct_face(ID.toString(),file.name.toString())},100)
        reader.pipe(stream).on('finish', function () {
            face_m.cut_detct_face(ID.toString(), file.name.toString())
        })
    },
    save_class_data: async function (file) {
        var save = new db.class_model(file)
        var docs = await save.save();
        return docs;
    },
    save_Stuclass_data: async function (file) {
        var save = new db.Stuclass_model(file)
        var docs = await save.save();
        return docs;
    },
    take_class_table: async function (ID) {
        // console.log(ID)
        var docs = await db.class_model.find({ ID: ID })
        var table = [];
        for (var i = 0; i < 10; i++) {
            table[i] = []
            for (var j = 0; j < 7; j++) {
                table[i][j] = null
            }
        }
        for (content of docs) {
            var start = class_table[content.start_time];
            var end = class_table[content.end_time];
            for (var j = start; j <= end; j++) {
                var week = class_table[content.date];
                table[week][j] = content.name;
            }
        }
        return table;
    },
    search_class: async function (obj) {
        var docs = await db.class_model.find(obj)
        return docs;
    },
    get_class: async function (name) {
        var docs = await db.Class_model.find(name)
        return docs;
    },
    get_allclass: async function (obj) {
        var docs = await db.allclass_model.findOne(obj)
        return docs
    },
    add_stuclass: async function (obj) {
        var alreay_save = await db.stu_class.findOne(obj)
        if (alreay_save == null) {
            var stu_class_save = new db.stu_class(obj)
            var result = await stu_class_save.save();
        }
    },
    find_stuclass: async function (obj) {
        var docs = await db.stu_class.find(obj);
        return docs;
    },
    ckeck_dir: function (dir_name) {
        var dir_path = path.join(__dirname, '..', 'public', "user_images", dir_name.toString())
        console.log(dir_path)
        fs.exists(dir_path, function (exists) {
            if (exists)
                console.log(exists)
            else
                fs.mkdir(dir_path, function (err) {
                    if (err) console.log(err)
                    console.log('success')
                })
        })
    },
    
    find_name : async function(class_number){
        return await db.allclass_model.find({class_number:class_number})
    },
    // tranning:function(number,ID){
    //     obj = {
    //         number:number,
    //         ID:ID
    //     }
    //     sock.send(JSON.stringify(obj))
    // },
    tranning_req: function (number, ID) {
        requester.connect('tcp://localhost:3001');
        obj = {
            number: number,
            ID: ID
        }
        console.log('send')

        requester.send(JSON.stringify(obj));
    },
    save_order :async function(obj){
        var save = new db.class_order(obj)
        await save.save();
        console.log('success save order')
    },
    find_order :async function(class_number){
        return await db.class_order.find({class_number:class_number})
    }
}