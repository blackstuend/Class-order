const Router = require('koa-router')
const common = require('../model/common')
const router = module.exports = new Router()

//delcare
var check_login=true;
const professor_option = { user_option: 'Professor' ,check_login:check_login}
const student_option = { user_option: 'Student',check_login:check_login}

//router start 
router
    .get('/', async function (ctx) {
        if (ctx.session.body == null)
            await ctx.render('index')
        else if(ctx.session.body.user_option == "stu"){
            ctx.redirect('user_stu')
        }
        else
        ctx.redirect('user_pro')
    })
    .get('/stulogin', async function (ctx) {
        await ctx.render('login', student_option)
        student_option.check_login=true;
    })
    .get('/prologin', async function (ctx) {
        await ctx.render('login', professor_option)
        professor_option.check_login=true;
    })
    .get('/face', async function (ctx) {
        await ctx.render('face')
    })
    .get('/student_register', async function (ctx) {
        await ctx.render('register', student_option)
    })
    .get('/Professor_register', async function (ctx) {
        await ctx.render('register', professor_option)
    })




    //post regiser 
    .post('/Professor_register', async function (ctx) {
        var docs = await common.pro_save(ctx.request.body)
        ctx.session.body={user_option:"pro",ID:docs.ID}
        ctx.redirect("/user_pro")
    })
    .post('/student_register', async function (ctx) {
        var docs = await common.stu_save(ctx.request.body)
        ctx.session.body={user_option:"stu",ID:docs.ID}
        common.create_dir(docs.ID)
        ctx.redirect("/user_stu")
    })


    //post login
    .post('/student_login', async function (ctx) {
        var docs = await common.stu_find(ctx.request.body)
        if (docs) {
            ctx.redirect("/user_stu")
            ctx.session.body={user_option:"stu",ID:docs.ID}
        }
        else
        {
            student_option.check_login=false;
            ctx.redirect('back')
        }
    })
    .post('/professor_login', async function (ctx) {
        var docs = await common.pro_find(ctx.request.body)
        if (docs) {
            ctx.session.body={user_option:"pro",ID:docs.ID}
            ctx.redirect('/user_pro')
        }
        else
        {
            professor_option.check_login=true;
            ctx.redirect('back')
        }
    })

    //ajax with reigster determine if ID exist
    .post('/student_find', async function (ctx) {
        console.log(ctx.request.body)
        var docs = await common.stu_find(ctx.request.body)
        if (docs)
            ctx.body = false
        else
            ctx.body = true
    })
    .post('/professor_find', async function (ctx) {
        console.log(ctx.request.body)
        var docs = await common.pro_find(ctx.request.body)
        if (docs)
            ctx.body = false
        else
            ctx.body = true
    })
    .get('/logout',async function(ctx){
        ctx.session.body=null;
        ctx.redirect('/')
    })

    //get user_interface
    .get('/user_stu', async function (ctx) {
        var docs = await common.stu_find({ID:ctx.session.body.ID})
        await ctx.render('user_stu',{profile:docs})
    })
    .get('/user_pro',async function(ctx){
        var docs = await common.pro_find({ID:ctx.session.body.ID})
        var table = await common.take_class_table(ctx.session.body.ID);
        console.log(table);
        await ctx.render('user_pro',{profile:docs,table:table}) 
    })
    //save photo
    .post('/face_save',async function(ctx){
        var file = ctx.request.files.file
        common.save_photo(file,ctx.session.body.ID)
        ctx.body = "success"
    })

    // create class
    .post('/create_class',async function(ctx){
        ctx.request.body.ID = ctx.session.body.ID
        console.log(ctx.request.body);
        docs=await common.save_class_data(ctx.request.body)
        console.log(docs)
        ctx.redirect('/')
    })