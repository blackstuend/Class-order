const Router = require('koa-router')
const common = require('../model/common')
const router = module.exports = new Router()

//delcare
var check_login=true;
const professor_option = { user_option: 'Professor' ,check_login:check_login}
const student_option = { user_option: 'Student',check_login:check_login}
const ClsList = {list:['ccc','kcg','gcc']}

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
        //console.log(ctx.request.body)
        var docs = await common.stu_find(ctx.request.body)
        if (docs)
            ctx.body = false
        else
            ctx.body = true
    })
    .post('/professor_find', async function (ctx) {
        //console.log(ctx.request.body)
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
        var name=123
        var cls =ctx.query.cls
        var docs = await common.stu_find({ID:ctx.session.body.ID})
      //  console.log(ctx.request.query,"asd")
      //  console.log(cls)
        var table = await common.take_class_table(ctx.session.body.ID);
        
        await ctx.render('user_stu',{
            profile:docs, 
            name:name,
            cls :cls,
            table : table
        })
        
        
    })
    
    .get('/user_pro',async function(ctx){
        var docs = await common.pro_find({ID:ctx.session.body.ID})
        var table = await common.take_class_table(ctx.session.body.ID);
       // console.log(table);
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
       // console.log(ctx.request.body);
        docs=await common.save_class_data(ctx.request.body)
        //console.log(docs)
        ctx.redirect('/')
    })
    .get('/search',async function(ctx){
        var query=ctx.request.query;
        var docs = await common.stu_find({ID:ctx.session.body.ID})
        var search_thing =await common.search_class(query)
        await ctx.render('search',{profile:docs})
    })
    .post('/card',async function(ctx){
        var query = ctx.request.body;
        query.person_name=[]
        query.person = query.person - 0
        query.max = query.max - 0
        query.pli = query.pli -0
        for(var i = 1;i<=query.person;i++){
            query.person_name.push(query[`play${i}`])
        }
        // console.log(query)
        ctx.render('card',{query:query})
        ctx.body='123'
        await ctx.render("card",{query:query})
    })

    //stu choose class
    // .get('/cccCLS', async function (ctx) {
    //     await ctx.render('StuApplyCLS', {CLS_option:'CCC'})
    // })
    // .get('/kchCLS', async function (ctx) {
    //     await ctx.render('StuApplyCLS', {CLS_option:'kch'})
    // })
    
    .get('/user_stu/:name',async function(ctx){
        var docs = await common.stu_find({ID:ctx.session.body.ID})
        var name= ctx.params.name
        var table = await common.take_class_table(ctx.session.body.ID);
       // console.log(name)
        await ctx.render('StuApplyCLS',{
            name:name,
            list: ClsList,
            profile:docs,
            table : table
        })
    })
    .post('/addCLS',async function(ctx){
        ctx.request.body.ID = ctx.session.body.ID
       console.log(ctx.request.body);
        var cls =ctx.query.cls
        docs=await common.save_Stuclass_data(ctx.request.body)
       console.log(docs)
        ctx.redirect('/user_stu?cls=1')
    })
    