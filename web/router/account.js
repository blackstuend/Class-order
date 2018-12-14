const Router = require('koa-router')

const router=module.exports=new Router()

router
    .get('/',async function(ctx){
        await ctx.render('index')
    })
    .get('/stulogin',async function(ctx){
        await ctx.render('login',{user_option:'Student'}) 
    })
    .get('/prologin',async function(ctx){
        await ctx.render('login',{user_option:'Professor'})
    })
    .get('/Student_register',async function(ctx){
        ctx.body='123'
    })
    .get('/Professor_register',async function(ctx){
        ctx.body='123';
    })
    .get('/face',async function(ctx){
        await ctx.render('face')
        
    })