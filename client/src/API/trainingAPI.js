import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export const getTrainings = () => API.get("/trainings");

export const getTrainingById = (trainingId) =>
  API.get(`/trainings/${trainingId}`);

export const createTraining = (trainingData) =>
  API.post("/trainings/postTraining", trainingData);

export const updateTraining = (trainingId, updatedData) =>
  API.put(`/trainings/${trainingId}`, updatedData);

export const deleteTraining = (trainingId) =>
  API.delete(`/trainings/${trainingId}`);

export const enrollTraining = (trainingId) =>
  API.post(`/trainings/${trainingId}/enroll`);

export const getCompanyTrainings = (companyId) =>
  API.get(`/trainings/company/${companyId}`);

export const hideTraining = (trainingId) =>
  API.put(`/trainings/${trainingId}/hide`);

export const unhideTraining = (trainingId) =>
  API.put(`/trainings/${trainingId}/unhide`);

export const postTraing = (trainingData) =>
  API.post("/trainings/postTraining", trainingData);



export const getEnrolledTrainings = (trainingId) =>
  API.get(`/trainings/${trainingId}/participants`);

export const getAcceptedParticipants = (trainingId) =>
  API.get(`/trainings/${trainingId}/participants/accepted`);

export const getRejectedParticipants = (trainingId) =>
  API.get(`/trainings/${trainingId}/participants/rejected`);

export const acceptParticipant = (trainingId, participantId) =>
  API.put(`/trainings/${trainingId}/participants/${participantId}/accept`);

export const rejectParticipant = (trainingId, participantId) =>
  API.put(`/trainings/${trainingId}/participants/${participantId}/reject`);

export const setPendingParticipant = (trainingId, participantId) =>
  API.put(`/trainings/${trainingId}/participants/${participantId}/pending`);



