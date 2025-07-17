import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export const getCourses = () => API.get("/course");

export const getCourseById = (id) => API.get(`/course/${id}`);

export const getCompanyCourses = (id) =>
  API.get(`/course/companyCourses/${id}`);

export const addCourse = (courseData) =>
  API.post("/course/postCourse", courseData);

export const enrollCourse = (courseId) =>
  API.post(`/course/${courseId}/enroll`);

export const updateCourse = (courseId, courseData) =>
  API.put(`/course/${courseId}`, courseData);

export const getEnrolledCourses = (courseId) =>
  API.get(`/course/getEnrolledCourses/${courseId}`);

export const acceptStudent = (courseId, studentId) =>
  API.post(`/course/${courseId}/accept`, { studentId });

export const getAcceptedStudents = (courseId) =>
  API.get(`/course/${courseId}/acceptedStudents`);

export const rejectStudent = (courseId, studentId) =>
  API.post(`/course/${courseId}/reject`, { studentId });

export const getRejectedStudents = (courseId) =>
  API.get(`/course/${courseId}/rejected`);

export const setPendingStudent = (courseId, studentId) =>
  API.post(`/course/${courseId}/pending`, { studentId });

export const hideCourse = (courseId) => API.patch(`/course/${courseId}/hide`);

export const unhideCourse = (courseId) =>
  API.patch(`/course/${courseId}/unhide`);

export const deleteCourse = (courseId) => API.delete(`/course/${courseId}`);
