const request = require('request')
const fs = require('fs')
var zmq =  require('zeromq');
var requester = zmq.socket('req');
requester.connect('tcp://localhost:3002');

var machine_number = '1'
function loop_request() {
    request.post({ url: 'http://localhost:3000/rasberry', form: { machine_number: machine_number } }, function (err, httpResponse, body) {
        if (err) {
            return console.log(err)
        }
        if (body != 'save success' && body != 'Not Found') {
            fs.writeFile('data.json', body, function (err) {
                if (err)
                    return err
                console.log('success save data json')
                clearInterval(main)
                requester.send('work')
            })
        } 
    })
}
var main = setInterval(loop_request,1000)

requester.on('message', function (msg) {
    console.log(msg.toString())
    if(msg.toString() == 'finish'){
        main()
    }
})

process.on('SIGINT', function () {
    requester.close();
})
