 import User from "../models/user.model";
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