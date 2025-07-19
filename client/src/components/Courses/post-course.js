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
import { addCourse } from "../../API/courseAPI";
import SchoolIcon from "@mui/icons-material/School";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const PostCourse = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [initialInstructor, setInitialInstructor] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    if (firstName && lastName) {
      setInitialInstructor(`${firstName} ${lastName}`);
    }
  }, []);

  const validationSchema = Yup.object({
    courseTitle: Yup.string().required("Course title is required"),
    location: Yup.string().required("Location is required"),
    courseType: Yup.string().required("Course type is required"),
    startAt: Yup.date().required("Start date is required"),
    endAt: Yup.date().required("End date is required"),
    description: Yup.string().required("Description is required"),
    capacity: Yup.number()
      .typeError("Must be a number")
      .nullable()
      .min(1, "Capacity must be at least 1"),
    topics: Yup.string().required("Topics are required"),
    duration: Yup.string().required("Duration is required"),
    requirements: Yup.string().required("Requirements are required"),
  });

  const minDate = dayjs().add(1, "day").format("YYYY-MM-DD");

  return (
    <Formik
      enableReinitialize
      initialValues={{
        courseTitle: "",
        instructorName: "",
        location: "Online",
        courseType: "Online",
        startAt: minDate,
        endAt: minDate,
        description: "",
        capacity: "",
        topics: "",
        duration: "1 month",
        requirements: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        setShowConfirm(true);
        setConfirmCallback(() => async () => {
          const courseData = {
            ...values,
            topics: values.topics.split(",").map((item) => item.trim()),
            capacity:
              values.capacity === ""
                ? null
                : Number(values.capacity),
            requirements: values.requirements
              .split(",")
              .map((item) => item.trim()),
          };

          try {
            await addCourse(courseData);
            console.log("Course Data to be sent:", courseData);
            setSnackbarMessage("Course posted successfully");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            resetForm();
            setTimeout(() => {
              navigate("/Courses");
            }, 1500);
          } catch (error) {
            console.error(error);
            setSnackbarMessage("Failed to post course");
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
            Post a Course
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Fill out the form below to post a new course offering
          </Typography>
          <Divider sx={{ mt: 2, mb: 2 }} />

          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
            <SchoolIcon sx={{ fontSize: 28 }} />
            <Typography variant="h6" fontWeight="bold">
              Course Information
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Course Title"
              name="courseTitle"
              value={values.courseTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.courseTitle && Boolean(errors.courseTitle)}
              helperText={touched.courseTitle && errors.courseTitle}
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
              
            />
            <TextField
              select
              label="Course Type"
              name="courseType"
              value={values.courseType}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.courseType && Boolean(errors.courseType)}
              helperText={touched.courseType && errors.courseType}
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
              disabled={values.courseType === "Online"}
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
              name="duration"
              value={values.duration}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.duration && Boolean(errors.duration)}
              helperText={touched.duration && errors.duration}
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
              error={
                touched.capacity && Boolean(errors.capacity)
              }
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
              Course Details
            </Typography>
          </Box>
          <Divider sx={{ mt: 2, mb: 2 }} />

          <TextField
            label="Description"
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.description && Boolean(errors.description)}
            helperText={touched.description && errors.description}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />

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

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
            <CalendarMonthIcon />
            <Typography variant="h6" fontWeight="bold">
              Topics
            </Typography>
          </Box>
          <Divider sx={{ mt: 1, mb: 1 }} />

          <TextField
            label="Topics (comma separated)"
            name="topics"
            value={values.topics}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.topics && Boolean(errors.topics)}
            helperText={touched.topics && errors.topics}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              By posting this course, you agree to our terms and conditions.
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, bgcolor: "black" }}
            startIcon={<SchoolIcon />}
          >
            Post Course
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
              Are you sure you want to post this course?
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

export default PostCourse;
