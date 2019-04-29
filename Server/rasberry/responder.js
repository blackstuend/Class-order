var zmq = require('zeromq');
var order = require('./order')
var responder = zmq.socket('rep');

responder.bind('tcp://127.0.0.1:3002', function (err) {
    if(err){
        console.log(err);
    }else{
        console.log('Listening on 3002');
    }
})

responder.on('message', function (request) {
    responder.send("get action");
    order()
})


process.on('SIGINT', function () {
    responder.close();
    
})