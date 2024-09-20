const mongoose = require('mongoose');
const { Schema } = mongoose;
const UsersSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    rollno:{
        type:String,
        required:true,
        unique:true
    },
        name: {
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    course:{
        type:String,
        required:true
    },
    section:{
        type:String,
        required:true
    },
    branch: {
        type:String,
        required:true
    },
    classteacher:{
        type:String,
        required:true
    },
    teacherrollno:{
        type:Number,
        required:true
    }

   
  });
  let users=mongoose.model('students',UsersSchema);
  module.exports=users