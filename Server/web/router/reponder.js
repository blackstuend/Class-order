var zmq = require('zeromq');

var responder = zmq.socket('rep');

responder.bind('tcp://127.0.0.1:3002', function (err) {
    if(err){
        console.log(err);
    }else{
        console.log('Listening on 3002');
    }
})


responder.on('message', function (msg) {
    face_recognition(function(){
        
        //辨識完成 用回呼發送request給 Web server儲存
    })// 開始辨識
    responder.send('receive')
})


process.on('SIGINT', function () {
    responder.close();
    
})