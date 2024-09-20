const mongoose = require('mongoose');
const { Schema } = mongoose;
const DetailsSchema = new Schema({
    
    rollno:{
        type:Number,
        required:true,
        unique:true
    },
    name:{
        type:String,
       
        required:true
    },
    LibraryAvailed: {
        type:String,
        default:"NA",
        required:true
    },
    AcademicFeesPaid:{
        type:Number,
        default:0,
        required:true
    },
    TandPFeesPaid:{
        type:Number,
        default:0,
        required:true
    },
    TotalFeesPaid: {
        type:Number,
        default:0,
        required:true
    }

   
  });
  let details=mongoose.model('Details',DetailsSchema);
  module.exports=details