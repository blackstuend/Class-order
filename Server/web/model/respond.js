var zmq = require('zeromq');

var responder = zmq.socket('rep');
const face_m = require('./face_model')
responder.on('message', function (msg) {
    console.log('hello')
    var obj = JSON.parse(msg.toString());
    responder.send(obj.number + 'success received'); 
    face_m.tranning_class(obj.number,obj.ID,function(err){
        if(err){
        responder.send('error');
        }
        else
        responder.send('successful'); 
    }); 
})

responder.bind('tcp://127.0.0.1:3001', function (err) {
    if(err){
        console.log(err);
    }else{
        console.log('Listening on 3001');
    }
})

process.on('SIGINT', function () {
    responder.close();
})