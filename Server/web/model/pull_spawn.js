const face_m = require('./face_model')
var zmq = require('zeromq');
var pullSocket = zmq.socket('pull');
var spawn = require('child_process').spawn;


pullSocket.connect('tcp://127.0.0.1:3001');
console.log('Worker connected to port 3001');

pullSocket.on('message',function(msg){
    var obj = JSON.parse(msg.toString());
    console.log('hi')
    var ls = spawn('node', ['face.js',obj.number,obj.ID])
    ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
      });
      
      ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
      });
      
      ls.on('close', function (code) {
        console.log('child process exited with code ' + code);
      });
})