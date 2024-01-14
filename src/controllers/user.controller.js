import asyncHandler from '../utils/async_handler.js';
import ApiError from '../utils/ApiErrorHandling.js';
import User from '../models/user.model.js';

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

    const {username, email, password, fullName, avatar} = req.body;
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
    const existedUser = User.findOne({
        $or:[
            { username },
            { email }
        ]
    })
    if(existedUser){
        throw new ApiError(400, "User already exists with this username or email");
    }
    console.log("req.files: ",req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path  // req.files access is given to us by Multer (middleware) and it is an array of files. ? because of optional chaining
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }
})  

export {registerUser}
