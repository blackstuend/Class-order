const request = require('request')
const fs = require('fs')
var zmq =  require('zeromq');
var requester = zmq.socket('req');
requester.connect('tcp://localhost:3002');
var order = require('./order')
var machine_number = '1'
function loop_request() {
    request.post({ url: 'http://localhost:3000/rasberry', form: { machine_number: machine_number } }, function (err, httpResponse, body) {
        if (err) {
            return console.log(err)
        }
        if (body != 'save success' && body != 'Not Found') {
            clearInterval(main)
            order();
            main();
        } 
    })
}
var main = setInterval(loop_request,1000)
