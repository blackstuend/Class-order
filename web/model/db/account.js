const mongoose =require('mongoose')
const Schema = mongoose.Schema;
const Account_data = new Schema({
    name: String,
    ID: Number,
    password: String
});
module.exports={
    student_model:mongoose.model('student',Account_data),
    professor_model:mongoose.model('professor',Account_data)
}