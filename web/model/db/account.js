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
module.exports={
    student_model:mongoose.model('student',Account_data),
    professor_model:mongoose.model('professor',Account_data),
    class_model:mongoose.model('class_data',class_data)
}