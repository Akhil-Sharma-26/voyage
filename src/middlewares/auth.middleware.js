import ApiErrHandling from "../utils/ApiErrorHandling.js";
import asyncHandler from "../utils/async_handler.js";
import jwt  from "jsonwebtoken";
import User from "../models/user.model.js";
export const verifyJwt = asyncHandler(async(req,_,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        // console.log("Token: ",token)

        if(!token){
            throw new ApiErrHandling(
                401,
                "No Token Found"
            )
        }
    
        const DecodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        // console.log("Decoded Token: ",DecodedToken) // shows the object with user data and iat and exp
        const user = await User.findById(DecodedToken?.id).select('-password -refreshToken')
        // console.log("User: ",user)
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