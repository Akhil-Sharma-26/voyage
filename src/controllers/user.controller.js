import asyncHandler from '../utils/async_handler.js';



const registerUser=asyncHandler(async(req,res)=>{
    res.status(200).json({
        success:true,
        message:"register user"
    })
})

export {registerUser}
