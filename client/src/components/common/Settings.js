"use client";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
const Settings = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        height: "88vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        bgcolor: "#f8fafc",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 6,
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          color="#1e293b"
          sx={{
            letterSpacing: "-0.5px",
            mb: 2,
            fontSize: { xs: "1.75rem", sm: "2.5rem" },
          }}
        >
          Settings
        </Typography>
        <Typography
          variant="body1"
          color="#64748b"
          sx={{
            maxWidth: 500,
            mx: "auto",
            px: 2,
          }}
        >
          Choose a category to customize your preferences
        </Typography>
      </Box>

      {/* Settings cards container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 4,
          zIndex: 1,
        }}
      >
        {/* Profile Card */}
        <Box
          onClick={() => navigate("/UserSetting")}
          sx={{
            bgcolor: "white",
            p: 4,
            borderRadius: 3,
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
            width: { xs: 280, sm: 240 },
            height: 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
              "& .icon-container": {
                transform: "scale(1.1)",
              },
            },
            userSelect: "none",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          {/* Icon */}

          <PersonIcon
            sx={{
              fontSize: "5rem",
              color: "black",
              borderRadius: "50%",
              bgcolor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
            }}
          />

          <Typography variant="h5" fontWeight={600} color="#1e293b" mb={1}>
            Profile
          </Typography>

          <Typography variant="body2" color="#64748b" textAlign="center">
            Manage your personal information
          </Typography>

          {/* Decorative corner */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 40,
              height: 40,
              background:
                "linear-gradient(135deg, #e0e0e0 50%, transparent 50%)",
            }}
          />
        </Box>

        {/* Security Card */}
        <Box
          onClick={() => navigate("/security")}
          sx={{
            bgcolor: "white",
            p: 4,
            borderRadius: 3,
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
            width: { xs: 280, sm: 240 },
            height: 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
              "& .icon-container": {
                transform: "scale(1.1)",
              },
            },
            userSelect: "none",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          {/* Icon */}
          <LockOutlineIcon
            sx={{
              fontSize: "5rem",
              color: "black",
              borderRadius: "50%",
              bgcolor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
            }}
          />

          <Typography variant="h5" fontWeight={600} color="#1e293b" mb={1}>
            Security
          </Typography>

          <Typography variant="body2" color="#64748b" textAlign="center">
            Manage your password and security settings
          </Typography>

          {/* Decorative corner */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 40,
              height: 40,
              background:
                "linear-gradient(135deg, #e0e0e0 50%, transparent 50%)",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
