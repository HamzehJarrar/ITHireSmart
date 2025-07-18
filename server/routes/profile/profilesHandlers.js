import Profile from "../../models/Profile.js";
import { validationResult } from "express-validator";
import Job from "../../models/Job.js";
import User from "../../models/User.js";

export async function updateprofile(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  } else {
    const {
      company,
      firstName,
      lastName,
      location,
      status,
      skills,
      bio,
      experience,
      education,
    } = req.body;

    const profileFields = {
      user: req.user.id,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill) => skill.trim()),
      company,
      location,
      status,
      bio,
      experience,
      education,
    };
    try {
      if (firstName || lastName) {
        await User.findByIdAndUpdate(req.user.id, {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
        });
      }

      let profileObject = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      return res.json(profileObject);
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }
}

export async function uploudphoto(newphoto) {
  try {
    const { data } = await request.post("/profile-photo-uploud", newphoto);
  } catch (error) {}
}

export async function getmyprofile(req, res) {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["firstName", "lastName","profilepic","email"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    } else {
      res.json(profile);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function showallprofiles(req, res) {
  try {
    const profiles = await Profile.find().populate("user", [
      "firstName",
      "lastName",
    ]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function getprofilebyid(req, res) {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
      "user"
    );

    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile for the given user" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const deletionPromises = [
      Profile.findOneAndDelete({ user: req.user.id }),
      User.findByIdAndDelete(req.user.id),
    ];
    if (user.role === "company") {
      deletionPromises.push(Job.deleteMany({ user: req.user.id }));
    }
    await Promise.all(deletionPromises);
    res.json({ msg: "User and related data deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

export async function addexper(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      profile = new Profile({
        user: req.user.id,
        experience: [req.body],
        status: "new",
        skills: ["none"],
      });
    } else {
      profile.experience.unshift({
        title: req.body.title,
        company: req.body.company,
        from: req.body.from,
        to: req.body.to,
        description: req.body.description,
      });
    }

    await profile.save();
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function deleteexper(req, res) {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience = profile.experience.filter((exp) => {
      return exp._id.toString() !== req.params.expId;
    });
    await profile.save();
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function addedu(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new Profile({
        user: req.user.id,
        education: [req.body],
        status: "new",
        skills: ["none"],
      });
    } else {
      profile.education.unshift(req.body);
    }
    await profile.save();
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function deleteedu(req, res) {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.education = profile.education.filter((edu) => {
      return edu._id.toString() !== req.params.eduId;
    });
    await profile.save();
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function addSkills(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { skills } = req.body;

    let skillsArray;

    if (Array.isArray(skills)) {
      skillsArray = skills.map((skill) => skill.trim());
    } else {
      skillsArray = skills.split(",").map((skill) => skill.trim());
    }

    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    profile.skills = skillsArray;

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

export async function deleteskillbyname(req, res) {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    profile.skills = profile.skills.filter(
      (skill) => skill.toLowerCase() !== req.params.name.toLowerCase()
    );

    await profile.save();

    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}
