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
import { postTraing } from "../../API/trainingAPI";
import WorkIcon from "@mui/icons-material/Work";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const PostTraining = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [initialInstructor, setInitialInstructor] = useState("");
  const [initialCompany, setInitialCompany] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const companyName = localStorage.getItem("companyName");
    if (firstName && lastName) {
      setInitialInstructor(`${firstName} ${lastName}`);
    }
    if (companyName) {
      setInitialCompany(companyName);
    }
  }, []);

  const validationSchema = Yup.object({
    trainingTitle: Yup.string().required("Training title is required"),
    location: Yup.string().required("Location is required"),
    trainingType: Yup.string().required("Training type is required"),
    startAt: Yup.date().required("Start date is required"),
    endAt: Yup.date().required("End date is required"),
    trainingDescription: Yup.string().required("Description is required"),
    capacity: Yup.number()
      .typeError("Must be a number")
      .nullable()
      .min(1, "Capacity must be at least 1"),
    topicsCovered: Yup.string().required("Topics are required"),
    Duration: Yup.string().required("Duration is required"),
    Requirements: Yup.string().required("Requirements are required"),
  });

  const minDate = dayjs().add(1, "day").format("YYYY-MM-DD");

  return (
    <Formik
      enableReinitialize
      initialValues={{
        trainingTitle: "",
        instructorName: initialInstructor,
        companyName: initialCompany,
        location: "Online",
        trainingType: "Online",
        startAt: minDate,
        endAt: minDate,
        trainingDescription: "",
        capacity: "",
        topicsCovered: "",
        Duration: "1 month",
        Requirements: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        setShowConfirm(true);
        setConfirmCallback(() => async () => {
          const trainingData = {
            ...values,
            topicsCovered: values.topicsCovered
              .split(",")
              .map((item) => item.trim()),
            capacity: values.capacity === "" ? null : Number(values.capacity),
            requirements: values.Requirements.split(",").map((item) =>
              item.trim()
            ),
          };

          try {
            await postTraing(trainingData);
            console.log("Training Data to be sent:", trainingData);
            setSnackbarMessage("Training posted successfully");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            resetForm();
            setTimeout(() => {
              navigate("/Trainings");
            }, 1500);
          } catch (error) {
            console.error(error);
            console.log(error.response);
            setSnackbarMessage("Failed to post training");
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
            onClick={() => navigate(-1)}
          >
            Back
          </Button>

          <Typography variant="h4" gutterBottom fontWeight="bold">
            Post a Training
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Fill out the form below to post a new training offering
          </Typography>
          <Divider sx={{ mt: 2, mb: 2 }} />

          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
            <WorkIcon sx={{ fontSize: 28 }} />
            <Typography variant="h6" fontWeight="bold">
              Training Information
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Training Title"
              name="trainingTitle"
              value={values.trainingTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.trainingTitle && Boolean(errors.trainingTitle)}
              helperText={touched.trainingTitle && errors.trainingTitle}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Instructor Name"
              name="instructorName"
              value={values.instructorName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.instructorName && Boolean(errors.instructorName)}
              helperText={touched.instructorName && errors.instructorName}
              fullWidth
              margin="normal"
              disabled
            />

            <TextField
              select
              label="Training Type"
              name="trainingType"
              value={values.trainingType}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.trainingType && Boolean(errors.trainingType)}
              helperText={touched.trainingType && errors.trainingType}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="company">Company</MenuItem>
            </TextField>

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
              disabled={values.trainingType === "Online"}
            />

            <TextField
              fullWidth
              type="date"
              name="startAt"
              label="Start Date"
              value={values.startAt}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                min: minDate,
              }}
              error={touched.startAt && Boolean(errors.startAt)}
              helperText={touched.startAt && errors.startAt}
              margin="normal"
            />
            <TextField
              fullWidth
              type="date"
              name="endAt"
              label="End Date"
              value={values.endAt}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                min: values.startAt || minDate,
              }}
              error={touched.endAt && Boolean(errors.endAt)}
              helperText={touched.endAt && errors.endAt}
              margin="normal"
            />

            <TextField
              label="Duration"
              name="Duration"
              value={values.Duration}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.Duration && Boolean(errors.Duration)}
              helperText={touched.Duration && errors.Duration}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Capacity"
              name="capacity"
              type="number"
              value={values.capacity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.capacity && Boolean(errors.capacity)}
              helperText={touched.capacity && errors.capacity}
              fullWidth
              margin="normal"
            />
          </Box>

          <Box
            sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2, gap: 1 }}
          >
            <DescriptionIcon sx={{ fontSize: 28 }} />
            <Typography variant="h6" fontWeight="bold">
              Training Details
            </Typography>
          </Box>
          <Divider sx={{ mt: 2, mb: 2 }} />

          <TextField
            label="Training Description"
            name="trainingDescription"
            value={values.trainingDescription}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.trainingDescription && Boolean(errors.trainingDescription)
            }
            helperText={
              touched.trainingDescription && errors.trainingDescription
            }
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />

          <TextField
            label="Requirements (comma separated)"
            name="Requirements"
            value={values.Requirements}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.Requirements && Boolean(errors.Requirements)}
            helperText={touched.Requirements && errors.Requirements}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
            <CalendarMonthIcon />
            <Typography variant="h6" fontWeight="bold">
              Topics Covered
            </Typography>
          </Box>
          <Divider sx={{ mt: 1, mb: 1 }} />

          <TextField
            label="Topics Covered (comma separated)"
            name="topicsCovered"
            value={values.topicsCovered}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.topicsCovered && Boolean(errors.topicsCovered)}
            helperText={touched.topicsCovered && errors.topicsCovered}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              By posting this training, you agree to our terms and conditions.
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, bgcolor: "black" }}
            startIcon={<WorkIcon />}
          >
            Post Training
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
              Are you sure you want to post this training?
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

export default PostTraining;
