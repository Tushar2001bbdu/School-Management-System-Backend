const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResultsSchema = new Schema({
   
    rollno:{
        type:Number,
        required:true,
        unique:true
        
    },
    
    name: {
        type:String,
        default:"Anil",
        required:true
    },
    marks: {
        type:Number,
        required:true,
        default:0
    },
    grade: {
        type:String,
        default:"F"
    },
    attendance:{
        type:Number,
        default:0
    }

   
  });
  let Results=mongoose.model('result',ResultsSchema);
  
  module.exports=Results