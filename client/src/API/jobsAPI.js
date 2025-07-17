import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export const getJobs = () => API.get("/jobs");
export const addJob = (jobData) => API.post("/jobs/postJobs", jobData);
export const getJobById = (id) => API.get(`/jobs/${id}`);
export const getCompanyJob = (id) => API.get(`/jobs/companyJobs/${id}`);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const hideJob = (id) => API.patch(`/jobs/${id}/hide`);
export const unhideJob = (id) => API.patch(`/jobs/${id}/unhide`);
export const applyJob = (Id) => API.post(`/jobs/apply/${Id}`);
export const editJob = (Id, jobData) => API.put(`/jobs/${Id}/edit`, jobData);
export const ViewApplicants = (id) => API.get(`/jobs/${id}/applicants`);
export const searchJobByKeyword = (keyword) => API.get(`/jobs/search?keyword=${keyword}`);
