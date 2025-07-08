 import User from "../models/user.model";
 import Message from "../models/message.model.js"
import { json } from "express";
import cloudinary from "../lib/cloudinary.js";
export const getUsersForSidebar  = async(req, res) =>{
    try{
        const loggedInUserId = req.user._Id;
        const filteredUsers = await User.find({_Id: {$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);

    }  catch(err){
        console.log("Error in getUsersForSidebar: ", err.message);
        res.status(500).json({ error: "Internal server error"});
            
         }
}

export const getMessage = async(req, res) => {
    try{
   const {id:userToChatId } = req.params
   const myId = req.user._Id
   const messages = await Message.find({
    $or:[
        {SenderId:myId, reciverId:userToChatId},
        {SenderId:userToChatId, reciverId:myId}
    ]
   })
   res.status(200),json(messages)
    } catch(err){
   console.log("Error in getMessages Controllers:", err.message);
   res.status(500).json({error: "Internal Server Error"});

    }
}

export const sendMessage = async(req, res) => {
    try{
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._Id;

   let imageUrl;
  if(image){
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;

  }

   const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image: imageUrl
   })
   await newMessage.save();
   // todo: realtume functionalities goes here
   res.status(201).json(newMessage);

    } catch(err){
  console.log("Error in send message conttrtollers: ", err.message);
   res.status(500).json({error: "Internal server Error"});
    }
}