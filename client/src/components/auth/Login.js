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
import { loginCompany } from "../../API/company.js";
import { loginUser } from "../../API/API.js";

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
          const loginFunction = async (values) => {
            if (type === "company") {
              return await loginCompany(values.companyEmail, values.password);
            } else {
              return await loginUser(values);
            }
          };

          const res = await loginFunction(values);

          if (res && res.data && res.data.token) {
            const data = res.data;
            localStorage.setItem("role", data.role || type);
            localStorage.setItem("email", data.email);
            localStorage.setItem("userId", data.id);
            localStorage.setItem("token", data.token);

            if (type === "company") {
              localStorage.setItem("companyName", data.companyName);
              navigator("/CompanyDashboard");
            } else {
              localStorage.setItem("firstName", data.firstName);
              localStorage.setItem("lastName", data.lastName);
              navigator("/FindJob");
            }
          } else if (
            res &&
            res.data &&
            res.data.errors &&
            Array.isArray(res.data.errors)
          ) {
            res.data.errors.forEach((error) => {
              setFieldError(
                error.param || "email",
                error.msg || "Login failed"
              );
            });
          } else if (res && res.data && res.data.msg) {
            setFieldError("email", res.data.msg);
          } else {
            setFieldError("email", "Login failed. Please try again.");
          }
        } catch (error) {
          const msg =
            error?.response?.data?.msg || "An error occurred during login.";
          setFieldError("email", msg);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, handleChange, handleBlur }) => (
        <Form>
          <Box
            sx={{
              backgroundColor: "black",
              height: "100vh",
              position: "relative",
            }}
          >
            <Box sx={style}>
              {/* العنوان */}
              <Typography
                variant="h3"
                sx={{ fontFamily: "Geist", textAlign: "center", mb: 1 }}
              >
                {type === "company" ? "Company Login" : "Login"}
              </Typography>

              {/* الوصف */}
              <Typography
                variant="subtitle1"
                sx={{ fontFamily: "Geist", textAlign: "center", mb: 3 }}
              >
                {type === "company"
                  ? "Please enter your company email and password"
                  : "Please enter your email and password"}
              </Typography>

              {/* Email Field */}
              <Box sx={{ width: "100%", maxWidth: "400px", mb: 2 }}>
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
                  <FormHelperText sx={{ color: "red", mt: 1 }}>
                    {errors.email}
                  </FormHelperText>
                )}
              </Box>

              {/* Password Field */}
              <Box sx={{ width: "100%", maxWidth: "400px", mb: 1.5 }}>
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
                        <IconButton
                          onClick={handleTogglePassword}
                          edge="end"
                          sx={{ color: "white" }}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Forgot Password */}
              {type !== "company" && (
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Geist",
                    textAlign: "right",
                    width: "100%",
                    maxWidth: "400px",
                    mb: 2,
                  }}
                >
                  Forgot password?{" "}
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
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={ButtonStyle}
              >
                Login
              </Button>

              {/* Switch to Register */}
              <Typography
                variant="body2"
                sx={{ fontFamily: "Geist", textAlign: "center", mt: 2 }}
              >
                {type === "company"
                  ? "Don't have a company account?"
                  : "Don't have an account?"}{" "}
                <Button
                  onClick={() =>
                    navigator(
                      type === "company" ? "/register-company" : "/register"
                    )
                  }
                  variant="text"
                  sx={{ color: "white", textDecoration: "underline" }}
                >
                  Register
                </Button>
              </Typography>

              {/* Optional: Switch to other login if someone ends up on wrong page */}
              <Typography
                variant="body2"
                sx={{ fontFamily: "Geist", textAlign: "center" }}
              >
                {type === "company"
                  ? "Want to login as user?"
                  : "Want to login as company?"}{" "}
                <Button
                  onClick={() =>
                    navigator(type === "company" ? "/login" : "/CompanyLogin")
                  }
                  variant="text"
                  sx={{ color: "white", textDecoration: "underline" }}
                >
                  Switch
                </Button>
              </Typography>

              {/* Background Images */}
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
