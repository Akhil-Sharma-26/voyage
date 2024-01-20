import mongoose , {Schema}from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose.Schema({
    videoFile:{
        type:String, // url of the video using cloudinary
        required:true
    },
    thumbnail:{
        type:String, // url of the image using cloudinary
        required:true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String, 
        required:false
    },
    views:{
        type:Number,
        required:false
    },
    duration:{
        type:Number, // data of vid using cloudinary
        required:true
    },
    isPublished:{
        type:Boolean,
        default: true,
        required:true
    },
},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate); // mongooseAggregatePaginate is used to paginate the data ie. to show the data in pages

const Video = mongoose.model("Video",videoSchema);
export default Video;