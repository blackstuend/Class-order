const Router = require('koa-router')
const common = require('../model/common')
const router = module.exports = new Router()
const face_model = require('../model/face_model')
//delcare
var check_login = true;
const professor_option = { user_option: 'Professor', check_login: check_login }
const student_option = { user_option: 'Student', check_login: check_login }
const ClsList = { list: ['ccc', 'kcg', 'gcc'] }


var rasberry_machine = []
//router start 
router
    .get('/', async function (ctx) {
        if (ctx.session.body == null)
            await ctx.render('index')
        else if (ctx.session.body.user_option == "stu") {
            ctx.redirect('user_stu')
        }
        else
            ctx.redirect('user_pro')
    })
    .get('/stulogin', async function (ctx) {
        await ctx.render('login', student_option)
        student_option.check_login = true;
    })
    .get('/prologin', async function (ctx) {
        await ctx.render('login', professor_option)
        professor_option.check_login = true;
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
        ctx.session.body = { user_option: "pro", ID: docs.ID }
        ctx.redirect("/user_pro")
    })
    .post('/student_register', async function (ctx) {
        var docs = await common.stu_save(ctx.request.body)
        ctx.session.body = { user_option: "stu", ID: docs.ID }
        common.create_dir(docs.ID)
        ctx.redirect("/user_stu")
    })


    //post login
    .post('/student_login', async function (ctx) {
        var docs = await common.stu_find(ctx.request.body)
        if (docs) {
            ctx.redirect("/user_stu")
            ctx.session.body = { user_option: "stu", ID: docs.ID }
            common.ckeck_dir(docs.ID)
        }
        else {
            student_option.check_login = false;
            ctx.redirect('back')
        }
    })
    .post('/professor_login', async function (ctx) {
        var docs = await common.pro_find(ctx.request.body)
        if (docs) {
            ctx.session.body = { user_option: "pro", ID: docs.ID }
            ctx.redirect('/user_pro')
        }
        else {
            professor_option.check_login = true;
            ctx.redirect('back')
        }
    })

    //ajax with reigster determine if ID exist
    .post('/student_find', async function (ctx) {
        var docs = await common.stu_find(ctx.request.body)
        if (docs)
            ctx.body = false
        else
            ctx.body = true
    })
    .post('/professor_find', async function (ctx) {
        var docs = await common.pro_find(ctx.request.body)
        if (docs)
            ctx.body = false
        else
            ctx.body = true
    })
    .get('/logout', async function (ctx) {
        ctx.session.body = null;
        ctx.redirect('/')
    })

    //get user_interface
    .get('/user_stu', async function (ctx) {
        var name = 123
        var cls = ctx.query.cls
        var docs = await common.stu_find({ ID: ctx.session.body.ID })
        await ctx.render('user_stu', {
            profile: docs,
            name: name,
            cls: cls,
        })
    })

    .get('/user_pro', async function (ctx) {
        var docs = await common.pro_find({ ID: ctx.session.body.ID })
        await ctx.render('user_pro', { profile: docs })
    })
    //save photo
    .post('/face_save', async function (ctx) {
        var file = ctx.request.files.file
        common.save_photo(file, ctx.session.body.ID)
        ctx.body = "success"
    })

    // create class
    .post('/create_class', async function (ctx) {
        ctx.request.body.ID = ctx.session.body.ID
        docs = await common.save_class_data(ctx.request.body)
        ctx.redirect('/')
    })
    .get('/search', async function (ctx) {
        var query = ctx.request.query;
        var docs = await common.stu_find({ ID: ctx.session.body.ID })
        var search_thing = await common.search_class(query)
        await ctx.render('search', { profile: docs })
    })
    .post('/card', async function (ctx) {
        var query = ctx.request.body;
        query.person_name = []
        query.person = query.person - 0
        query.max = query.max - 0
        query.pli = query.pli - 0
        for (var i = 1; i <= query.person; i++) {
            query.person_name.push(query[`play${i}`])
        }
        ctx.render('card', { query: query })
        ctx.body = '123'
        await ctx.render("card", { query: query })
    })

    .get('/user_stu/:class_number', async function (ctx) {
        var docs = await common.stu_find({ ID: ctx.session.body.ID })
        var class_number = ctx.params.class_number
        var class_profile = await common.get_allclass({ class_number: class_number })
        await ctx.render('StuApplyCLS', {
            class_profile: class_profile,
            list: ClsList,
            profile: docs,
        })
    })
    .get('/user_stu/stu_rollcall/:class_number', async function (ctx) {
        var docs = await common.stu_find({ ID: ctx.session.body.ID })
        var class_number = ctx.params.class_number
        var class_profile = await common.get_allclass({ class_number: class_number })

        var db = await common.find_order(class_number)
        console.log(db)


        await ctx.render('stu_rollcall', {
            class_profile: class_profile,
            list: ClsList,
            profile: docs,
            db : db
        })
    })
    .post('/addCLS', async function (ctx) {
        var body = ctx.request.body
        var obj = { student_ID: ctx.session.body.ID, class_number: body.number, class_time: body.time, class_name: body.named }
        await common.add_stuclass(obj)
        ctx.redirect('/user_stu?cls=1')
        // face_model.tranning_class(body.number,ctx.session.body.ID)
        common.tranning_req(body.number, ctx.session.body.ID)
    })
    .get('/get_class', async function (ctx) { //for the ajax
        var docs = await common.pro_find({ ID: ctx.session.body.ID })
        var docs_obj = { name: docs.name }
        var table = await common.get_class(docs_obj);
        ctx.body = table[0]
    })
    .get('/getallclass', async function (ctx) {
        var docs = await common.get_class({})
        ctx.body = docs;
    })
    .get('/get_stu_class', async function (ctx) {
        var class_array = await common.find_stuclass({ student_ID: ctx.session.body.ID })
        return ctx.body = class_array;
    })
    .post('/rasberry', async function (ctx) {
        var m_n = ctx.request.body.machine_number; //m_n = machine_number
        var check_save = rasberry_machine.some(function(index){
            return index.number == m_n
        })
        if (!check_save) {
            rasberry_machine.push({ number: m_n, status: 'waitting', class_number: null,order_time:null,stu:[],Time:new Date() })
            return ctx.body = 'save success'
        };
        rasberry_machine.forEach(function(val,index){
            if(val.status == 'already')
            {
                rasberry_machine[index].status = 'running'
                return ctx.body = require('../tranning_class/' + val.class_number + '.json')
            }
        })
    })
    .get('/user_pro/:class_number', async function (ctx) {
        var class_number = ctx.params.class_number
        var class_order = await common.find_order(class_number)
        var docs = await common.pro_find({ ID: ctx.session.body.ID })
        var class_name = await common.get_allclass({class_number:class_number})

        console.log(class_number,class_order)
        await ctx.render('pro_open', { ras: rasberry_machine, class_number: class_number ,
                                        class_order:class_order , profile: docs , name:class_name })
    })
    .get('/rollcall/:class_number',async function(ctx){
        var class_number = ctx.params.class_number
        var class_order = await common.find_order(class_number)
        var docs = await common.pro_find({ ID: ctx.session.body.ID })
        var class_name = await common.get_allclass({class_number:class_number})

        console.log(class_number,class_order)
        await ctx.render('rollcall', { ras: rasberry_machine, class_number: class_number ,
                                        class_order:class_order , profile: docs , name:class_name })
    
    })
    .post('/selet_rasberry', async function (ctx) {
        var body = ctx.request.body;
        var selet_machine_num = body.ras_num
        var class_number = body.class_number
        var class_time = body.time
        rasberry_machine.map(function(index){
            if(index.number == selet_machine_num){
                index.status = 'already'
                index.class_number = class_number
                index.time = class_time;
                return index;
            }
        })
        console.log(rasberry_machine)
        ctx.redirect('/rollcall/' + class_number)
    })
    .post('/save_class_stu',async function(ctx){
        var body = ctx.request.body
        var m_n = body.machine_number
        var stu = body.stu
        rasberry_machine.map(function(index){
            if(index.number == m_n){
                index.stu.push(stu);
                return index;
            }
        })
        return ctx.body = 'success save'
    })
    .post('/finish_save',async function(ctx){
        var body = ctx.request.body
        var m_n = body.machine_number
        rasberry_machine.forEach(function(val,index){
            if(val.machine_number == m_n){
                common.save_order(rasberry_machine[index])
                rasberry_machine.splice(index,1)
                return ctx.body = 'success save'
            }
        })
    })
