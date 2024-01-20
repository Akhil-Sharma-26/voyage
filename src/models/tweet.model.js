import mongoose from "mongoose";
const tweetSchema = new mongoose.Schema({ 
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 280,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // likes: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Like",
    // }],
    // comments: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Comment",
    // }],
    // retweets: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Tweet",
    // }],
    // isRetweet: {
    //     type: Boolean,
    //     default: false,
    // },
    // retweetData: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Tweet",
    // },
    // replyTo: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Tweet",
    // },
    // pinned: {
    //     type: Boolean,
    //     default: false,
    // },
}, { timestamps: true })

const Tweet = mongoose.model("Tweet", tweetSchema);
export default Tweet;
