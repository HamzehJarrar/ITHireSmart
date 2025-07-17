import express, { Router } from "express";
import { check } from "express-validator";
import auth from "../../middleware/auth.js";
import * as handlers from "../users/usershandlers.js"
import { registerValidator } from "../../middleware/registervalidate.js"
import validaterror from "../../middleware/validationresult.js";
import checkRole from "../../middleware/checkRole.js";
import photoUpload from "../../middleware/photoUpload.js"

const router = express.Router();

/********************************** 
get the request body
validate the request body
check if the user already exists , yes --> error // no --> create the user
Encrypt the password
save data in DB
using JWT send back the response --> user id 


// -----------------------
// 1) registration
// -----------------------
/**
@router : POST /api/users/register
@access public
@method POST
*************************************/
router.route("/register")
  .post(
    registerValidator,
    validaterror,
    handlers.register
  );

// -----------------------
// 2) Email Verification
// -----------------------
/**
 * @route   GET /api/users/verify-email?token=...
 * @access  Public
 */
router.route("/verify-email")
  .get(handlers.verifyEmail);

// -----------------------
//  forgot Password
// -----------------------

router.route("/forgot-password")
  .post(handlers.forgotPassword);

// -----------------------
//  Reset Password
// -----------------------

router.route("/reset-password")
  .post(handlers.resetPassword);

// /**
// @Desc : login user
// @router : POST /api/users/login
// @access public
// @method  POST
// */
// router.route("/login")
// .post(
//   check("email", "Please include a valid email").isEmail()
//   ,check("password", "Password must be strong").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
//   ,handlers.login
// )




/*
Path : GET /api/users
Desc : Takes a Token and returns the user information
Private
*/
router.route("/myprofile")
  .get(auth, handlers.myprofile)



/***
@Path : GET /api/users/editinfo
@Desc : Takes a Token and returns the user information
@access : Private
**/
router.route("/editinfo")
  .patch(auth, handlers.editInfo)



/***
@Path : GET /api/users/getcount
@Desc : returns the infoemation count
@access : Private(only admin)
**/
router.route("/getcount")
  .get(auth, checkRole("admin"), handlers.getcount)



router.route("/uploadphoto")
  .post(auth, photoUpload.single("image"), handlers.uploadphoto)

router.route("/getphoto")
  .get(auth, handlers.getphoto)

router.route("/getallusers")
  .get(handlers.getAllUsers)
  //.get(auth, checkRole("admin"), handlers.getallusers) // to be handled later

export default router;
