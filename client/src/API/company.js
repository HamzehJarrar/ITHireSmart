import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/companies" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("companyToken");
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

export const loginCompany = (email, password) =>
  API.post("/login", { email, password });

export const getAllCompanies = () => API.get("/");

export const verifyCompany = (companyId, status) =>
  API.put(`/verify/${companyId}`, { status });

export const getCompanyById = (id) => API.get(`/${id}`);



