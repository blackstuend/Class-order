var socket = require('socket.io-client')('http://localhost:3000');
const request = require('request')
const fs = require('fs')
var order = require('./new_order')
var machine_number = '1'

function loop_request() {
    request.post({ url: 'http://localhost:3000/rasberry', form: { machine_number: machine_number } }, function (err, httpResponse, body) {
        if (err) {
            return console.log(err)
        }
    })
}
loop_request()

socket.on('rasberry',function(msg){
    var data = JSON.parse(msg)
    var train_model = JSON.stringify(data.train)
    fs.writeFile('./data1.json', train_model, 'utf8', function(err){
        if(err)
        return console.log(err)
        return console.log('save data1.json success')
    });
    var roll_call_seconds = data.time * 60
    var test_seconds = 30
    console.log('點名秒數自動關閉',test_seconds)
    order([],test_seconds)
    loop_request()
})