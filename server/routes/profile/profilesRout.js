import express from "express";
import auth from "../../middleware/auth.js";
import { check } from "express-validator";
import { validateobjectid } from "../../middleware/validateobjectid.js";
import * as handlers from "../profile/profilesHandlers.js";
const router = express.Router();

/*
1- POST/profiles --> create , update
2- GET/profiles/me --> curent user
3- GET/profiles --> all profiles
4- GET/profiles/user/:userId --> specif user
5- DELETE/profiles/ --> delete user , profile and posts
6- POST/Profiles/upload --> upload profile pic
7- PUT/Profiles/experience --> add experience
8- DELETE/Profiles/experience/:expId --> delete experience
9- PUT/Profiles/education --> add education
10- DELETE/Profiles/education/:eduId --> delete education
*/

/*
 * Create or update profile
 */
router.post("/updateprofile", auth, handlers.updateprofile);

// uploud photo
router.post("/uploadphoto", auth, handlers.uploudphoto);

// get my profile
router.get("/me", auth, handlers.getmyprofile);

// return all users profile
router.get("/showallprofiles", auth, handlers.showallprofiles);

//get profile by id
router.get("/user/:userId", auth, validateobjectid, handlers.getprofilebyid);

//delete User
router.delete("/delete", auth, handlers.deleteUser);

router.put(
  "/experience",
  auth,
  check("title", "Title is required").notEmpty(),
  check("company", "Company is required").notEmpty(),
  check("from", "From date is required and needs to be from the past")
    .notEmpty()
    .custom((value, { req }) => {
      if (new Date(value) > new Date()) {
        throw new Error("From date must be in the past");
      }
      return true;
    }),
  handlers.addexper
);

router.delete(
  "/experience/:expId",
  auth,
  validateobjectid,
  handlers.deleteexper
);

router.put(
  "/education",
  auth,
  check("school", "school is required").notEmpty(),
  check("degree", "degree is required").notEmpty(),
  check("fieldofstudy", "fieldofstudy is required").notEmpty(),
  check("from", "From date is required and needs to be from the past")
    .notEmpty()
    .custom((value, { req }) => {
      if (new Date(value) > new Date()) {
        throw new Error("From date must be in the past");
      }
      return true;
    }),
  handlers.addedu
);

router.delete("/education/:eduId", auth, validateobjectid, handlers.deleteedu);

// add skills
router.put(
  "/addskills",
  auth,
  check("skills", "Skills is required").notEmpty(),
  check("skills", "Skills must be an array of strings").custom((value) => {
    if (Array.isArray(value)) {
      if (!value.every((skill) => typeof skill === "string")) {
        throw new Error("Each skill must be a string");
      }
    } else if (typeof value !== "string") {
      throw new Error("Skills must be a string or an array of strings");
    }
    return true;
  }),
  handlers.addSkills
);

//delete skills
router.delete("/deleteskills/:name", auth, handlers.deleteskillbyname);

export default router;
