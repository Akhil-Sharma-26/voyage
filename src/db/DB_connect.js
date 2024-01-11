import mongoose from "mongoose";
import DB_NAME from '../constants.js';


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("Database connected")
        console.log(`\n Connected to MongoDB: ${connectionInstance.connection.host}`) // connectionInstance.connection.host is used to get the host name
        // HW: console log the connectionInstance object and learn and see what all properties are there
    } catch (error) {
        console.error("MongoDB Error connecting", error)
        process.exit(1); // if the database is not connected then the process will exit
        // throw error;
    }
}

export default connectDB;