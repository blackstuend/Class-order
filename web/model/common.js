const db=require('./db/account')
module.exports={
    stu_save:async function(body){
        var save=new db.student_model(body);
        docs=await save.save()
        return docs
    },
    pro_save:async function(body){
        var save=new db.professor_model(body);
        docs=await save.save()
        return docs
    },
    stu_find:async function(body){
        console.log(body);
        var docs=await db.student_model.find(body)
        if(docs.length==1)
        return docs[0]
        else 
        return null
    },
    pro_find:async function(body){
        var docs=await db.professor_model.find(body)
        if(docs.length==1)
        return docs[0]
        else 
        return null
    }
}