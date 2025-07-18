import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/companies" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export const registerCompany = async (companyData) => {
  const res = await API.post("/register", companyData);
  if (res.data.token) {
    localStorage.setItem("companyToken", res.data.token);
  }
  return res;
};

export const loginCompany = (companyEmail, password) =>
  API.post("/login", { companyEmail, password });

export const getAllCompanies = () => API.get("/");

export const verifyCompany = (companyId, status) =>
  API.put(`/verify/${companyId}`, { status });

export const getCompanyById = (id) => API.get(`/${id}`);

export const getCompanyProfile = (companyId) =>
  API.get(`/profile/${companyId}`);

export const updateCompanyProfile = (companyId, data) =>
  API.put(`/${companyId}`, data);