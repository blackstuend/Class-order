const request = require('request')
const fs = require('fs')
var order = require('./new_order')
var machine_number = '1'
var time=0;


function loop_request() {
    console.log('send %d request to server,',time)
    request.post({ url: 'http://localhost:3000/rasberry', form: { machine_number: machine_number } }, function (err, httpResponse, body) {
        if (err) {
            return console.log(err)
        }
        if (body != 'save success' && body != 'Not Found') {
            clearInterval(main)
            order();
        } 
    })
    time++;
}
var main = setInterval(loop_request,2000)