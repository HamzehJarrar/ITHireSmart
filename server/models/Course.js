import mongoose, { Schema } from "mongoose";

const CourseSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseTitle: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
    },
    location: {
      type: String,
      default: "Online",
    },
    courseType: {
      type: String,
      enum: ["Online", "Company"],
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      default: "1 month",
    },
    requirements: {
      type: [String],
      required: true,
    },
    capacity: {
      type: Number,
    },
    studentsEnrolled: {
      type: Number,
      default: 0,
    },
    topics: {
      type: [String],
      required: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    students: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    acceptedStudents: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    rejectedStudents: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
