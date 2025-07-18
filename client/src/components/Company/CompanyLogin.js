import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { loginCompany } from "../../API/company.js";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  color: "white",
  flexDirection: "column",
  gap: "20px",
  backgroundColor: "black",
  padding: "0 20px",
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
  fontSize: "1.2rem",
  bgcolor: "white",
  color: "black",
  "&:hover": { bgcolor: "#f0f0f0" },
  width: "100%",
  maxWidth: "450px",
  borderRadius: "10px",
  fontFamily: "Geist",
};

const CompanyLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    companyEmail: Yup.string()
      .email("Invalid email address")
      .required("Company Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Formik
      initialValues={{ companyEmail: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, setFieldError }) => {
        try {
          const res = await loginCompany(values.companyEmail, values.password);
          if (res && res.data && res.data.token) {
            const data = res.data;
            localStorage.setItem("role", data.role || "company");
            localStorage.setItem("email", data.email);
            localStorage.setItem("companyId", data.id);
            localStorage.setItem("companyName", data.companyName);
            localStorage.setItem("token", data.token);
            
            navigate("/CompanyDashboard");
            
          } else if (
            res &&
            res.data &&
            res.data.errors &&
            Array.isArray(res.data.errors)
          ) {
            res.data.errors.forEach((error) => {
              setFieldError(
                error.param || "companyEmail",
                error.msg || "Login failed"
              );
            });
          } else if (res && res.data && res.data.msg) {
            setFieldError("companyEmail", res.data.msg);
          } else {
            setFieldError("companyEmail", "Login failed. Please try again.");
          }
        } catch (error) {
          const msg =
            error?.response?.data?.msg || "An error occurred during login.";
          setFieldError("companyEmail", msg);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, handleChange, handleBlur }) => (
        <Form>
          <Box sx={style}>
            <Typography variant="h3" sx={{ mb: 3, fontFamily: "Geist" }}>
              Company Login
            </Typography>

            <Field
              name="companyEmail"
              as={TextField}
              label="Company Email"
              variant="outlined"
              sx={TextFieldStyle}
              error={touched.companyEmail && Boolean(errors.companyEmail)}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
            />
            {touched.companyEmail && errors.companyEmail && (
              <FormHelperText sx={{ color: "red", mb: 2 }}>
                {errors.companyEmail}
              </FormHelperText>
            )}

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
              fullWidth
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
            {touched.password && errors.password && (
              <FormHelperText sx={{ color: "red", mb: 2 }}>
                {errors.password}
              </FormHelperText>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={ButtonStyle}
            >
              Login
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default CompanyLogin;
