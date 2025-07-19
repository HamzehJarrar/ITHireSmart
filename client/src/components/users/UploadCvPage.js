import React, { useState } from "react";
import axios from "axios";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import { uploadCv } from "../../API/API.js";

const UploadCvPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };
  const userId = localStorage.getItem("userId");
  const handleUpload = async () => {
    if (!file) return setMessage("Please upload your CV first.");

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("userId", userId);
    try {
      setLoading(true);
      setMessage("");

        const res = await uploadCv(formData);


      setMessage("CV processed and profile updated successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to process CV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h5" mb={2}>
        Upload Your CV (Image)
      </Typography>
      <input
        type="file"
        accept=".pdf, image/jpeg, image/png, image/jpg"
        onChange={handleFileChange}
      />
      {file && (
        <Typography variant="body2" mt={1}>
          Selected file: {file.name}
        </Typography>
      )}
      <Box mt={2}>
        <Button variant="contained" onClick={handleUpload} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Upload & Analyze"}
        </Button>
      </Box>
      {message && (
        <Typography
          mt={2}
          color={message.includes("Failed") ? "error" : "primary"}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default UploadCvPage;
