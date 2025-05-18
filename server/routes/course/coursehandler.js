import Course from "../../models/Course.js"
import { validationResult } from "express-validator";


export async function getallcourses (req,res){
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.json(courses);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }

}



export const postCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const course = new Course({
      user: req.user.id,
      courseTitle: req.body.courseTitle,
      instructorName: req.body.instructorName,
      location: req.body.location,
      courseType: req.body.courseType,
      startAt: req.body.startAt,
      endAt: req.body.endAt,
      description: req.body.description,
      capacity: req.body.capacity,
      studentsEnrolled: req.body.studentsEnrolled,
      topics: req.body.topics,
      registrationLink: req.body.registrationLink,
      materials: req.body.materials,
    });

    await course.save();
    res.json(course);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};


export async function coursesearchbyid (req, res) {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}


export async function deletecourse (req, res){
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    await course.deleteOne();
    res.json({ msg: "Course removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};


export async function updatecourse (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    course.courseTitle = req.body.courseTitle;
    course.instructorName = req.body.instructorName;
    course.location = req.body.location;
    course.courseType = req.body.courseType;
    course.startAt = req.body.startAt;
    course.endAt = req.body.endAt;
    course.description = req.body.description;
    course.capacity = req.body.capacity;
    course.studentsEnrolled = req.body.studentsEnrolled;
    course.topics = req.body.topics;
    course.registrationLink = req.body.registrationLink;
    course.materials = req.body.materials;

    await course.save();
    res.json(course);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
