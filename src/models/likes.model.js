import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new mongoose.Schema({
    video:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Video",
        // required:true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        // required:true
    },
    tweet:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Tweet",
    },
    likedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        // required:true
    }
},{timestamps:true})
const like  = mongoose.model("Like",likeSchema);   
export default like;
