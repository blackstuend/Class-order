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
mongoose.connect('mongodb://localhost/face');

// start use
app.use(serve(__dirname + '/public'));
app.use(views(path.join(__dirname, '/views'), { extension: 'ejs' }));
app.use(logger())
app.use(koaBody())
app.keys = ['key1'];
app.use(session(app));

// using router
app.use(account.routes())
  .use(account.allowedMethods())

// listen
app.listen(3000,function(){
    console.log('listen on port')
});