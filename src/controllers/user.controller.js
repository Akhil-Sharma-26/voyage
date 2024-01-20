import asyncHandler from '../utils/async_handler.js';
import ApiError from '../utils/ApiErrorHandling.js';
import User from '../models/user.model.js';
import uploadonCloud from '../utils/cloudinary.services.js';
import ApiResponse from '../utils/ApiResponse.js';
import isPasswordCorrect from '../models/user.model.js';
const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken(); // method as defind in modal of user
        const refreshToken = user.generateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false}); // validateBeforeSave is false because we are not updating all field
        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "Token creation failed");
    }
}
const registerUser=asyncHandler(async(req,res)=>{
    // Some Steps:
    // 1. Get email, username and password from user
    // 2. Check if the user exists in the database. (Validations - eg. all not empty, email is valid, password is strong)
    // Check for images and avatars
    // upload to cloudinary, check avatar espacially
    // create user object- create entry in DB
    // remove password and refresh tokens from the response
    // Check for user creation
    // return response to the client



    // 3. If the user exists then throw an error
    // 4. If the user does not exist then create a new user
    // 5. Hash the password
    // 6. Save the user in the database
    // 7. Send the user details to the client
    // 8. Handle the error if any
    // 9. Send the response to the client
    // 10. Test the API using postman
    // 11. Test the API using frontend

    const {username, email, password, fullName, avatar, coverImage} = req.body;
    // console.log("req.body: ",req.body)
    // console.log("userName:",username);
    if( !username || !email || !password || !fullName){
        throw new ApiError(400, "All fields are required");
    }
    // Same -  Same but Differenet!! (Up and down)
    // if(
    //     [username, email, password, fullName].some((val)=>val.trim()==="")
    // ){
    //     throw new ApiError(400, "All fields are required");
    // } 
    const existedUser = await User.findOne({
        $or:[
            { username },
            { email }
        ]
    })
    if(existedUser){
        throw new ApiError(400, "User already exists with this username or email");
    }
    // console.log("req.files: ",req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path  // req.files access is given to us by Multer (middleware) and it is an array of files. ? because of optional chaining
    // let coverImageLocalPath = req.files?.coverImage[0]?.path 
    // if(coverImageLocalPath == undefined){
    //     // console.log("coverImageLocalPath is undefined");
    //     coverImageLocalPath = "";
    // }
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }
    // uploading on cloudinary
    const avatarCloudinary = await uploadonCloud(avatarLocalPath);
    const coverImageCloudinary = await uploadonCloud(coverImageLocalPath);
    // console.log("avatarCloudinary: ",avatarCloudinary);
    if(!avatarCloudinary){
        throw new ApiError(400, "Avatar is required");
    }
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        fullName,
        avatar: avatarCloudinary.url,
        coverImage: coverImageCloudinary?.url || "" // as I have not checked if coverImage is present or not
    })
    // console.log("user: ",user);
    const CreatedUser = await User.findById(user._id).select("-password -refreshToken");
    // console.log("CreatedUser: ",CreatedUser);
    if(!CreatedUser){
        throw new ApiError(500, "User creation failed");
    }
    return res.status(201).json(
        new ApiResponse(200, CreatedUser, "User created successfully")
    )
})  
const loginUser=asyncHandler(async(req,res)=>{
    // Some Steps:
    // 1. Get email and password from user
    // 2. Check if the user exists in the database. (Validations - eg. all not empty, email is valid, password is strong)
    // 3. If the user exists then check the password
    // 4. If the password is correct then create access and refresh token
    // 5. Save the JWT token in the database
    // 6. Send the JWT token to the client/ cookies
    // 7. Test the API using postman
    // 9. Test the API using frontend
    console.log(req.body)
    const {email, username, password} = req.body;
    console.log(email)
    console.log(username)
    console.log(password)
    if(!(email || username)){
        throw new ApiError(400, "At least username or email is req.");
    }
    if(!password){
        throw new ApiError(400, "Password is required");
    }
    
    const user = await User.findOne({
        $or:[
            { username: username.toLowerCase() },
            { email }
        ]
    });
    if(!user){
        throw new ApiError(400, "User does not exist");
    }
    // const isPasswordCorrect = await user.comparePassword(password); // check how this is working
    const isPassValid = await user.isPasswordCorrect(password);
    if(!isPassValid){
        throw new ApiError(401, "Password is incorrect");
    }
    // const token = await user.createJWTToken();
    // if(!token){
    //     throw new ApiError(500, "Token creation failed");
    // }
    // console.log("token: ",token);
    // res.cookie("token", token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production" ? true : false,
    //     expires: new Date(Date.now() + 3600000) // 1 hour
    // })
    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id);

    const logedInuser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    } // secure is true because we are using https. Modifyable using server only (not client)
    return res.status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200, 
            {user:logedInuser,accessToken,refreshToken},
            "User logged in successfully"
            )
    )
})

const logoutUser=asyncHandler(async(req,res)=>{
    // Some Steps:
    // 1. Get the refresh token from the client.
    // here by using middleware of auth
    // 2. Check if the refresh token exists in the database
    // 3. If the refresh token exists then delete it from the database
    // 4. Send the response to the client
    // 5. Test the API using postman
    // 6. Test the API using frontend
    await User.findByIdAndUpdate(req.user._id,{
        $set: {
            refreshToken: undefined
        }
    },
    {
        new: true // new is used to return the updated document
    }
    )
    const options = {
        httpOnly: true,
        secure:true
    }
    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"User Logged Out!!"))
})

// agr refresh token khtm ho gya h to clien ek aur req marke token refresh krva ske 
// refresh token ko use krke
// refresh token ko use krke new access token bnwa skte h
const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken || req.headers.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "Refresh token is required");
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?.userId)
        if(!user){
            throw new ApiError(401, "Invalid refresh token");
        }
        if(user?.refreshToken !== incomingRefreshToken){
            throw new ApiError(401, "Refresh token has expired"); // ? is used because user can be null or undefined and we can not access refreshToken property of null or undefined 
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
        const {accessToken,newrefreshToken}= await generateAccessAndRefreshTokens(user._id)
        return res.status(200).cookie("accessToken",accessToken, options).cookie("refreshToken",newrefreshToken,options).json(new ApiResponse(200,{accessToken,refreshToken: newrefreshToken},"Access Token refreshed successfully"))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}
