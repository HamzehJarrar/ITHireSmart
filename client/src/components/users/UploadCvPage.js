import React, { useState } from "react";
import axios from "axios";
import { Button, Typography, Box, CircularProgress } from "@mui/material";

const UploadCvPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return setMessage("Please upload your CV first.");

    const formData = new FormData();
    formData.append("cv", file);

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post("/api/cv/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // لو بتستخدم JWT
        },
      });

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
      <Typography variant="h5">Upload Your CV</Typography>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <Box mt={2}>
        <Button variant="contained" onClick={handleUpload} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Upload & Analyze"}
        </Button>
      </Box>
      {message && <Typography mt={2}>{message}</Typography>}
    </Box>
  );
};

export default UploadCvPage;
