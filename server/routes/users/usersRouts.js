import express from "express";
import { check} from "express-validator";
import auth from "../../middleware/auth.js";
import * as handlers from "../users/usershandlers.js"
import {registerValidator} from "../../middleware/registervalidate.js"
import validaterror from "../../middleware/validationresult.js";

const router = express.Router();

/********************************** 
get the request body
validate the request body
check if the user already exists , yes --> error // no --> create the user
Encrypt the password
save data in DB
using JWT send back the response --> user id 


@Desc : Register a new user
@router : POST /api/users/register
@access public
@method POST
*************************************/
router.route("/register")
.post(registerValidator,validaterror,handlers.register)


/*
@Desc : login user
@router : POST /api/users/login
@access public
@method  POST
*/
router.route("/login")
.post(
  check("email", "Please include a valid email").isEmail()
  ,check("password", "Password must be strong").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
  ,handlers.login
)


/*
Path : GET /api/users
Desc : Takes a Token and returns the user information
Private
*/
router.route("/myprofile")
.get(auth,handlers.myprofile)


export default router;
