import { validationResult } from "express-validator";
import Job from "../../models/Job.js";
import openai from "../../utils/openaiClient.js";
import Profile from "../../models/Profile.js";
import Company from "../../models/Company.js";

export async function postjob(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const companyId = req.user.id;
  const companyProfile = await Company.findById(companyId);
  if (!companyProfile) {
    return res.status(404).json({ msg: "Company profile not found." });
  }

  try {
    let job = new Job({
      user: req.user.id,
      jobTitle: req.body.jobTitle,

      company: companyId,
      companyName: companyProfile.companyName,

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
      companyName: req.body.company,
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
      .populate("user", "profilepic firstName lastName")
      .populate("company");
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
      "company",
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
    job.to = req.body.to;
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
      "firstName  email profilepic"
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

    const requirements = job.Requirements?.join(", ") || "None specified";
    const responsibilities =
      job.Responsibilities?.join(", ") || "None specified";
    const experienceLevel = job.experienceLevel || "Not specified";

    const applicantsData = await Promise.all(
      job.applicants.map(async ({ user }) => {
        if (!user || !user._id) return null;

        const profile = await Profile.findOne({ user: user._id });
        if (!profile) return null;

        return {
          name:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            "Unknown",
          skills: Array.isArray(profile.skills) ? profile.skills : [],
          education: Array.isArray(profile.education) ? profile.education : [],
          experience: Array.isArray(profile.experience)
            ? profile.experience.length
            : 0,
          email: user.email || "",
          languages: Array.isArray(profile.languages) ? profile.languages : [],
          trainingCourses: Array.isArray(profile.trainingCourses)
            ? profile.trainingCourses
            : [],
        };
      })
    );

    const filteredApplicants = applicantsData.filter(Boolean);

    const prompt = `You are a seasoned recruitment expert with extensive experience in talent acquisition, CV analysis, and matching applicants to job requirements. I want to leverage your expertise to professionally evaluate the applicants for the following position.

Job Details:
- Title: ${job.jobTitle}
- Company: ${job.companyName}
- Requirements: ${requirements}
- Responsibilities: ${responsibilities}
- Experience Level: ${experienceLevel}
- Job Description: ${job.jobDescription}

Below is a list of applicants:

${JSON.stringify(applicantsData, null, 2)}

Please proceed with the task as follows:

1. Evaluation Methodology:
• Conduct a comprehensive analysis of each applicant based on their skills, education, and work experience.
• Perform a precise comparison between the applicant’s qualifications and the core job requirements.
• Assess how well the applicant’s experience aligns with the listed responsibilities.

2. Scoring Criteria:
• Assign a match_score from 0 to 100, reflecting how well the applicant fits the job.
• Prioritize applicants who meet all essential requirements.
• Take into account the required experience level.

3. Output Format:
• Return a pure JSON array of the top 5 applicants only.
• Sort the list from highest to lowest match_score.
• Exclude any applicant who does not meet the essential qualifications.

4. JSON Structure:
[
  {
    "name": "Applicant Name",
    "match_score": 0-100,
    "Email": "applicant@example.com",
    "justification": "Detailed explanation of why this applicant is a strong match, highlighting key strengths."
  }
]

5. Quality Expectations:
• Ensure precise and accurate evaluation
• Maintain objectivity and fairness
• Provide clear justification for each recommendation
• Strictly return no more than 5 applicants

Rely on your deep understanding of competency analysis and qualification assessment to provide accurate recommendations that reflect a full understanding of the job’s needs. Focus on quality over quantity.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 1000,
    });

    const responseText = completion.choices?.[0]?.message?.content?.trim();
    if (!responseText) {
      throw new Error("No response text from OpenAI");
    }

    const jsonMatch = responseText.match(/\[.*\]/s);
    if (!jsonMatch) {
      return res
        .status(500)
        .json({ message: "Could not extract JSON array from AI response." });
    }

    let aiResponse;
    try {
      aiResponse = JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("JSON parse error:", error);
      return res.status(500).json({ message: "Failed to parse AI response" });
    }

    console.log("Recommended response:", aiResponse);
    return res.json(aiResponse);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
