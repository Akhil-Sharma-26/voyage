import asyncHandler from '../utils/async_handler.js';
import ApiError from '../utils/ApiErrorHandling.js';
import User from '../models/user.model.js';
import uploadonCloud from '../utils/cloudinary.services.js';
import ApiResponse from '../utils/ApiResponse.js';
import isPasswordCorrect from '../models/user.model.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken(); // method as defind in modal of user
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        user.accessToken = accessToken;
        await user.save({ validateBeforeSave: false }); // validateBeforeSave is false because we are not updating all field
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Token creation failed");
    }
}
const registerUser = asyncHandler(async (req, res) => {
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

    const { username, email, password, fullName, avatar, coverImage } = req.body;
    // console.log("req.body: ",req.body)
    // console.log("userName:",username);
    if (!username || !email || !password || !fullName) {
        throw new ApiError(400, "All fields are required");
    }
    // Same -  Same but Differenet!! (Up and down)
    // if(
    //     [username, email, password, fullName].some((val)=>val.trim()==="")
    // ){
    //     throw new ApiError(400, "All fields are required");
    // } 
    const existedUser = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    if (existedUser) {
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
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }
    // uploading on cloudinary
    const avatarCloudinary = await uploadonCloud(avatarLocalPath);
    const coverImageCloudinary = await uploadonCloud(coverImageLocalPath);
    // console.log("avatarCloudinary: ",avatarCloudinary);
    if (!avatarCloudinary) {
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
    if (!CreatedUser) {
        throw new ApiError(500, "User creation failed");
    }
    return res.status(201).json(
        new ApiResponse(200, CreatedUser, "User created successfully")
    )
})
const loginUser = asyncHandler(async (req, res) => {
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
    const { email, username, password } = req.body;
    // console.log(email)
    // console.log(username)
    // console.log(password)
    if (!(email || username)) {
        throw new ApiError(400, "At least username or email is req.");
    }
    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const user = await User.findOne({
        $or: [
            { username: username.toLowerCase() },
            { email }
        ]
    });
    if (!user) {
        throw new ApiError(400, "User does not exist");
    }
    // const isPasswordCorrect = await user.comparePassword(password); // check how this is working
    const isPassValid = await user.isPasswordCorrect(password);
    if (!isPassValid) {
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
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const logedInuser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    } // secure is true because we are using https. Modifyable using server only (not client)
    console.log("accessToken: ", accessToken);
    console.log("refreshToken: ", refreshToken);
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: logedInuser, accessToken, refreshToken },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    // Some Steps:
    // 1. Get the refresh token from the client.
    // here by using middleware of auth
    // 2. Check if the refresh token exists in the database
    // 3. If the refresh token exists then delete it from the database
    // 4. Send the response to the client
    // 5. Test the API using postman
    // 6. Test the API using frontend
    await User.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1 // 1 means true, this is used to delete the refreshToken
        }
    },
        {
            new: true // new is used to return the updated document
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User Logged Out!!"))
})

// agr refresh token khtm ho gya h to clien ek aur req marke token refresh krva ske 
// refresh token ko use krke
// refresh token ko use krke new access token bnwa skte h
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken || req.headers.refreshToken
    console.log("incomingRefreshToken: ", incomingRefreshToken)
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    console.log("decodedToken: ", decodedToken)
    const user = await User.findById(decodedToken?.id)
    console.log("user: ", user)
    if (!user) {
        throw new ApiError(401, "Invalid refresh token");
    }
    if (user?.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Refresh token has expired"); // ? is used because user can be null or undefined and we can not access refreshToken property of null or undefined 
    }
    const options = {
        httpOnly: true,
        secure: true
    }
    const { accessToken, newrefreshToken } = await generateAccessAndRefreshTokens(user._id)
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newrefreshToken, options).json(new ApiResponse(200, { accessToken, refreshToken: newrefreshToken }, "Access Token refreshed successfully"))

    // throw new ApiError(401, error?.message || "Invalid refresh token");
})
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isPassValid = await user.isPasswordCorrect(currentPassword);
    if (!isPassValid) {
        throw new ApiError(401, "Invalid OldPassword");
    }
    user.password = newPassword;
    await user.save({
        validateBeforeSave: false
    });
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})
const getUserProfile = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        ))
})
const updateAccDetails = asyncHandler(async (req, res) => {
    const { fullName, username, email } = req.body;
    console.log("req.body: ", req.body)
    if (!(fullName || username || email)) {
        throw new ApiError(400, "At least one field is required");
    }
    console.log("fullName:", fullName)
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            fullName,
            username: username?.toLowerCase(),
            email: email?.toLowerCase(),
        }
    }, {
        new: true
    }).select("-password")
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User details updated successfully"))
})
// image upload or update should be done in diff controllers and routes
const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalFile = req.file?.path
    if (!avatarLocalFile) {
        throw new ApiError(400, "Avatar is required");
    }
    const avatarCloudinary = await uploadonCloud(avatarLocalFile);
    if (!avatarCloudinary.url) {
        throw new ApiError(400, "Error while uploading avatar");
    }
    console.log("avatarCloudinary: ", avatarCloudinary.url)
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: avatarCloudinary.url
        }
    }, {
        new: true
    }).select("-password")
    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Avatar updated successfully")
        )
})
// TODO Delete the old avatar Image
const updateCover = asyncHandler(async (req, res) => {
    const CoverLocalFile = req.file?.path
    if (!CoverLocalFile) {
        throw new ApiError(400, "Cover is missing");
    }
    const CoverCloudinary = await uploadonCloud(CoverLocalFile);
    if (!CoverCloudinary.url) {
        throw new ApiError(400, "Error while uploading Cover Image");
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            coverImage: CoverCloudinary.url
        }
    }, {
        new: true
    }).select("-password")
    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Cover Image updated successfully")
        )
})
const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params
    console.log("username: ", username)
    console.log("req.user: ", req.params)
    if (!username?.trim()) {
        throw new ApiError(400, "Username is required");
    }
    const channel = await User.aggregate([
        {
            $match: {
                username: username.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers",
                },
                channelsSubscribedCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$subscribers.subscriber"],
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedCount: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
                createdAt: 1,
            }
        }
    ])
    console.log(channel)
    // what data type does aggreagate returns: array
    if (!channel?.length) {
        throw new ApiError(404, "Channel not found");
    }
    return res.status(200).json(new ApiResponse(200, channel[0], "Channel profile fetched successfully"))
})
const getUserHistory = asyncHandler(async (req, res) => {
    // const {username} = req.params
    // if(!username?.trim()){
    //     throw new ApiError(400, "Username is required");
    // }
    // const channel = await User.aggregate([
    //     {
    //         $match:{
    //             username: username.toLowerCase()
    //         }
    //     },
    //     {
    //         $lookup:{
    //             from: "videos",
    //             localField: "watchedHistory",
    //             foreignField: "_id",
    //             as: "watchedVideos"
    //         }
    //     },
    //     {
    //         $project:{
    //             watchedVideos: 1,
    //             fullName: 1,
    //             username: 1,
    //             avatar: 1,
    //             coverImage: 1,
    //             email: 1,
    //             createdAt: 1,
    //         }
    //     }
    // ])
    // console.log(channel)
    // // what data type does aggreagate returns: array
    // if(!channel?.length){
    //     throw new ApiError(404, "Channel not found");
    // }
    // return res.status(200).json(new ApiResponse(200,channel[0],"Channel profile fetched successfully"))
}) // TODO
// const getUserLikedVideos = asyncHandler(async(req,res)=>{}) // TODO
// const getUserSavedVideos = asyncHandler(async(req,res)=>{}) // TODO
// const getUserSubscriptions = asyncHandler(async(req,res)=>{}) // TODO
// const getUserLikedComments = asyncHandler(async(req,res)=>{}) // TODO
// const getUserSavedComments = asyncHandler(async(req,res)=>{}) // TODO
// const getUserLikedReplies = asyncHandler(async(req,res)=>{}) // TODO
// const getUserSavedReplies = asyncHandler(async(req,res)=>{}) // TODO
// const getUserLikedChannels = asyncHandler(async(req,res)=>{}) // TODO
// const getUserSavedChannels = asyncHandler(async(req,res)=>{}) // TODO
// const getUserLikedPlaylists = asyncHandler(async(req,res)=>{}) // TODO
// const getUserSavedPlaylists = asyncHandler(async(req,res)=>{}) // TODO
// const getUserLikedCategories = asyncHandler(async(req,res)=>{}) // TODO
// const getUserSavedCategories = asyncHandler(async(req,res)=>{}) // TODO
// const getUserLikedTags = asyncHandler(async(req,res)=>{}) // TODO
// const getUserSavedTags = asyncHandler(async(req,res)=>{}) // TODO
// const getUserLikedPosts = asyncHandler(async(req,res)=>{}) // TODO
// const getUserSavedPosts = asyncHandler(async(req,res)=>{}) // TODO

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchedHistory",
                foreignField: "_id",
                as: "watchedVideos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [{
                                $project: {
                                    fullName: 1,
                                    username: 1,
                                    avatar: 1
                                }
                            }]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        },
    ])
    return res.status(200).json(new ApiResponse(200, user[0]?.watchedVideos, "Watch History fetched successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getUserProfile,
    updateAccDetails,
    updateAvatar,
    updateCover,
    getUserChannelProfile,
    getUserHistory,
    getWatchHistory
}
