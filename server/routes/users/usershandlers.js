import jwt, { decode } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/User.js"
import config from "config";

import auth from "../middleware/auth.js";

import validaterror from "../../middleware/validationresult.js";
import { check, validationResult } from "express-validator";
import Joi  from "joi"; 



const router = express.Router();

/*
get the request body
validate the request body
check if the user already exists , yes --> error // no --> create the user
Encrypt the password
save data in DB
using JWT send back the response --> user id 
*/

/*
Path : POST /api/users/register
Desc : Register a new user
Public
*/

router.post(
  "/register",
  check("firstName", "First name is required").notEmpty(),
  check("lastName", "Last name is required").notEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("location", "Location is required").notEmpty(),
  check("dateOfBirth", "Date of birth is required").notEmpty(),
  check("mobileNumber", "Mobile number is required").notEmpty(),
  check("mobileNumber", "Mobile number must be numeric").isNumeric(),
  check("mobileNumber", "Mobile number must be at least 10 digits").isLength({
    min: 10,
  }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      firstName,
      lastName,
      email,
      location,
      dateOfBirth,
      mobileNumber,
      password,
      role,
    } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ param: "email", msg: "Email already exists" }] });
      }
      
      user = new User({
        firstName,
        lastName,
        email,
        location,
        dateOfBirth,
        mobileNumber,
        password:hashedpass,
        dateOfcreation: Date.now(),
        role,
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: Date.now() + 3600000,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "5days" },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res.json({ token });
          }
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

export async function login(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "5days" },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res.json({
              token,
              id: user.id,
              email: user.email,
              role: user.role,
              firstName: user.firstName,
              lastName: user.lastName,
              profilepic:user.profilepic,
            });
          }
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }
;


export async function myprofile (req, res){
  try {
    const foundUser = await User.findById(req.user.id).select("-password");
    res.send(foundUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}





function validateubdateinfo(obj){
  const schema=Joi.object({
    firstName: Joi.string().trim().min(3).max(20),
    lastName:Joi.string().trim().min(3).max(20),
    password:Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
  })
  return schema.validate(obj)
}

export async function editInfo(req,res){
    const {error}=validateubdateinfo(req.body)
    if(error){
      return res.status(400).json({msg: error.details[0].message})
    }
    if(req.body.password){
      const salt=await bcrypt.genSalt(10)
      req.body.password=await bcrypt.hash(req.body.password,salt)
    }

    const updateuser=await User.findByIdAndUpdate(req.user.id,{
      $set:{
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        password:req.body.password,
      }
    },{new :true}).select("-password");
    res.status(200).json(updateuser)

  



    
}