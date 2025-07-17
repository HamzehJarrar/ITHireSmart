import React, { useState } from "react";
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../API/API";
import LockResetIcon from "@mui/icons-material/LockReset";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const handleChange = async () => {
    setMsg("");
    setError("");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");

    setLoading(true);
    try {
      const res = await changePassword({ oldPassword, newPassword });
      setMsg(res.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.msg || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
          bgcolor: "white",
        }}
      >

        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIosNewIcon />}
            onClick={() => navigate(-1)}
            sx={{
              color: "#000000",
              borderColor: "#e0e0e0",
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 500,
              "&:hover": {
                borderColor: "#000000",
                bgcolor: "#f5f5f5",
              },
            }}
          >
            Back
          </Button>
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <LockResetIcon sx={{ mr: 1, color: "#333" }} />
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 600, color: "#333" }}
          >
            Change Password
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {msg && (
          <Alert
            severity="success"
            sx={{ mb: 2, "& .MuiAlert-message": { color: "#2e7d32" } }}
          >
            {msg}
          </Alert>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, "& .MuiAlert-message": { color: "#d32f2f" } }}
          >
            {error}
          </Alert>
        )}

        <Stack spacing={2.5}>
          <TextField
            label="Current Password"
            type={showOld ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            InputProps={{
              sx: { borderRadius: 1.5 },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowOld(!showOld)} edge="end">
                    {showOld ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="New Password"
            type={showNew ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              sx: { borderRadius: 1.5 },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNew(!showNew)} edge="end">
                    {showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              sx: { borderRadius: 1.5 },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirm(!showConfirm)}
                    edge="end"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleChange}
            disabled={loading}
            sx={{
              mt: 1,
              py: 1.5,
              bgcolor: "#333",
              color: "white",
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#555",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Change Password"
            )}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ChangePassword;
