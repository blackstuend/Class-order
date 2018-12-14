const mongoose =require('mongoose')
const Schema = mongoose.Schema;
const Account_data = new Schema({
    account: String,
    name :String, 
    number: Number,
    password: String
});