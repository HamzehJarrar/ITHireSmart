import { validationResult } from "express-validator";
import Job from "../../models/Job.js";
import openai from "../../utils/openaiClient.js";

export async function postjob(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let job = new Job({
      user: req.user.id,
      jobTitle: req.body.jobTitle,
      companyName: req.body.companyName,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      jobDescription: req.body.jobDescription,
      salaryPeriod: req.body.salaryPeriod,
      jobType: req.body.jobType,
      Requirements: req.body.Requirements,
      Responsibilities: req.body.Responsibilities,
      experienceLevel: req.body.experienceLevel,
      salary: req.body.salary,
      workType: req.body.workType,
      isHidden: false,
    });
    await job.save();
    return res.json(job);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function showalljobs(req, res) {
  try {
    const now = new Date();
    const updateResult = await Job.updateMany(
      { to: { $lte: now }, isHidden: false },
      { $set: { isHidden: true } }
    );

    const visibleJobs = await Job.find({ isHidden: false })
      .sort({ date: -1 })
      .populate("user", "profilepic firstName lastName");

    res.json(visibleJobs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function searchjobbykeyword(req, res) {
  const keyword = req.query.keyword || "";
  try {
    const regex = new RegExp(keyword, "i");
    const jobs = await Job.find({
      $or: [{ jobTitle: regex }, { companyName: regex }, { location: regex }],
    })
      .sort({ date: -1 })
      .populate("user", "profilepic firstName lastName");
    res.json(jobs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

export async function searchjobbyid(req, res) {
  try {
    const job = await Job.findById(req.params.jobId).populate(
      "user",
      "profilepic firstName lastName"
    );
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function deletejobbyid(req, res) {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }
    await job.deleteOne();
    res.json({ msg: "Job removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function editjobbyid(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    job.jobTitle = req.body.jobTitle;
    job.companyName = req.body.companyName;
    job.location = req.body.location;
    job.from = req.body.from;
    job.jobDescription = req.body.jobDescription;
    job.salaryPeriod = req.body.salaryPeriod;
    job.jobType = req.body.jobType;
    job.Requirements = req.body.Requirements;
    job.Responsibilities = req.body.Responsibilities;
    job.experienceLevel = req.body.experienceLevel;
    job.salary = req.body.salary;
    job.workType = req.body.workType;
    await job.save();
    res.json(job);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function jobapply(req, res) {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }
    if (
      job.applicants.some(
        (applicant) => applicant.user.toString() === req.user.id
      )
    ) {
      return res
        .status(400)
        .json({ msg: "You have already applied to this job" });
    }

    job.applicants.push({
      user: req.user.id,
      appliedAt: new Date(),
    });

    await job.save();
    res.json({ msg: "Application submitted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function showallmyjobs(req, res) {
  try {
    const jobs = await Job.find({ user: req.params.userId }).sort({
      date: -1,
    });
    res.json(jobs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function hidejob(req, res) {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isHidden: true },
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export async function unhidejob(req, res) {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isHidden: false },
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function viewApplicants(req, res) {
  try {
    const job = await Job.findById(req.params.jobId).populate(
      "applicants.user",
      "firstName lastName email profilepic"
    );

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    res.json(job.applicants);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export async function getRecommendedApplicants(req, res) {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId).populate("applicants.user");
    if (!job || !job.applicants || job.applicants.length === 0) {
      return res.status(404).json({ message: "No applicants found" });
    }

    const applicantsData = job.applicants.map(({ user }) => {
      if (!user) {
        return { name: "Unknown", skills: [], experience: 0, email: "" };
      }

      let totalExperienceYears = 0;
      if (Array.isArray(user.experience)) {
        user.experience.forEach((exp) => {
          const fromDate = new Date(exp.from);
          const toDate = exp.current
            ? new Date()
            : exp.to
            ? new Date(exp.to)
            : new Date();

          if (!isNaN(fromDate) && !isNaN(toDate) && toDate > fromDate) {
            totalExperienceYears +=
              (toDate - fromDate) / (1000 * 60 * 60 * 24 * 365.25);
          }
        });
      }
      totalExperienceYears = Math.floor(totalExperienceYears);

      return {
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown",
        skills: Array.isArray(user.skills) ? user.skills : [],
        experience: totalExperienceYears,
        email: user.email || "",
      };
    });

    const prompt = `You are an intelligent recruitment assistant. Your task is to recommend the top 5 applicants for a job opening based on their skills, education, and experience.

The job requirements are:
Skills: [List job required skills here]
Education: [Required degrees or fields]
Experience: [Required years and domains of experience]

Below is a list of applicants. Each applicant has the following structure:

{
  "name": "Applicant Name",
  "skills": [...],
  "education": [...],
  "experience": [...]
}

Please evaluate each applicant carefully and rank them based on how well they match the job requirements. Justify briefly why each of the top 5 was selected.

Return your answer in this JSON format:

{
  "top_applicants": [
    {
      "name": "Applicant Name",
      "match_score": 0-100,
      "justification": "Why this applicant is a good fit"
    },
    ...
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 200,
    });

    console.log("Full OpenAI response:", completion);

    const responseText = completion.choices?.[0]?.message?.content?.trim();

    console.log("OpenAI response text:", responseText);
    if (!responseText) {
      throw new Error("No response text from OpenAI");
    }

    function extractJsonFromText(text) {
      const jsonMatch = text.match(/```json\s*([\s\S]*?)```/i);
      if (jsonMatch && jsonMatch[1]) return jsonMatch[1].trim();

      const arrayMatch = text.match(/\[.*\]/s);
      if (arrayMatch) return arrayMatch[0];

      return text;
    }

    let recommendedIndexes;
    try {
      const jsonPart = extractJsonFromText(responseText);
      recommendedIndexes = JSON.parse(jsonPart);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response JSON:", parseError);
      console.error("Raw response text:", responseText);
      return res
        .status(500)
        .json({ message: "Failed to parse OpenAI response." });
    }

    recommendedIndexes = recommendedIndexes.filter(
      (idx) => Number.isInteger(idx) && idx > 0 && idx <= job.applicants.length
    );

    const recommendedApplicants = recommendedIndexes
      .map((idx) => job.applicants[idx - 1])
      .filter(Boolean);

    return res.json(recommendedApplicants);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    if (error.response) {
      console.error("OpenAI response error data:", error.response.data);
    }
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
