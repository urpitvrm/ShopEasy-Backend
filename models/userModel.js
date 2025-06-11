const mongoose= require('mongoose');
const dotenv= require('dotenv');
dotenv.config();

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        default:0,
        required:true

    },
    newPassword:{
        type:String,
    //    required:true 
    },
},
{
    timestamps:true
}
);  


module.exports= mongoose.model('User',userSchema);