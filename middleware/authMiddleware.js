import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.js";

const protect = asyncHandler(async(req, res, next)=>{

    console.log('protecting');

    let token;
    token = req.cookies.jwt;

    if(token){
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decode.userId).select('-password');

            next();
        } catch (error) {
            console.log(error); 
            res.status(401);
            throw new Error('Not authorized, tokern failed')
        }
    }else{
        res.status(401);
        throw new Error('Not athorized, no token')
    }    
})


export {protect}