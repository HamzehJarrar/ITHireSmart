import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Divider,
  Alert,
  Snackbar,
} from "@mui/material";
import { addJob } from "../../API/jobsAPI";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const PostJob = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [initialCompany, setInitialCompany] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    if (firstName && lastName) {
      setInitialCompany(`${firstName} ${lastName}`);
    }
  }, []);

  const validationSchema = Yup.object({
    jobTitle: Yup.string().required("Job title is required"),
    company: Yup.string().required("Company is required"),
    location: Yup.string().required("Location is required"),
    from: Yup.date().required("Start date is required"),
    to: Yup.date().required("End date is required"),
    jobDescription: Yup.string().required("Job description is required"),
    jobType: Yup.string().required("Job type is required"),
    experienceLevel: Yup.string().required("Experience level is required"),
    workType: Yup.string().required("Work type is required"),
    salaryPeriod: Yup.string().required("Salary period is required"),
    salary: Yup.number()
      .typeError("Must be a number")
      .required("Salary is required"),
    requirements: Yup.string().required("Requirements are required"),
    responsibilities: Yup.string().required("Responsibilities are required"),
  });

  const handleBack = () => {
    window.history.back();
  };
  const minDate = dayjs().format("YYYY-MM-DD");
  const maxDate = dayjs().add(1, "month").format("YYYY-MM-DD");

  return (
    <Formik
      enableReinitialize
      initialValues={{
        jobTitle: "",
        company: initialCompany,
        location: "",
        from: minDate,
        to: maxDate,
        jobDescription: "",
        salaryPeriod: "monthly",
        jobType: "",
        experienceLevel: "",
        salary: "",
        workType: "",
        requirements: "",
        responsibilities: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        setShowConfirm(true);
        setConfirmCallback(() => async () => {
          const jobData = {
            ...values,
            Requirements: values.requirements
              .split(",")
              .map((item) => item.trim()),
            Responsibilities: values.responsibilities
              .split(",")
              .map((item) => item.trim()),
          };

          try {
            await addJob(jobData);
            setSnackbarMessage("Job posted successfully");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            resetForm();
            setTimeout(() => {
              navigate("/FindJob");
            }, 1500);
          } catch (error) {
            console.error(error);
            setSnackbarMessage("Failed to post job");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
          }
        });
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 800,
            mx: "auto",
            mt: 4,
            border: "1px solid #E2E8F0",
            padding: 4,
            borderRadius: "16px",
            boxShadow: "1px 1px 7px 3px rgba(0,0,0,0.49)",
            mb: 4,
          }}
        >
          <Button
            variant="outlined"
            sx={{ color: "black", border: "1px solid black", mb: 2 }}
            onClick={handleBack}
          >
            Back
          </Button>

          <Typography variant="h4" gutterBottom fontWeight="bold">
            Post a Job
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Fill out the form below to post a new job opening
          </Typography>
          <Divider sx={{ mt: 2, mb: 2 }} />

          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
            <ApartmentIcon sx={{ fontSize: 28 }} />
            <Typography variant="h6" fontWeight="bold">
              Basic Information
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Job Title"
              name="jobTitle"
              value={values.jobTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.jobTitle && Boolean(errors.jobTitle)}
              helperText={touched.jobTitle && errors.jobTitle}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Company"
              name="company"
              value={values.company}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.company && Boolean(errors.company)}
              helperText={touched.company && errors.company}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Location"
              name="location"
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.location && Boolean(errors.location)}
              helperText={touched.location && errors.location}
              fullWidth
              margin="normal"
            />
            <TextField
              fullWidth
              type="date"
              name="from"
              value={values.from}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                min: minDate,
                max: maxDate,
              }}
              error={touched.from && Boolean(errors.from)}
              helperText={touched.from && errors.from}
            />
            <TextField
              fullWidth
              type="date"
              name="to"
              value={values.to}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                min: minDate,
                max: maxDate,
              }}
              error={touched.to && Boolean(errors.to)}
              helperText={touched.to && errors.to}
            />
          </Box>

          <Box
            sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2, gap: 1 }}
          >
            <BusinessCenterIcon sx={{ fontSize: 28 }} />
            <Typography variant="h6" fontWeight="bold">
              Job Details
            </Typography>
          </Box>
          <Divider sx={{ mt: 2, mb: 2 }} />

          <TextField
            label="Job Description"
            name="jobDescription"
            value={values.jobDescription}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.jobDescription && Boolean(errors.jobDescription)}
            helperText={touched.jobDescription && errors.jobDescription}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              select
              label="Job Type"
              name="jobType"
              value={values.jobType}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.jobType && Boolean(errors.jobType)}
              helperText={touched.jobType && errors.jobType}
              fullWidth
              margin="normal"
            >
              <MenuItem value="full-time">Full-time</MenuItem>
              <MenuItem value="part-time">Part-time</MenuItem>
            </TextField>

            <TextField
              select
              label="Experience Level"
              name="experienceLevel"
              value={values.experienceLevel}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.experienceLevel && Boolean(errors.experienceLevel)}
              helperText={touched.experienceLevel && errors.experienceLevel}
              fullWidth
              margin="normal"
            >
              <MenuItem value="entry">Entry Level</MenuItem>
              <MenuItem value="mid">Mid Level</MenuItem>
              <MenuItem value="senior">Senior Level</MenuItem>
            </TextField>

            <TextField
              select
              label="Work Type"
              name="workType"
              value={values.workType}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.workType && Boolean(errors.workType)}
              helperText={touched.workType && errors.workType}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Remote">Remote</MenuItem>
              <MenuItem value="onsite">Onsite</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </TextField>

            <TextField
              select
              label="Salary Period"
              name="salaryPeriod"
              value={values.salaryPeriod}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.salaryPeriod && Boolean(errors.salaryPeriod)}
              helperText={touched.salaryPeriod && errors.salaryPeriod}
              fullWidth
              margin="normal"
            >
              <MenuItem value="hourly">Hourly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </TextField>
          </Box>

          <TextField
            label="Salary"
            name="salary"
            value={values.salary}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.salary && Boolean(errors.salary)}
            helperText={touched.salary && errors.salary}
            fullWidth
            margin="normal"
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
            <ChecklistIcon />
            <Typography variant="h6" fontWeight="bold">
              Requirements & Responsibilities
            </Typography>
          </Box>
          <Divider sx={{ mt: 1, mb: 1 }} />

          <TextField
            label="Requirements (comma separated)"
            name="requirements"
            value={values.requirements}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.requirements && Boolean(errors.requirements)}
            helperText={touched.requirements && errors.requirements}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            label="Responsibilities (comma separated)"
            name="responsibilities"
            value={values.responsibilities}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.responsibilities && Boolean(errors.responsibilities)}
            helperText={touched.responsibilities && errors.responsibilities}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              By posting this job, you agree to our terms and conditions.
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, bgcolor: "black" }}
            startIcon={<ReceiptLongIcon />}
          >
            Post Job
          </Button>
          {showConfirm && (
            <Alert
              severity="info"
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              action={
                <>
                  <Button
                    color="success"
                    size="small"
                    onClick={() => {
                      if (confirmCallback) confirmCallback();
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    color="error"
                    size="small"
                    onClick={() => {
                      setShowConfirm(false);
                      setConfirmCallback(null);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              }
            >
              Are you sure you want to post this job?
            </Alert>
          )}

          <Snackbar
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setOpenSnackbar(false)}
              severity={snackbarSeverity}
              sx={{ width: "100%", mt: 10 }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      )}
    </Formik>
  );
};

export default PostJob;
