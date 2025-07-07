import { generateToken } from '../lib/utils.js';
import  User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from "../lib/cloudinary.js";

export const signup = async  ( req, res) => {
     const {fullname, email, password } = req.body;
     try{
     //  hash password
     if(!fullname)  return  res.status(400).json({message: "Enter the valid name "})
     if(!email) return  res.status(400).json({message: "Enter the valid email "})
     if(password.length < 6){
          return res.status(400).json({message: "Password must be at least of 8 characters"});

     }
    const user = await User.findOne({email}) 
    if(user) return res.status(400).json({message: 'User already exists'});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
   const newUser = new  User({
     fullName: fullname,
     email:email,
     password: hashedPassword,

   })
   if(newUser){
//  Generate JWT token here
   generateToken(newUser._id, res)
   await newUser.save();
   res.status(201).json({
     _id:newUser._id,
     fullname: newUser.fullName,
     email: newUser.email,
     profilePic: newUser.profilePic,

   })

   } else{
     res.status(400).json({message: "Invalid user data"})
   }
     }
     catch(err){
     console.log("Error in the signup controller:", err);
     res.status(500).json({message: "Internal server error"});

     }
     
}
export const login =  async ( req, res) => {
     const { email, password } = req.body;

     try{
   const user = await User.findOne({email})
   if(!user){
      return res.status(400).json({message: "Invalid Credentials"})
   }
   const isPasswordCorrect =  await bcrypt.compare(password, user.password);
if(!isPasswordCorrect){
     return res.status(400).json({message: "Invalid Credentials"})
}
generateToken(user._id, res);
res.status(200).json({
     _id:user._id,
     fullName: user.fullName,
     email: user.email,
     profilePic: user.profilePic,
})
     } catch(err){
      console.log("Error in login Credentials", err.message);
      res.status(500).json({message: "Internal Server Error"});

     }
     
}
export const logout  = ( req, res) => {
    
     try{
   res.cookie("jwt", "", {maxAge:0})
   res.status(200).json({message: " Logged Out Succesfully"});

     } catch(err){
   console.log("Error in logout controller", err.message);
   res.status(500).json({message: "Internal Server Error"});
   
     }
     
};

export const  updateProfile = async(req, res) => {
     try{
       const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
          return res.status(400).json({message: "Profile pic is required"});

        }
         const uploadResponse = await cloudinary.uploader.upload(profilePic);
         const updatedUser = await User.findById(userId, {profilePic:uploadResponse.secure_url}, {new:true});
         res.status(200).json(updatedUser);

     } catch(err){
    console.log("error in update prfile:", err);
    res.status(500).json({message: "Internal Server Error "});


     }
}

export const checkAuth = (req, res) => {
     try{
        res.status(200).json(req.user);

     } catch(err){
        console.log("Erro in chechAuth Controller", err.message);
        res.status(500).json({message: "Internal Server Error"});
          
     }
}