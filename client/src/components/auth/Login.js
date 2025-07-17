import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import React, { useState } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import Ellipse from "../../assets/Ellipse.png";
import Vector from "../../assets/Vector.png";
import "../../App.css";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FormHelperText } from "@mui/material";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  color: "white",
  flexDirection: "column",
  gap: "20px",
  position: "relative",
  padding: "0 20px",
};

const ImageStyleTopLeft = {
  position: "absolute",
  top: "0px",
  left: "0px",
  width: "35%",
  maxWidth: "350px",
};

const ImageStyleBottomRight = {
  position: "absolute",
  bottom: "0px",
  right: "0px",
  width: "35%",
  maxWidth: "350px",
};

const TextFieldStyle = {
  width: "100%",
  maxWidth: "400px",
  height: "50px",
  borderRadius: "15px",
  backgroundColor: "transparent",
  color: "#fff",
  "& label, & label.Mui-focused, & .MuiInputBase-input": { color: "#fff" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#fff" },
    "&:hover fieldset": { borderColor: "#fff" },
    "&.Mui-focused fieldset": { borderColor: "#fff" },
  },
  fontFamily: "Poppins",
};

const ButtonStyle = {
  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
  bgcolor: "white",
  color: "black",
  "&:hover": { bgcolor: "#f0f0f0" },
  width: "100%",
  maxWidth: "450px",
  borderRadius: "10px",
  fontFamily: "Geist",
};

const Login = ({ login, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigator = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };



  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, setFieldError }) => {
        try {
          const res = await login(values);
          if (res && res.token) {
            localStorage.setItem("role", res.role || type);
            localStorage.setItem("email", res.email);
            localStorage.setItem("userId", res.id);

            if (type === "company") {
              localStorage.setItem("companyName", res.companyName);
              navigator("/CompanyDashboard");
            } else {
              localStorage.setItem("firstName", res.firstName);
              localStorage.setItem("lastName", res.lastName);
              navigator("/FindJob");
            }
          } else if (res && res.errors && Array.isArray(res.errors)) {
            res.errors.forEach((error) => {
              setFieldError(error.param || "email", error.msg || "Login failed");
            });
          } else if (res && res.msg) {
            setFieldError("email", res.msg);
          } else {
            setFieldError("email", "Login failed. Please try again.");
          }
        } catch (error) {
          setFieldError("email", "An error occurred during login.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, handleChange, handleBlur }) => (
        <Form>
          <Box sx={{ backgroundColor: "black", height: "100vh", position: "relative" }}>
            <Box sx={style}>
              <Typography variant="h2" sx={{ fontFamily: "Geist", textAlign: "center" }}>
                {type === "company" ? "Company Login" : "Login"}
              </Typography>
              <Typography variant="h6" sx={{ fontFamily: "Geist", textAlign: "center" }}>
                {type === "company"
                  ? "Please enter your company Email and Password"
                  : "Please enter your Email and your Password"}
              </Typography>

              {/* Email Field */}
              <Box sx={{ width: "100%", maxWidth: "400px" }}>
                <Field
                  name="email"
                  as={TextField}
                  label="Email"
                  variant="outlined"
                  sx={TextFieldStyle}
                  error={touched.email && Boolean(errors.email)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.email && errors.email && (
                  <FormHelperText sx={{ color: "red", mt: 1 }}>{errors.email}</FormHelperText>
                )}
              </Box>

              {/* Password Field */}
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "400px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Field
                  name="password"
                  as={TextField}
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  variant="outlined"
                  sx={TextFieldStyle}
                  error={touched.password && Boolean(errors.password)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end" sx={{ color: "white" }}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Forgot Password */}
              {type !== "company" && (
                <Typography variant="body2" sx={{ fontFamily: "Geist", textAlign: "center", mt: 1 }}>
                  Forgot Password?{" "}
                  <Button
                    onClick={() => navigator("/forgotpassword")}
                    variant="text"
                    sx={{
                      color: "white",
                      textDecoration: "underline",
                      padding: 0,
                      minWidth: 0,
                    }}
                  >
                    Reset
                  </Button>
                </Typography>
              )}

              {/* Submit Button */}
              <Button type="submit" variant="contained" fullWidth size="large" sx={ButtonStyle}>
                Login
              </Button>

              {/* Switch to Register */}
              <Typography variant="body2" sx={{ fontFamily: "Geist", textAlign: "center" }}>
                {type === "company" ? "Don't have a company account?" : "Don't have an account?"}{" "}
                <Button
                  onClick={() => navigator(type === "company" ? "/register-company" : "/register")}
                  variant="text"
                  sx={{ color: "white", textDecoration: "underline" }}
                >
                  Register
                </Button>
              </Typography>

              <img src={Ellipse} alt="Ellipse" style={ImageStyleTopLeft} />
              <img src={Vector} alt="Vector" style={ImageStyleBottomRight} />
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default Login;
