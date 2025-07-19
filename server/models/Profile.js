import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true,
    unique:true,
  },
  company: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
  },
  experience: [String],
  education:[String],
    languages: [String],
    trainingCourses: [String],

  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Profile", ProfileSchema);
