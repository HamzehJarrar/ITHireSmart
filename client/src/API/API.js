import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export const registerUser = (values) => API.post("/users/register", values);
export const loginUser = (values) => API.post("/users/login", values);

export const changePassword = (values) =>
  API.post("/users/changepassword", values);

export const getPhoto = () => API.get("/users/getphoto");
export const uploadPhoto = (values) => API.post("/users/uploadphoto", values);

export const getMyProfile = () => API.get("/profiles/me");
export const getProfile = (id) => API.get(`/profiles/user/${id}`);
export const updateProfile = (values) =>
  API.post("/profiles/updateprofile", values);

export const GetRecommendedApplicants = (jobId) => {
  return API.get(`/jobs/${jobId}/recommendations`);
};

export const uploadCv = (formData) => {
  const token = localStorage.getItem("token");
  return API.post("/users/uploadCv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const verifyEmail = (token) =>
  API.get(`/users/verify-email?token=${token}`).then((res) => res.data);

