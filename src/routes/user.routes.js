import { Router } from "express";
import { changeCurrentPassword, getUserChannelProfile, getUserHistory, getUserProfile, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccDetails, updateAvatar, updateCover } from "../controllers/user.controller.js";
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
router.route("/refresh-token").post(refreshAccessToken) // refresh token ko use krke new access token bnwa rha hu
router.route("/change-password").post(verifyJwt, changeCurrentPassword) // change password
router.route("/profile").get(verifyJwt, getUserProfile) // get user profile
router.route("/update-profile").patch(verifyJwt,updateAccDetails) // update user profile
router.route("/change-avatar").patch(verifyJwt,upload.single('avatar'),updateAvatar) // update user avatar
router.route("/change-cover-image").patch(verifyJwt,upload.single('coverImage'),updateCover) // update user cover image
router.route("/c/:username").get(verifyJwt,getUserChannelProfile) // get user profile by username (c stands for custom route)
router.route("/history").get(verifyJwt,getUserHistory)
export default router;