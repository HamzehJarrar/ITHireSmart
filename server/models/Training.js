import mongoose, { Schema } from "mongoose";

const TrainingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainingTitle: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    trainingType: {
      type: String,
      enum: ["Online", "Company", "Hybrid"],
      required: true,
    },
    Duration: {
      type: String,
      required: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    trainingDescription: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    topicsCovered: {
      type: [String] ,
      required: true,
    },
    Requirements: {
      type: [String] ,
      required: true,
    },
    enrolledUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    acceptedParticipants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
    rejectedParticipants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
    pendingParticipants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Training", TrainingSchema);
