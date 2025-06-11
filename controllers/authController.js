
// const userModel= require('../Models/userModel');
const userModel= require('../models/userModel');
const { hashPassword, comparePassword } = require('../helpers/authHelper');

const JWT = require('jsonwebtoken');
const registerController=async (req,res)=>{

    try {  
        const {name, email,password,phone,address,answer}= req.body;
        // Validation
        if(!name ){
            return res.status(400).json({
              success: false,
              message: "name field is required",
            });
        }
        
        if (!email) {
          return res.status(400).json({
            success: false,
            message: "email field is required",
          });
        }
        if (!password) {
          return res.status(400).json({
            success: false,
            message: "password field is required",
          });
        }
        if (!phone) {
          return res.status(400).json({
            success: false,
            message: "phone field is required",
          });
        }
        if (!address) {
          return res.status(400).json({
            success: false,
            message: "address field is required",
          });
        }
        if(!answer){
        return res.status(400).json({
            success: false,
            message: "answer field is required",
          });
        }


        //await

        const user= await userModel.findOne({email});
        if(user){
            return res.status(200).json({
                success: false,
                message: "User already registered",
            });
        }

        // Register User
        const hashedPassword= await hashPassword(password);
        const newUser= new userModel({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            answer, 
      
        });
        await newUser.save();
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser,
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });

}
};

// Login Controller

const loginController=async (req,res)=>{
    try {
        const {email,password}= req.body;
        // Validation
        if(!email ||!password ){
            return res.status(404).json({
              success: false,
              message: "invalide email or password",
            });
        }
        
        // Check if user exists
        const user= await userModel.findOne({email});
        if(!user){
            return res.status(200).json({
                success: false,
                message: "User not found",
            });
        }
        const isMatch= await comparePassword(password,user.password);
        
        // Check if user exists
        if(!isMatch){
            return res.status(200).json({
                success: false,
                message: "Invalid password",
            });
        }
        const token= JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'5d'});
        res.status(200).json({
            success: true,
            message: "Login successful",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
            },
            token,
        });
    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
const forgotPasswordController=async (req,res)=>{
    try {
        const {email,answer,newPassword}= req.body;
        // Validation
        if(!email ){
            return res.status(400).json({
              success: false,
              message: "email field is required",
            });
        }
        if(!answer ){
            return res.status(400).json({
              success: false,
              message: "answer field is required",
            });
        }

        if(!newPassword ){
            return res.status(400).json({
              success: false,
              message: "newPassword field is required",
            });
        }

        
        // Check if user exists
        const user= await userModel.findOne({email});
        if(!user){
            return res.status(200).json({
                success: false ,
                message: "wrong email or answer",
            });
        }
        if(user.answer !== answer){
            return res.status(200).json({
                success: false,
                message: "wrong email or answer",
            });
        }
        const hashedPassword= await hashPassword(newPassword);
       await userModel.findByIdAndUpdate(user._id,{password: hashedPassword,});
         res.status(200).json({
              success: true,
              message: "Password reset successfully",
          });  
    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internalll server error",
        });
    }
}
const getAllUsersController = async (req, res) => {
  try {
    const data = await userModel.find({});
    return res.status(200).json({
      success: true,
      message: "All users",
      data,
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};
  
const updateProfileController = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { name, email, phone, address },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  getAllUsersController,
  updateProfileController,
};