import mongoose from "mongoose";
const PlaylistSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false
    },
    videos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Video",
        required:false
    }],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
},
    {
        timestamps:true
    })
    const Playlist = mongoose.model("Playlist",PlaylistSchema);
    export default Playlist;