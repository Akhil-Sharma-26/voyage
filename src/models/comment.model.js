import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    video:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Video",
        required:true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
},{timestamps:true})
videoSchema.plugin(mongooseAggregatePaginate); // mongooseAggregatePaginate is used to paginate the data ie. to show the data in pages
const Comment = mongoose.model("Comment",commentSchema);
export default Comment;