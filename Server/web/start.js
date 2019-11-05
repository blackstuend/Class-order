const server = require('./app.js')
server.mongoose.connect('mongodb://localhost/face');
// listen
// listen
server.server.listen(3000,function(){
    console.log('listen on port')
    server.mkdir_class()
    server.mkdir_user()
})
