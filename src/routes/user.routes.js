import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([{
        name: 'avatar',
        maxCount: 1
      },
      {
        name: 'coverImage',
        maxCount: 1
      }
    ]),
    registerUser
    ) // middleware matlab ki jaate hue mujhse milte hue jaana
    // yha post request aayega toh registerUser function ko call karo. isme upload middleware add krna hai because of the above stated resaon...

router.route("/login").post(loginUser)

// secured routes:
router.route("/logout").post(verifyJwt, logoutUser) // verifyJwt is a middleware which is used to verify the jwt token
export default router;