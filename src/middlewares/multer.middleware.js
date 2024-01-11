import multer from "multer";


const storage = multer.diskStorage({ // notice I am calling the multer.diskStorage() method here, not multer() because I am using disk storage. Its' a middleware
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // removing this for now as it is more complex for our project
    console.log(file);
    //   cb(null, file.fieldname + '-' + uniqueSuffix) // kuch unique jibrish dalte hai taki sab filename unique ho
        cb(null,file.originalname) // not good as the user can have same file name
}
  })
  
  const upload = multer({ storage: storage })

  export default upload;