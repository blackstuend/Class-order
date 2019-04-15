const face_m = require('./face_model')
var zmq = require('zeromq');
var pullSocket = zmq.socket('pull');
var exec = require('child_process').exec;


pullSocket.connect('tcp://127.0.0.1:3001');
console.log('Worker connected to port 3001');

pullSocket.on('message',function(msg){
    var obj = JSON.parse(msg.toString());
    console.log('hi')
    face_m.tranning_class(obj.number,obj.ID)
})