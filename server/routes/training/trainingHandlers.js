import Training from "../../models/Training.js";
import { validationResult } from "express-validator";

export async function postTraing(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const training = new Training({
      user: req.user.id,
      trainingTitle: req.body.trainingTitle,
      companyName: req.body.companyName,
      location: req.body.location,
      startAt: req.body.startAt,
      endAt: req.body.endAt,
      trainingType: req.body.trainingType,
      Duration: req.body.Duration,
      trainingDescription: req.body.trainingDescription,
      capacity: req.body.capacity,
      topicsCovered: req.body.topicsCovered,
      Requirements: req.body.Requirements,
    });

    await training.save();
    res.json(training);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function getalltrain(req, res) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    await Training.updateMany(
      { endAt: { $lt: today }, isHidden: false },
      { $set: { isHidden: true } }
    );

    const trainings = await Training.find({ isHidden: false })
      .sort({ createdAt: -1 })
      .populate("user", "profilepic firstName lastName");

    res.json(trainings);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function gettrainbyid(req, res) {
  try {
    const training = await Training.findById(req.params.trainingId).populate(
      "user",
      "profilepic firstName lastName"
    );
    if (!training) {
      return res.status(404).json({ msg: "Training not found" });
    }
    res.json(training);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function deletetrain(req, res) {
  try {
    const training = await Training.findById(req.params.trainingId);
    if (!training) {
      return res.status(404).json({ msg: "Training not found" });
    }
    await training.deleteOne();
    res.json({ msg: "Training removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function updatetrain(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const training = await Training.findById(req.params.trainingId);
    if (!training) {
      return res.status(404).json({ msg: "Training not found" });
    }

    training.trainingTitle = req.body.trainingTitle;
    training.companyName = req.body.companyName;
    training.location = req.body.location;
    training.startAt = req.body.startAt;
    training.endAt = req.body.endAt;
    training.trainingType = req.body.trainingType;
    training.Duration = req.body.Duration;
    training.trainingDescription = req.body.trainingDescription;
    training.capacity = req.body.capacity;
    training.topicsCovered = Array.isArray(req.body.topicsCovered)
      ? req.body.topicsCovered
      : [];
    training.Requirements = Array.isArray(req.body.Requirements)
      ? req.body.Requirements
      : [];

    await training.save();

    res.json(training);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

export async function enrollInTraining(req, res) {
  try {
    const training = await Training.findById(req.params.trainingId);
    if (!training) return res.status(404).json({ msg: "Training not found" });

    if (training.enrolledUsers.includes(req.user.id)) {
      return res.status(400).json({ msg: "You are already enrolled" });
    }

    training.enrolledUsers.push(req.user.id);
    await training.save();

    res.json({ msg: "Enrolled successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

export async function getCompanyTrainings(req, res) {
  try {
    const trainings = await Training.find({ user: req.params.companyId });
    res.json(trainings);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

export async function hideTraining(req, res) {
  try {
    const training = await Training.findById(req.params.trainingId);
    if (!training) return res.status(404).json({ msg: "Training not found" });

    training.isHidden = true;
    await training.save();

    res.json({ msg: "Training hidden successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

export async function unhideTraining(req, res) {
  try {
    const training = await Training.findById(req.params.trainingId);
    if (!training) return res.status(404).json({ msg: "Training not found" });

    training.isHidden = false;
    await training.save();

    res.json({ msg: "Training unhidden successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

export async function getEnrolledTrainings(req, res) {
  try {
    const training = await Training.findById(req.params.trainingId)
      .populate({
        path: "enrolledUsers",
        select: "firstName lastName email profilepic",
      })
      .populate({
        path: "user",
        select: "profilepic firstName lastName",
      });

    if (!training) {
      return res.status(404).json({ msg: "Training not found" });
    }

    res.json(training.enrolledUsers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

export async function getAcceptedParticipants(req, res) {
  try {
    const training = await Training.findById(req.params.trainingId)
      .populate({
        path: "acceptedParticipants",
        select: "firstName lastName email profilepic",
      })
      .populate({
        path: "user",
        select: "profilepic firstName lastName",
      });
    if (!training) return res.status(404).json({ msg: "Training not found" });

    res.json(training.acceptedParticipants);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

export async function getRejectedParticipants(req, res) {
  try {
    const training = await Training.findById(req.params.trainingId)
      .populate({
        path: "rejectedParticipants",
        select: "firstName lastName email profilepic",
      })
      .populate({
        path: "user",
        select: "profilepic firstName lastName",
      });
    if (!training) return res.status(404).json({ msg: "Training not found" });

    res.json(training.rejectedParticipants);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

export async function acceptParticipant(req, res) {
  try {
    const training = await Training.findById(req.params.trainingId);
    if (!training) return res.status(404).json({ msg: "Training not found" });

    const participantId = req.params.participantId;

    training.rejectedParticipants = training.rejectedParticipants.filter(
      (id) => id.toString() !== participantId
    );
    training.pendingParticipants = training.pendingParticipants.filter(
      (id) => id.toString() !== participantId
    );

    if (!training.acceptedParticipants.some(id => id.toString() === participantId)) {
      training.acceptedParticipants.push(participantId);
    }

    await training.save();
    res.json({ msg: "Participant accepted" });
  } catch (error) {
    console.error("Error accepting participant:", error);
    res.status(500).send("Server Error");
  }
}

export async function rejectParticipant(req, res) {
  try {
    const training = await Training.findById(req.params.trainingId);
    if (!training) return res.status(404).json({ msg: "Training not found" });

    const participantId = req.params.participantId;

    training.acceptedParticipants = training.acceptedParticipants.filter(
      (id) => id.toString() !== participantId
    );
    training.pendingParticipants = training.pendingParticipants.filter(
      (id) => id.toString() !== participantId
    );

    if (!training.rejectedParticipants.includes(participantId)) {
      training.rejectedParticipants.push(participantId);
    }

    await training.save();
    res.json({ msg: "Participant rejected" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

export async function setPendingParticipant(req, res) {
  try {
    const training = await Training.findById(req.params.trainingId);
    if (!training) return res.status(404).json({ msg: "Training not found" });

    const participantId = req.params.participantId;

    training.acceptedParticipants = training.acceptedParticipants.filter(
      (id) => id.toString() !== participantId
    );
    training.rejectedParticipants = training.rejectedParticipants.filter(
      (id) => id.toString() !== participantId
    );

    if (!training.pendingParticipants.includes(participantId)) {
      training.pendingParticipants.push(participantId);
    }

    await training.save();
    res.json({ msg: "Participant set to pending" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}
