//require everything
const Koa=require('koa')
const app=new Koa()
const logger = require('koa-logger')
const koaBody = require('koa-body')
const serve = require('koa-static');
const views = require('koa-views');
const path=require('path')
const session = require('koa-session');
const Router = require('koa-router')
const router=new Router;
const mongoose=require('mongoose')
const account =require('./router/account')
const fs = require('fs')
const dir_check = require('./model/check_dir')
mongoose.connect('mongodb://localhost/face');
const server = require('http').createServer(app.callback())
const io = module.exports = require('socket.io')(server)

// start use
app.use(serve(__dirname + '/public'));
app.use(views(path.join(__dirname, '/views'), { extension: 'ejs' }));
app.use(logger())
app.use(koaBody({ multipart: true }));
app.keys = ['key1'];
app.use(session(app));

// using router
app.use(account.routes())
  .use(account.allowedMethods())
  function mkdir_user() {
    var user_images_path = path.join(__dirname, 'public', "user_images")
    fs.exists(user_images_path, function (exists) {
      if (exists)
        return 
      else
        fs.mkdir(user_images_path, function (err) {
          if (err) console.log(err)
        })
    })
  }
  function mkdir_class(){
    var class_path = path.join(__dirname,'tranning_class')
    fs.exists(class_path, function (exists) {
      if (exists)
        return 
      else
        fs.mkdir(class_path, function (err) {
          if (err) console.log(err)
        })
    })
  }
// listen
server.listen(3000,function(){
    console.log('listen on port')
    dir_check.mkdir_class()
    dir_check.mkdir_user()
});
