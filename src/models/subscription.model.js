import mongoose, { Schema } from "mongoose";
const subcriptionSchema = new mongoose.Schema({
    subscriber:{
        type: mongoose.Schema.Types.ObjectId, // one who is subscribing
        ref: "User"
    },
    channel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true});

export const Subscription = mongoose.model("Subscription", subcriptionSchema);