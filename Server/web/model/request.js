var zmq =  require('zeromq');
var requester = zmq.socket('req');

requester.on('message', function (reply) {
    console.log(`Received reply: ${reply.toString()}`)
    requester.close();
})

console.log('Send msg');
requester.send('success job');


requester.connect('tcp://localhost:5555');

