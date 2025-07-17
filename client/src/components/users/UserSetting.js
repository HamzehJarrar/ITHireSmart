import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../utils/UserContext";
import { getProfile, updateProfile, uploadPhoto } from "../../API/API";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Avatar,
  Chip,
  Container,
  TextField,
  IconButton,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Email,
  LocationOn,
  Work,
  School,
  Code,
  Person,
  Add,
  Delete,
  Save,
  PhotoCamera,
  ExpandMore,
} from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, FieldArray } from "formik";

const UserSettings = () => {
  const { user, setUser } = useUser();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: "",
    idx: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User ID not found.");
        const response = await getProfile(userId);
        const profile = response.data;
        setUser({
          ...profile.user,
          location: profile.location || "",
          experience: profile.experience || [],
          education: profile.education || [],
          skills: profile.skills || [],
          profilepic: profile.user.profilepic || null,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "white",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={60} sx={{ color: "black" }} />
          <Typography variant="h6" color="text.secondary">
            Loading your profile...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "white",
          gap: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, borderRadius: 2, textAlign: "center" }}
        >
          <Person sx={{ fontSize: 80, color: "black", mb: 2 }} />
          <Typography variant="h5" sx={{ color: "black" }}>
            User not found
          </Typography>
        </Paper>
      </Box>
    );
  }

  function handleCameraClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  async function handleFileChange(e, setFieldValue) {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setFieldValue("profilepic", file);
  }

  async function handleSavePhoto(file) {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await uploadPhoto(formData);
      setUser((prev) => ({
        ...prev,
        profilepic: res.data.profilepic,
      }));
      setSnackbar({
        open: true,
        message: "Photo updated successfully!",
        severity: "success",
      });
      window.location.reload();
      setPreview(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to upload photo",
        severity: "error",
      });
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
        bgcolor: "white",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIosNewIcon />}
            onClick={() => navigate(-1)}
            sx={{
              color: "black",
              borderColor: "#e0e0e0",
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 500,
              "&:hover": {
                borderColor: "black",
                bgcolor: "#f5f5f5",
              },
            }}
          >
            Back
          </Button>

          <Typography
            variant="h4"
            sx={{
              color: "black",
              fontWeight: 700,
              textAlign: "center",
              flex: 1,
            }}
          >
            Edit Profile
          </Typography>
        </Box>

        <Formik
          initialValues={user}
          enableReinitialize
          onSubmit={async (values, { setSubmitting }) => {
            setSaving(true);
            try {
              await updateProfile(values);
              setSnackbar({
                open: true,
                message: "Profile updated successfully!",
                severity: "success",
              });
              
            } catch (error) {
              setSnackbar({
                open: true,
                message: "Error saving profile. Please try again.",
                severity: "error",
              });
              console.error(error);
            } finally {
              setSaving(false);
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting, handleSubmit }) => (
            <Form>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  mb: 4,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        src={preview || values.profilepic?.url || ""}
                        sx={{
                          width: 150,
                          height: 150,
                          border: "3px solid #e0e0e0",
                        }}
                      >
                        <Person sx={{ fontSize: 80, color: "black" }} />
                      </Avatar>

                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 2,
                          bgcolor: "black",
                          color: "white",
                          width: 40,
                          height: 40,
                          "&:hover": {
                            bgcolor: "#333",
                          },
                        }}
                        onClick={handleCameraClick}
                      >
                        <PhotoCamera />
                      </IconButton>

                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={(e) => handleFileChange(e, setFieldValue)}
                      />

                      {preview && (
                        <Button
                          variant="contained"
                          onClick={() => handleSavePhoto(values.profilepic)}
                          sx={{
                            mt: 1,
                            bgcolor: "black",
                            color: "white",
                            textTransform: "none",
                            borderRadius: 2,
                            fontWeight: 500,
                            "&:hover": { bgcolor: "#333" },
                          }}
                        >
                          Save Photo
                        </Button>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ flex: 1, width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 3,
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <Field name="firstName">
                          {({ field }) => (
                            <TextField
                              label="First Name"
                              variant="outlined"
                              fullWidth
                              {...field}
                              sx={{ flex: 1 }}
                            />
                          )}
                        </Field>
                        <Field name="lastName">
                          {({ field }) => (
                            <TextField
                              label="Last Name"
                              variant="outlined"
                              fullWidth
                              {...field}
                              sx={{ flex: 1 }}
                            />
                          )}
                        </Field>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 3,
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <Field name="email">
                          {({ field }) => (
                            <TextField
                              label="Email"
                              variant="outlined"
                              fullWidth
                              {...field}
                              InputProps={{
                                startAdornment: (
                                  <Email sx={{ mr: 1, color: "black" }} />
                                ),
                              }}
                              sx={{
                                flex: 1,
                              }}
                              disabled
                            />
                          )}
                        </Field>
                        <Field name="location">
                          {({ field }) => (
                            <TextField
                              label="Location"
                              variant="outlined"
                              fullWidth
                              {...field}
                              InputProps={{
                                startAdornment: (
                                  <LocationOn sx={{ mr: 1, color: "black" }} />
                                ),
                              }}
                              sx={{
                                flex: 1,
                              }}
                            />
                          )}
                        </Field>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  mb: 4,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Code sx={{ mr: 2, color: "black", fontSize: 28 }} />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, color: "black" }}
                  >
                    Skills & Technologies
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <FieldArray name="skills">
                  {({ remove, push }) => (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1.5,
                          mb: 3,
                        }}
                      >
                        {values.skills &&
                          values.skills.map((skill, idx) => (
                            <Chip
                              key={idx}
                              label={skill}
                              onDelete={() => remove(idx)}
                              sx={{
                                bgcolor: "black",
                                color: "white",
                                fontWeight: 500,
                                "&:hover": {
                                  bgcolor: "#333",
                                },
                                "& .MuiChip-deleteIcon": {
                                  color: "rgba(255,255,255,0.8)",
                                  "&:hover": {
                                    color: "white",
                                  },
                                },
                              }}
                            />
                          ))}
                      </Box>

                      <TextField
                        size="small"
                        placeholder="Type skill and press Enter"
                        fullWidth
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.target.value.trim()) {
                            push(e.target.value.trim());
                            e.target.value = "";
                          }
                        }}
                      />
                    </>
                  )}
                </FieldArray>
              </Paper>

              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  mb: 4,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Work sx={{ mr: 2, color: "black", fontSize: 28 }} />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, color: "black" }}
                    >
                      Work Experience
                    </Typography>
                  </Box>
                  <FieldArray name="experience">
                    {({ push }) => (
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => {
                          push({
                            title: "",
                            company: "",
                            from: "",
                            to: "",
                            description: "",
                          });
                        }}
                        sx={{
                          bgcolor: "black",
                          color: "white",
                          textTransform: "none",
                          borderRadius: 2,
                          fontWeight: 500,
                          "&:hover": {
                            bgcolor: "#333",
                          },
                        }}
                      >
                        Add Experience
                      </Button>
                    )}
                  </FieldArray>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <FieldArray name="experience">
                  {({ remove }) => (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {values.experience &&
                        values.experience.map((exp, idx) => (
                          <Accordion
                            key={idx}
                            sx={{
                              border: "1px solid #e0e0e0",
                              borderRadius: 1,
                              overflow: "hidden",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={
                                <ExpandMore sx={{ color: "black" }} />
                              }
                              sx={{
                                bgcolor: "#f5f5f5",
                                "&:hover": { bgcolor: "#f0f0f0" },
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: "100%",
                                  pr: 2,
                                }}
                              >
                                <Typography sx={{ fontWeight: 500 }}>
                                  {exp.title
                                    ? `${exp.title}${
                                        exp.company ? ` at ${exp.company}` : ""
                                      }`
                                    : "New Experience"}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteDialog({
                                      open: true,
                                      type: "experience",
                                      idx,
                                    });
                                  }}
                                  sx={{ color: "red" }}
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 3 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 2,
                                    flexDirection: { xs: "column", sm: "row" },
                                  }}
                                >
                                  <Field name={`experience.${idx}.title`}>
                                    {({ field }) => (
                                      <TextField
                                        label="Job Title"
                                        fullWidth
                                        {...field}
                                        sx={{ flex: 1 }}
                                      />
                                    )}
                                  </Field>
                                  <Field name={`experience.${idx}.company`}>
                                    {({ field }) => (
                                      <TextField
                                        label="Company"
                                        fullWidth
                                        {...field}
                                        sx={{ flex: 1 }}
                                      />
                                    )}
                                  </Field>
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 2,
                                    flexDirection: { xs: "column", sm: "row" },
                                  }}
                                >
                                  <Field name={`experience.${idx}.from`}>
                                    {({ field }) => (
                                      <TextField
                                        label="From Date"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        {...field}
                                        sx={{ flex: 1 }}
                                      />
                                    )}
                                  </Field>
                                  <Field name={`experience.${idx}.to`}>
                                    {({ field }) => (
                                      <TextField
                                        label="To Date (Leave empty for Present)"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        {...field}
                                        sx={{ flex: 1 }}
                                      />
                                    )}
                                  </Field>
                                </Box>

                                <Field name={`experience.${idx}.description`}>
                                  {({ field }) => (
                                    <TextField
                                      label="Description"
                                      multiline
                                      rows={3}
                                      fullWidth
                                      {...field}
                                    />
                                  )}
                                </Field>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                    </Box>
                  )}
                </FieldArray>
              </Paper>

              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  mb: 4,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <School sx={{ mr: 2, color: "black", fontSize: 28 }} />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, color: "black" }}
                    >
                      Education
                    </Typography>
                  </Box>
                  <FieldArray name="education">
                    {({ push }) => (
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() =>
                          push({
                            degree: "",
                            school: "",
                            from: "",
                            to: "",
                            description: "",
                          })
                        }
                        sx={{
                          bgcolor: "black",
                          color: "white",
                          textTransform: "none",
                          borderRadius: 2,
                          fontWeight: 500,
                          "&:hover": {
                            bgcolor: "#333",
                          },
                        }}
                      >
                        Add Education
                      </Button>
                    )}
                  </FieldArray>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <FieldArray name="education">
                  {({ remove }) => (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {values.education &&
                        values.education.map((edu, idx) => (
                          <Accordion
                            key={idx}
                            sx={{
                              border: "1px solid #e0e0e0",
                              borderRadius: 1,
                              overflow: "hidden",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={
                                <ExpandMore sx={{ color: "black" }} />
                              }
                              sx={{
                                bgcolor: "#f5f5f5",
                                "&:hover": { bgcolor: "#f0f0f0" },
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: "100%",
                                  pr: 2,
                                }}
                              >
                                <Typography sx={{ fontWeight: 500 }}>
                                  {edu.degree
                                    ? `${edu.degree}${
                                        edu.school ? ` at ${edu.school}` : ""
                                      }`
                                    : "New Education"}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteDialog({
                                      open: true,
                                      type: "education",
                                      idx,
                                    });
                                  }}
                                  sx={{ color: "red" }}
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            </AccordionSummary>

                            <AccordionDetails sx={{ p: 3 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 2,
                                    flexDirection: { xs: "column", sm: "row" },
                                  }}
                                >
                                  <Field name={`education.${idx}.degree`}>
                                    {({ field }) => (
                                      <TextField
                                        label="Degree"
                                        fullWidth
                                        {...field}
                                        sx={{ flex: 1 }}
                                      />
                                    )}
                                  </Field>
                                  <Field name={`education.${idx}.school`}>
                                    {({ field }) => (
                                      <TextField
                                        label="School"
                                        fullWidth
                                        {...field}
                                        sx={{ flex: 1 }}
                                      />
                                    )}
                                  </Field>
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 2,
                                    flexDirection: { xs: "column", sm: "row" },
                                  }}
                                >
                                  <Field name={`education.${idx}.from`}>
                                    {({ field }) => (
                                      <TextField
                                        label="From Date"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        {...field}
                                        sx={{ flex: 1 }}
                                      />
                                    )}
                                  </Field>
                                  <Field name={`education.${idx}.to`}>
                                    {({ field }) => (
                                      <TextField
                                        label="To Date (Leave empty for Present)"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        {...field}
                                        sx={{ flex: 1 }}
                                      />
                                    )}
                                  </Field>
                                </Box>

                                <Field name={`education.${idx}.description`}>
                                  {({ field }) => (
                                    <TextField
                                      label="Description"
                                      multiline
                                      rows={3}
                                      fullWidth
                                      {...field}
                                    />
                                  )}
                                </Field>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                    </Box>
                  )}
                </FieldArray>
              </Paper>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
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
                  sx={{
                    bgcolor: "black",
                    color: "white",
                    textTransform: "none",
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#333" },
                    "&:disabled": { bgcolor: "#ccc" },
                  }}
                >
                  {saving || isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </Box>

              <Dialog
                open={deleteDialog.open}
                onClose={() =>
                  setDeleteDialog({ open: false, type: "", idx: null })
                }
              >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                  Are you sure you want to delete this {deleteDialog.type}?
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() =>
                      setDeleteDialog({ open: false, type: "", idx: null })
                    }
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <FieldArray name={deleteDialog.type}>
                    {({ remove }) => (
                      <Button
                        onClick={() => {
                          remove(deleteDialog.idx);
                          setDeleteDialog({ open: false, type: "", idx: null });
                        }}
                        color="error"
                      >
                        Delete
                      </Button>
                    )}
                  </FieldArray>
                </DialogActions>
              </Dialog>
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
            </Form>
          )}
        </Formik>
      </Container>
    </Box>
  );
};

export default UserSettings;
