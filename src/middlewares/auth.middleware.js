import ApiErrHandling from "../utils/ApiErrorHandling";
import asyncHandler from "../utils/async_handler";
import { Jwt } from "jsonwebtoken";
import User from "../models/user.model";
export const verifyJwt = asyncHandler(async(req,_,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiErrHandling(
                401,
                "No Token Found"
            )
        }
    
        const DecodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(DecodedToken._id).select('-password -refreshToken')
    
        if(!user){
            throw new ApiErrHandling(
                401,
                "Invalid Token"
            )
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiErrHandling(
            401,
            error?.message || "Invalid Token"
        )
    }
})