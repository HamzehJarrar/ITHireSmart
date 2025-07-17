import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, editJob } from "../../API/jobsAPI";
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Divider,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function EditJob() {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const [formValues, setFormValues] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = () => {
    setOpen(false);
  };
  const validationSchema = Yup.object({
    jobTitle: Yup.string().required("Job title is required"),
    location: Yup.string().required("Location is required"),
    salary: Yup.number().required("Salary is required"),
    salaryPeriod: Yup.string().required("Salary period is required"),
    jobType: Yup.string().required("Job type is required"),
    experienceLevel: Yup.string().required("Experience level is required"),
    workType: Yup.string().required("Work type is required"),
    jobDescription: Yup.string().required("Job description is required"),
    Responsibilities: Yup.string().required("Responsibilities are required"),
    Requirements: Yup.string().required("Requirements are required"),
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const response = await getJobById(id);
        setJobData(response.data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const salaryPeriods = [
    { value: "hourly", label: "Hourly" },
    { value: "monthly", label: "Monthly" },
  ];

  const jobTypes = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
  ];

  const experienceLevels = [
    { value: "entry", label: "Entry Level" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior Level" },
  ];

  const workTypes = [
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
    { value: "onsite", label: "On-site" },
  ];

  const HandleConfirm = async () => {
    setOpen(false);
    if (formValues) {
      const { values, setSubmitting } = formValues;
      try {
        setIsLoading(true);
        await editJob(id, values);
        navigate("/CompanyDashboard");
      } catch (error) {
        console.error("Error updating job:", error);
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    }
  };

  if (!jobData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading job details...
        </Typography>
      </Box>
    );
  }
  return (
    <Formik
      initialValues={jobData}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setFormValues({ values, setSubmitting });
        setOpen(true);
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/CompanyDashboard")}
              sx={{ mb: 3 }}
              color="primary"
              variant="text"
            >
              Back to Dashboard
            </Button>

            <Card elevation={3}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Edit Job Posting
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Update the details for this job position
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    justifyContent: "space-between",
                  }}
                >
                  {/* Job Title */}
                  <Box sx={{ flex: "1 1 45%", minWidth: 250 }}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Job Title"
                      name="jobTitle"
                      placeholder="e.g. Senior Frontend Developer"
                      required
                      error={touched.jobTitle && Boolean(errors.jobTitle)}
                      helperText={<ErrorMessage name="jobTitle" />}
                    />
                  </Box>

                  {/* Location */}
                  <Box sx={{ flex: "1 1 45%", minWidth: 250 }}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Location"
                      name="location"
                      placeholder="e.g. New York, NY"
                      required
                      error={touched.location && Boolean(errors.location)}
                      helperText={<ErrorMessage name="location" />}
                    />
                  </Box>

                  {/* Salary */}
                  <Box sx={{ flex: "1 1 45%", minWidth: 250 }}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Salary"
                      name="salary"
                      placeholder="e.g. 80,000"
                      type="number"
                      required
                      error={touched.salary && Boolean(errors.salary)}
                      helperText={<ErrorMessage name="salary" />}
                    />
                  </Box>

                  {/* Salary Period */}
                  <Box sx={{ flex: "1 1 45%", minWidth: 250 }}>
                    <Field
                      as={TextField}
                      select
                      fullWidth
                      label="Salary Period"
                      name="salaryPeriod"
                      required
                      error={
                        touched.salaryPeriod && Boolean(errors.salaryPeriod)
                      }
                      helperText={<ErrorMessage name="salaryPeriod" />}
                    >
                      {salaryPeriods.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Box>

                  {/* Job Type */}
                  <Box sx={{ flex: "1 1 45%", minWidth: 250 }}>
                    <Field
                      as={TextField}
                      select
                      fullWidth
                      label="Job Type"
                      name="jobType"
                      required
                      error={touched.jobType && Boolean(errors.jobType)}
                      helperText={<ErrorMessage name="jobType" />}
                    >
                      {jobTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Box>

                  {/* Experience Level */}
                  <Box sx={{ flex: "1 1 45%", minWidth: 250 }}>
                    <Field
                      as={TextField}
                      select
                      fullWidth
                      label="Experience Level"
                      name="experienceLevel"
                      required
                      error={
                        touched.experienceLevel &&
                        Boolean(errors.experienceLevel)
                      }
                      helperText={<ErrorMessage name="experienceLevel" />}
                    >
                      {experienceLevels.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Box>

                  {/* Work Type */}
                  <Box sx={{ flex: "1 1 45%", minWidth: 250 }}>
                    <Field
                      as={TextField}
                      select
                      fullWidth
                      label="Work Type"
                      name="workType"
                      required
                      error={touched.workType && Boolean(errors.workType)}
                      helperText={<ErrorMessage name="workType" />}
                    >
                      {workTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Box>

                  {/* Divider full width */}
                  <Box sx={{ flexBasis: "100%" }}>
                    <Divider sx={{ my: 2 }} />
                  </Box>

                  {/* Job Description */}
                  <Box sx={{ flexBasis: "100%" }}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Job Description"
                      name="jobDescription"
                      placeholder="Describe the job position..."
                      multiline
                      rows={4}
                      required
                      error={
                        touched.jobDescription && Boolean(errors.jobDescription)
                      }
                      helperText={<ErrorMessage name="jobDescription" />}
                    />
                  </Box>

                  {/* Responsibilities */}
                  <Box sx={{ flexBasis: "100%" }}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Responsibilities"
                      name="Responsibilities"
                      placeholder="List the key Responsibilities..."
                      multiline
                      rows={4}
                      required
                      error={
                        touched.Responsibilities &&
                        Boolean(errors.Responsibilities)
                      }
                      helperText={<ErrorMessage name="Responsibilities" />}
                    />
                  </Box>

                  {/* Requirements */}
                  <Box sx={{ flexBasis: "100%" }}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Requirements"
                      name="Requirements"
                      placeholder="List the job requirements..."
                      multiline
                      rows={4}
                      required
                      error={
                        touched.Requirements && Boolean(errors.Requirements)
                      }
                      helperText={<ErrorMessage name="Requirements" />}
                    />
                  </Box>
                </Box>

                {/* Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 4,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/CompanyDashboard")}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    startIcon={
                      isLoading ? <CircularProgress size={20} /> : <Save />
                    }
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>

                  <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Confirm Save</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Are you sure you want to save the changes?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose} color="secondary">
                        Cancel
                      </Button>
                      <Button onClick={HandleConfirm} color="primary" autoFocus>
                        Confirm
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              </CardContent>
            </Card>
          </Container>
        </Form>
      )}
    </Formik>
  );
}

export default EditJob;
