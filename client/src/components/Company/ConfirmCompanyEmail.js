import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Typography,
  Container,
  Box,
  Button,
  Paper,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmCompanyEmail = () => {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("error");
        setMessage("No token provided.");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/companies/verify-email?token=${token}`
        );
        localStorage.setItem("companyToken", res.data.token);
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully!");
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.error || "Verification failed or token expired."
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  const renderIcon = () => {
    if (status === "loading")
      return <EmailIcon color="primary" sx={{ fontSize: 60 }} />;
    if (status === "success")
      return <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />;
    return <ErrorIcon color="error" sx={{ fontSize: 60 }} />;
  };

  const getColor = () => {
    if (status === "success") return "success.main";
    if (status === "error") return "error.main";
    return "text.primary";
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 10,
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box mb={3}>{renderIcon()}</Box>

        <Typography
          variant="h5"
          fontWeight={600}
          color={getColor()}
          gutterBottom
        >
          {status === "loading" ? "Verifying Your Email..." : message}
        </Typography>

        {status === "loading" && (
          <Box mt={2}>
            <CircularProgress />
          </Box>
        )}

        {status !== "loading" && (
          <Button
          variant="contained"
          sx={{ mt: 3, px: 4, py: 1.2 , color:"white", backgroundColor: '#000000ff' }}
            onClick={() => navigate("/")}
          >
            Go to Home
          </Button>
        )}
      </Paper>
    </Container>
  );
};

export default ConfirmCompanyEmail;
