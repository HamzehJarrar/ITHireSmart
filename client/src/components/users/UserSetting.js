// src/components/users/UserSettings.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/UserContext";
import { getProfile, updateProfile, uploadPhoto } from "../../API/API";

import {
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Avatar,
  IconButton,
  Button,
  TextField,
  Chip,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Person,
  PhotoCamera,
  Email,
  LocationOn,
  Code,
  Work,
  School,
  Translate,
  WorkspacePremium,
  Save,
  Delete,
  ArrowBackIosNew as BackIcon,
} from "@mui/icons-material";

import { Formik, Form, FieldArray } from "formik";

const InputList = ({ title, icon, name, values, push, remove }) => (
  <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
      {icon}
      <Typography variant="h5" sx={{ fontWeight: 600, ml: 2 }}>
        {title}
      </Typography>
    </Box>
    <Divider sx={{ mb: 3 }} />

    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
      {values[name]?.map((item, idx) => (
        <Chip
          key={idx}
          label={item}
          onDelete={() => remove(idx)}
          sx={{
            bgcolor: "black",
            color: "white",
            "& .MuiChip-deleteIcon": { color: "#fff" },
          }}
        />
      ))}
    </Box>

    <TextField
      size="small"
      placeholder={`Type ${title.toLowerCase()} and press Enter`}
      fullWidth
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target.value.trim()) {
          push(e.target.value.trim());
          e.target.value = "";
        }
      }}
    />
  </Paper>
);

const UserSettings = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  /* ─────────────── Fetch profile ─────────────── */
  useEffect(() => {
    (async () => {
      try {
        const userId = localStorage.getItem("userId");
        const { data } = await getProfile(userId);

        setUser({
          ...data.user,
          location: data.location || "",
          experience: data.experience || [],
          education: data.education || [],
          skills: data.skills || [],
          trainingCourses: data.trainingCourses || [],
          languages: data.languages || [],
          profilepic: data.user.profilepic || null,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ─────────────── Handlers ─────────────── */
  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setFieldValue("profilepic", file);
  };

  const handleSavePhoto = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadPhoto(formData);
      setUser((prev) => ({ ...prev, profilepic: res.data.profilepic }));
      setPreview(null);
      setSnackbar({ open: true, message: "Photo updated!", severity: "success" });
      window.location.reload();
    } catch {
      setSnackbar({ open: true, message: "Upload failed", severity: "error" });
    }
  };

  /* ─────────────── UI ─────────────── */
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }
  if (!user) return null;

  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

<Formik
  initialValues={user}
  enableReinitialize
  onSubmit={async (values) => {
    setSaving(true);
    try {
      await updateProfile(values); // No need to stringify
      setSnackbar({ open: true, message: "Profile saved", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Save failed", severity: "error" });
    } finally {
      setSaving(false);
    }
  }}
>

          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              {/* ─────────── Header (avatar + basic info) ─────────── */}
              <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  {/* Avatar */}
                  <Box position="relative">
                    <Avatar
                      src={preview || values.profilepic?.url || ""}
                      sx={{ width: 150, height: 150, border: "3px solid #e0e0e0" }}
                    >
                      <Person sx={{ fontSize: 80 }} />
                    </Avatar>
                    <IconButton
                      onClick={() => fileInputRef.current.click()}
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bgcolor: "black",
                        color: "#fff",
                        "&:hover": { bgcolor: "#333" },
                      }}
                    >
                      <PhotoCamera />
                    </IconButton>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                    />
                    {preview && (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => handleSavePhoto(values.profilepic)}
                      >
                        Save Photo
                      </Button>
                    )}
                  </Box>

                  {/* Basic fields */}
                  <Box flex={1} width="100%" display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
                      <TextField
                        label="First Name"
                        value={values.firstName}
                        onChange={(e) => setFieldValue("firstName", e.target.value)}
                        fullWidth
                      />
                      <TextField
                        label="Last Name"
                        value={values.lastName}
                        onChange={(e) => setFieldValue("lastName", e.target.value)}
                        fullWidth
                      />
                    </Box>
                    <Box display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
                      <TextField
                        label="Email"
                        value={values.email}
                        disabled
                        fullWidth
                        InputProps={{ startAdornment: <Email sx={{ mr: 1 }} /> }}
                      />
                      <TextField
                        label="Location"
                        value={values.location}
                        onChange={(e) => setFieldValue("location", e.target.value)}
                        fullWidth
                        InputProps={{ startAdornment: <LocationOn sx={{ mr: 1 }} /> }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {/* ─────────── Skills ─────────── */}
              <FieldArray name="skills">
                {({ push, remove }) => (
                  <InputList
                    title="Skills & Technologies"
                    icon={<Code sx={{ color: "black" }} />}
                    name="skills"
                    values={values}
                    push={push}
                    remove={remove}
                  />
                )}
              </FieldArray>

              {/* ─────────── Experience (Strings) ─────────── */}
              <FieldArray name="experience">
                {({ push, remove }) => (
                  <InputList
                    title="Work Experience"
                    icon={<Work sx={{ color: "black" }} />}
                    name="experience"
                    values={values}
                    push={push}
                    remove={remove}
                  />
                )}
              </FieldArray>

              {/* ─────────── Education (Strings) ─────────── */}
              <FieldArray name="education">
                {({ push, remove }) => (
                  <InputList
                    title="Education"
                    icon={<School sx={{ color: "black" }} />}
                    name="education"
                    values={values}
                    push={push}
                    remove={remove}
                  />
                )}
              </FieldArray>

              {/* ─────────── Training Courses ─────────── */}
              <FieldArray name="trainingCourses">
                {({ push, remove }) => (
                  <InputList
                    title="Training & Certifications"
                    icon={<WorkspacePremium sx={{ color: "black" }} />}
                    name="trainingCourses"
                    values={values}
                    push={push}
                    remove={remove}
                  />
                )}
              </FieldArray>

              {/* ─────────── Languages ─────────── */}
              <FieldArray name="languages">
                {({ push, remove }) => (
                  <InputList
                    title="Languages"
                    icon={<Translate sx={{ color: "black" }} />}
                    name="languages"
                    values={values}
                    push={push}
                    remove={remove}
                  />
                )}
              </FieldArray>

              {/* ─────────── Save Button ─────────── */}
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    saving || isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Save />
                    )
                  }
                  disabled={saving || isSubmitting}
                  sx={{ bgcolor: "black" }}
                >
                  {saving || isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default UserSettings;
