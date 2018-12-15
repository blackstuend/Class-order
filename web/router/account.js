const Router = require('koa-router')
const common=require('../model/common')
const router=module.exports=new Router()

//delcare
const professor_option={user_option:'Professor'}
const student_option={user_option:'Student'}

//router start 
router
    .get('/',async function(ctx){
        await ctx.render('index')
    })
    .get('/stulogin',async function(ctx){
        await ctx.render('login',student_option) 
    })
    .get('/prologin',async function(ctx){
        await ctx.render('login',professor_option)
    })
    .get('/face',async function(ctx){
        await ctx.render('face')
        
    })
    .get('/student_register',async function(ctx){
        await ctx.render('register',student_option)
    })
    .get('/Professor_register',async function(ctx){
        await ctx.render('register', professor_option)
    })
    //post regiser 
    .post('/Professor_register',async function(ctx){
        var docs=await common.pro_save(ctx.request.body)
        ctx.session.body=docs;
        ctx.redirect(`${docs.ID}`)
    })
    .post('/student_register',async function(ctx){
        var docs=await common.stu_save(ctx.request.body)
        ctx.session.body=docs;
        ctx.redirect(`${docs.ID}`)
    })
    //post login
    .post('/student_login',async function(ctx){
        var docs=await common.stu_find(ctx.request.body)
        if(docs){
            ctx.redirect(`${docs.ID}`)
        }
        else
            ctx.redirect('back')
    })
    .post('/professor_login',async function(ctx){
        var docs=await common.pro_find(ctx.request.body)
        if(docs){
            ctx.session.body=docs;
            ctx.redirect(`${docs.ID}`)
        }
        else
            ctx.redirect('back')
    })

    //ajax with reigster determine if ID exist
    .post('/student_find',async function(ctx){
        console.log(ctx.request.body)
        var docs=await common.stu_find(ctx.request.body)
        if(docs)
        ctx.body = false
        else
        ctx.body = true
    })
    .post('/professor_find',async function(ctx){
        console.log(ctx.request.body)
        var docs=await common.pro_find(ctx.request.body)
        if(docs)
        ctx.body = false
        else
        ctx.body = true
    })