import mongoose from "mongoose";
import DB_NAME from '../constants.js';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim: true, // trim is used to remove the extra spaces from the username
        index: true, // index is used to make the search faster. optimizes search
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim: true,
    },
    fullName:{
        type:String,
        required:true,
        trim: true,
        index: true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    avatar:{
        type:String, // url of the image using cloudinary
        required:true
    },
    // bio:{
    //     type:String,
    //     required:false
    // },
    coverImage:{
        type:String,
        required:false
    },
    // followers:{
    //     type:Array,
    //     required:false
    // },
    // following:{
    //     type:Array,
    //     required:false
    // },
    // posts:{
    //     type:Array,
    //     required:false
    // },
    // likedPosts:{
    //     type:Array,
    //     required:false
    // },
    // savedPosts:{
    //     type:Array,
    //     required:false
    // },
    videosPublished:[
        {
            type: Schema.Types.ObjectId,
            ref:"video",
            required:false
        }
    ],
    watchedHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:"video",
            required:false
        }
    ],
    likedVideos:[
        {
            type: Schema.Types.ObjectId,
            ref:"video",
            required:false
        }
    ],
    refreshToken:{
        type:String,
        required:false
    },
    isVerified:{
        type:Boolean,
        default:false,
        required:true
    },
    // isBlocked:{
    //     type:Boolean,
    //     default:false,
    //     required:true
    // },
},{timestamps:true})

userSchema.pre("save",async function(next){ // Hashin password
    const user = this;
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password,12);
    }
    next();
})
userSchema.methods.isPasswordCorrect = async function(password){ // Checking password
    const user = this;
    return await bcrypt.compare(password,user.password);
}
userSchema.methods.generateAccessToken = async function(){ // Generating access token
    const user = this;
    const token = await jwt.sign({
        id:user._id,
        email:user.email,
        username:user.username,
        fullName:user.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    });
    return token;
}
userSchema.methods.generateRefreshToken = async function(){ // Generating refresh token
    const user = this;
    const token = await jwt.sign(
        {id:user._id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRY});
    return token;
}
const User = mongoose.model("User",userSchema);

export default User;