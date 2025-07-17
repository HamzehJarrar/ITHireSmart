import React from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const location = useLocation();
  const email = location.state?.email || "";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Verify Your Email
      </Typography>
      <Typography variant="body1" maxWidth="400px" textAlign="center">
        A verification link has been sent to <b>{email}</b>. Please check your
        email and click on the link to verify your account.
      </Typography>
    </Box>
  );
};

export default VerifyEmail;
