// require("dotenv").config({path: "./.env"}); // to use the .env file

import dotenv from "dotenv";
import connectDB from "./db/DB_connect.js";
import mongoose from "mongoose";
import DB_NAME from "./constants.js";
import  express  from "express";
const app = express();

dotenv.config({
    path: "./.env"
}); // to use the .env file



connectDB();




















































/*
;(async() => { // The semicolon is used to avoid the error if the previous line is not ended with semicolon
    try { // always use try catch block for async await and while connecting to database
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) // await is used to wait for the response from the database
        app.on("error",(error)=>{ // app.on is used to handle the error
            console.log("error",error); 
            throw error;
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on PORT: ${process.env.PORT}`);
        })
        console.log("datatabe connected")
    } catch (error) {
        console.error("error", error)
        throw error;
    }
})(); */ // ifffi, JS Concept, Here the () after the function is to call the function 
// connectDB();