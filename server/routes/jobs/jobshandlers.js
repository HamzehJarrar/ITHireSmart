import { validationResult } from "express-validator";
import Job from "../../models/Job.js"


export async function postjob (req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let job = new Job({
        user: req.user.id,
        jobTitle: req.body.jobTitle,
        companyName: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        jobDescription: req.body.jobDescription,
        salaryPeriod: req.body.salaryPeriod,
        jobType: req.body.jobType,
        Requirements: req.body.Requirements,
        Responsibilities: req.body.Responsibilities,
        experienceLevel: req.body.experienceLevel,
        salary: req.body.salary,
        workType: req.body.workType,
      });
      await job.save();
      return res.json(job);
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
}


 export async function showalljobs(req, res){
  try {
    let jobsPosts = await Job.find().sort({ date: -1 });
    res.json(jobsPosts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}


 export async function searchjobbykeyword (req, res){
  const keyword = req.query.keyword || "";
  try {
    const regex = new RegExp(keyword, "i"); // case-insensitive and flexible
    const jobs = await Job.find({
      $or: [{ jobTitle: regex }, { companyName: regex }, { location: regex }],
    }).sort({ date: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}


 export async function searchjobbyid (req, res){
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}



 export async function deletejobbyid (req, res){
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


 export async function editjobbyid  (req, res){
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
    job.to = req.body.to;
    job.current = req.body.current;
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


 export async function jobapply (req, res){
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }
    if (job.applicants.some((applicant) => applicant.equals(req.user.id))) {
      return res
        .status(400)
        .json({ msg: "You have already applied to this job" });
    }

    job.applicants.push({
      userId: req.user.id,
      name: req.user.name,
      email: req.user.email,
      applicationDate: new Date(),
    });
    await job.save();
    res.json({ msg: "Application submitted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}



 export async function showallmyjobs (req, res){
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