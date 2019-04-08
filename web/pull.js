const face_m = require('./face_model')
// var zmq = require('zeromq')
// var sock = zmq.socket('pull');

// sock.connect('tcp://127.0.0.1:3001');
// sock.on('message', function (msg) {
//     console.log(msg.toString())
// });
var zmq = require('zeromq');
var pullSocket = zmq.socket('pull');

pullSocket.connect('tcp://127.0.0.1:3001');
console.log('Worker connected to port 3001');

pullSocket.on('message',function(msg){
    console.log(msg.number.toString());
})