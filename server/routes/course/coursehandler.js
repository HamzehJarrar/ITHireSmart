import Course from "../../models/Course.js";
import { validationResult } from "express-validator";

export async function getallcourses(req, res) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Course.updateMany(
      { endAt: { $lte: today }, isHidden: false },
      { $set: { isHidden: true } }
    );

    const courses = await Course.find({ isHidden: false })
      .sort({ _id: -1 })
      .populate("user", "profilepic firstName lastName");

    res.json(courses);
  } catch (err) {
    console.error("Error:", err.message);
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
      capacity: req.body.capacity,
      topics: req.body.topics,
      isHidden: false,
      requirements: req.body.requirements,
      capacity: req.body.capacity,
      duration: req.body.duration,
    });

    await course.save();
    res.json(course);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

export async function coursesearchbyid(req, res) {
  try {
    const course = await Course.findById(req.params.courseId)
      .sort({ _id: -1 })
      .populate("user", "profilepic firstName lastName");
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

export async function deletecourse(req, res) {
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
}

export async function updatecourse(req, res) {
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
    course.duration = req.body.duration;
    await course.save();
    res.json(course);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

export const enrollCourse = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.students.includes(userId)) {
      return res.status(400).json({ message: "User already enrolled" });
    }

    course.students.push(userId);
    course.studentsEnrolled += 1;

    course.studentsEnrolled = course.students.length;
    await course.save();

    res.status(200).json({ message: "Enrollment successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getCompanyCourses = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.params.userId;
    const courses = await Course.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("students");

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getEnrolledCourses = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "students",
      "firstName lastName profilepic email"
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course.students);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

export const acceptStudent = async (req, res) => {
  const { courseId } = req.params;
  const { studentId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.acceptedStudents.includes(studentId)) {
      course.acceptedStudents.push(studentId);
    }

    course.students = course.students.filter(
      (id) => id.toString() !== studentId
    );

    course.rejectedStudents = course.rejectedStudents.filter(
      (id) => id.toString() !== studentId
    );

    await course.save();
    res.status(200).json({ message: "Student accepted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

export const getAcceptedStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "acceptedStudents",
      "firstName lastName email profilepic"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course.acceptedStudents);
  } catch (err) {
    console.error("Error fetching accepted students:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!course.rejectedStudents.includes(studentId)) {
      course.rejectedStudents.push(studentId);
    }

    course.students = course.students.filter(
      (id) => id.toString() !== studentId
    );
    course.acceptedStudents = course.acceptedStudents.filter(
      (id) => id.toString() !== studentId
    );

    await course.save();
    res.status(200).json({ message: "Student rejected successfully" });
  } catch (error) {
    console.error("Error rejecting student:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRejectedStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "rejectedStudents",
      "firstName lastName email profilepic"
    );

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json(course.rejectedStudents);
  } catch (error) {
    console.error("Error fetching rejected students:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const pendingStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // لا تضيفه إذا موجود
    if (!course.students.includes(studentId)) {
      course.students.push(studentId);
    }

    // شيله من المقبولين والمرفوضين
    course.acceptedStudents = course.acceptedStudents.filter(
      (id) => id.toString() !== studentId
    );

    course.rejectedStudents = course.rejectedStudents.filter(
      (id) => id.toString() !== studentId
    );

    await course.save();
    res.status(200).json({ message: "Student moved to pending successfully" });
  } catch (error) {
    console.error("Error setting student to pending:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const hideCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { isHidden: true },
      { new: true }
    );
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: "Failed to hide course" });
  }
};

export const unhideCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { isHidden: false },
      { new: true }
    );
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: "Failed to unhide course" });
  }
};
