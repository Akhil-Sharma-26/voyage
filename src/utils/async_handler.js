const asyncHandler = (reqHandler) => { // This is a higher order function which takes a request handler function as an argument
    return (req, res, next) => { 
        Promise // here Promise is used to handle the asynchronous code in a synchronous way 
        .resolve(reqHandler(req, res, next)) // here reqHandler is the request handler function which is passed as an argument to asyncHandler function
        .catch((err)=>next(err)) // here next is the error handling middleware
    }
}

export default asyncHandler;

// ! There also another way to do it

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message || "Internal Server Error"
//         })
//     }
// }