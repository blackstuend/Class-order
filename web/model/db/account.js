const mongoose =require('mongoose')
const Schema = mongoose.Schema;
const Account_data = new Schema({
    name: String,
    ID: Number,
    password: String
});
const class_data = new Schema({
    ID:Number,
    name:String,
    date:String,
    start_time:String,
    end_time:String
})
const Stuclass_data = new Schema({
    ID:Number,
    name:String,  
})
const Class = new Schema({
    name: String,
    value: String,
    class: [String],
    time: [String],
    class_number:[String]
});
module.exports={
    student_model:mongoose.model('student',Account_data),
    professor_model:mongoose.model('professor',Account_data),
    class_model:mongoose.model('class_data',class_data),
    Stuclass_model:mongoose.model('Stuclass_data',Stuclass_data),
    Class_model : mongoose.model('Class', Class)
}