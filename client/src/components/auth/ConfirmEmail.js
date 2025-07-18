import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Container,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../../API/API";

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    console.log("Token:", token);
    console.log(
      "Verify URL:",
      `http://localhost:5000/api/users/verify-email?token=${token}`
    );

    verifyEmail(token)

      .then((data) => {
        console.log("API Response:", data); 
        if (data.userId) {
          localStorage.setItem("userId", data.userId);
        }
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [token]);
  
  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              py: 6,
              px: 4,
            }}
          >
            <EmailIcon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
            <CircularProgress size={48} thickness={4} />
            <Typography variant="h5" component="h1" fontWeight={600}>
              Verifying Your Email
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              Please wait while we confirm your email address...
            </Typography>
          </Box>
        );

      case "error":
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              py: 6,
              px: 4,
            }}
          >
            <ErrorIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
            <Typography
              variant="h5"
              component="h1"
              fontWeight={600}
              color="error.main"
            >
              Verification Failed
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              The verification link is invalid or has expired. Please try
              registering again.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/register")}
                sx={{ minWidth: 140 }}
              >
                Register Again
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{ minWidth: 140 }}
              >
                Go Home
              </Button>
            </Box>
          </Box>
        );

      case "success":
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              py: 6,
              px: 4,
            }}
          >
            <CheckCircleIcon
              sx={{ fontSize: 64, color: "success.main", mb: 2 }}
            />
            <Typography
              variant="h5"
              component="h1"
              fontWeight={600}
              color="success.main"
            >
              Email Verified Successfully!
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              Your email has been confirmed. You can now log in to your account.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{ minWidth: 140, bgcolor: "black" }}
              >
                Go to Login
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/UploadCvPage")}
                sx={{ minWidth: 140 }}
              >
                Cv upload
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {renderContent()}
        </Paper>
      </Box>
    </Container>
  );
};

export default ConfirmEmail;
