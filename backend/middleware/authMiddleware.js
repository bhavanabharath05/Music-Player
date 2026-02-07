import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();
const protect=async(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader||!authHeader.startsWith("Bearer")){
        return res.status(401).json({message:"Not authorised"});

    }
    const token=authHeader.split(" ")[1];
   try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded.id).select("-password");
        if(!user) return res.status(401).json({message:"not authorised"});
        req.user=user;
        next();
   }catch(error){
    console.error("token verification failed",error.message);
     return res.status(401).json({message:"invalid or expired"});

   }
}; 
export default protect;