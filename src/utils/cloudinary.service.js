import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';   // fs is used to read the file from the local storage

// connect to cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});

// upload file to cloudinary
const uploadonCloud = async (Localfile) => {
    try{
        if(!Localfile) {
            // throw new Error("No file found");
            return null;
        } 
        // uploading the file to cloudinary
        const res = await cloudinary.uploader.upload(Localfile,
            {
                resource_type:"auto",
            });
        //file has been uploaded successfully
        
        console.log("File uploaded successfully", res.url);
        return res;
    }catch(err){
        // error while uploading the file
        // remove the file from the local storage as well
        fs.unlinkSync(Localfile); // remove the file from the local storage which is already temporary stored
        console.log(err);
        return null; // return null if there is an error
    }
}
export default uploadonCloud;



// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });