import React from "react";
import { Box, TextField, Typography, Button, Grid } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Ellipse from "../../assets/Ellipse.png";
import Vector from "../../assets/Vector.png";
import "../../App.css";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { registerUser } from "../../API/API";

const TextFieldStyle = {
  width: "100%",
  borderRadius: "10px",
  backgroundColor: "transparent",
  color: "#fff",
  "& label, & label.Mui-focused, & .MuiInputBase-input": { color: "#fff" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#ccc" },
    "&:hover fieldset": { borderColor: "#fff" },
    "&.Mui-focused fieldset": { borderColor: "#fff" },
  },
  fontFamily: "Geist",
};

const ButtonStyle = {
  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.3rem" },
  bgcolor: "white",
  color: "black",
  "&:hover": { bgcolor: "#f0f0f0" },
  width: "100%",
  borderRadius: "8px",
  boxShadow: 3,
  textTransform: "none",
};

const Register = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .matches(/^[A-Za-z\u0600-\u06FF\s]+$/, "Only letters allowed")
      .min(2, "At least 2 characters")
      .required("First name is required"),
    lastName: Yup.string()
      .matches(/^[A-Za-z\u0600-\u06FF\s]+$/, "Only letters allowed")
      .min(2, "At least 2 characters")
      .required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    location: Yup.string()
      .min(2, "At least 2 characters")
      .required("Location is required"),
    mobileNumber: Yup.string()
      .matches(/^\d{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    dateOfBirth: Yup.date()
      .max(
        new Date(Date.now() - 13 * 365 * 24 * 60 * 60 * 1000),
        "Must be at least 13 years old"
      )
      .required("Date of birth is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "At least 8 characters")
      .matches(/[A-Z]/, "One uppercase letter required")
      .matches(/[a-z]/, "One lowercase letter required")
      .matches(/[0-9]/, "One digit required")
      .matches(/[@$!%*?&#^]/, "One special character required"),
    password2: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  return (
    <Box
      sx={{
        backgroundColor: "black",
        minHeight: "100vh",
        px: 2,
        py: 4,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "900px",
          bgcolor: "#121212",
          p: 4,
          borderRadius: 3,
          boxShadow: 5,
        }}
      >
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            location: "",
            mobileNumber: "",
            password: "",
            password2: "",
            dateOfBirth: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              const res = await registerUser({
                ...values,
                mobileNumber: String(values.mobileNumber),
              });

              if (res.data?.errors) {
                res.data.errors.forEach((err) => {
                  setFieldError(err.param, err.msg);
                });
                return;
              }

              if (res.data?.message) {
                navigate("/verify-email", { state: { email: values.email } });
                return;
              }

              setFieldError("email", "Registration failed. Please try again.");
            } catch (error) {
              const serverMessage =
                error.response?.data?.message || error.response?.data?.error;

              if (serverMessage?.toLowerCase().includes("already")) {
                setFieldError("email", "Account already exists");
              } else {
                setFieldError("email", "Account already exists");
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Typography
                variant="h3"
                align="center"
                sx={{ color: "white", mb: 3, fontFamily: "Geist" }}
              >
                Register
              </Typography>

              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Box sx={{ flex: 1, minWidth: "300px" }}>
                  <Field
                    as={TextField}
                    name="firstName"
                    label="First Name"
                    fullWidth
                    variant="outlined"
                    sx={{ ...TextFieldStyle, mb: 2 }}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={<ErrorMessage name="firstName" />}
                  />
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    variant="outlined"
                    sx={{ ...TextFieldStyle, mb: 2 }}
                    error={touched.email && Boolean(errors.email)}
                    helperText={<ErrorMessage name="email" />}
                  />
                  <Field
                    as={TextField}
                    name="dateOfBirth"
                    type="date"
                    label="Date of Birth"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    variant="outlined"
                    sx={{ ...TextFieldStyle, mb: 2 }}
                    error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                    helperText={<ErrorMessage name="dateOfBirth" />}
                  />
                  <Field
                    as={TextField}
                    name="password"
                    type="password"
                    label="Password"
                    fullWidth
                    variant="outlined"
                    sx={{ ...TextFieldStyle, mb: 2 }}
                    error={touched.password && Boolean(errors.password)}
                    helperText={<ErrorMessage name="password" />}
                  />
                </Box>

                <Box sx={{ flex: 1, minWidth: "300px" }}>
                  <Field
                    as={TextField}
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    variant="outlined"
                    sx={{ ...TextFieldStyle, mb: 2 }}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={<ErrorMessage name="lastName" />}
                  />
                  <Field
                    as={TextField}
                    name="location"
                    label="Location"
                    fullWidth
                    variant="outlined"
                    sx={{ ...TextFieldStyle, mb: 2 }}
                    error={touched.location && Boolean(errors.location)}
                    helperText={<ErrorMessage name="location" />}
                  />
                  <Field
                    as={TextField}
                    name="mobileNumber"
                    label="Mobile Number"
                    fullWidth
                    variant="outlined"
                    sx={{ ...TextFieldStyle, mb: 2 }}
                    error={touched.mobileNumber && Boolean(errors.mobileNumber)}
                    helperText={<ErrorMessage name="mobileNumber" />}
                  />
                  <Field
                    as={TextField}
                    name="password2"
                    type="password"
                    label="Confirm Password"
                    fullWidth
                    variant="outlined"
                    sx={{ ...TextFieldStyle, mb: 2 }}
                    error={touched.password2 && Boolean(errors.password2)}
                    helperText={<ErrorMessage name="password2" />}
                  />
                </Box>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ ...ButtonStyle, mt: 4 }}
                endIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>

              <Typography
                variant="body1"
                align="center"
                sx={{ mt: 2, color: "#B9BBBD", fontFamily: "Geist" }}
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{ color: "#90caf9", textDecoration: "none" }}
                >
                  Login
                </Link>
              </Typography>
              <Typography
                variant="body1"
                align="center"
                sx={{ mt: 2, color: "#B9BBBD", fontFamily: "Geist" }}
              >
                Are you a company ?{" "}
                <Link
                  to="/CompanyRegister"
                  style={{ color: "#90caf9", textDecoration: "none" }}
                >
                  Register as Company
                </Link>
              </Typography>
            </Form>
          )}
        </Formik>
      </Box>

      <img
        src={Ellipse}
        alt="Ellipse"
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "25%",
          maxWidth: "250px",
          opacity: 0.4,
        }}
      />
      <img
        src={Vector}
        alt="Vector"
        style={{
          position: "fixed",
          bottom: "0",
          right: "0",
          width: "25%",
          maxWidth: "250px",
          opacity: 0.4,
        }}
      />
    </Box>
  );
};

export default Register;
