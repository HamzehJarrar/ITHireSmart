import React from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { registerCompany } from "../../API/company";

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

const CompanyRegister = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    companyName: Yup.string()
      .min(2, "At least 2 characters")
      .required("Company name is required"),
    companyEmail: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    location: Yup.string()
      .min(2, "At least 2 characters")
      .required("Location is required"),
    companyDescription: Yup.string()
      .min(10, "At least 10 characters")
      .required("Company description is required"),
    companyField: Yup.string()
      .min(2, "At least 2 characters")
      .required("Company field is required"),
    companyNumbers: Yup.string()
      .matches(/^[0-9-]+$/, "Invalid phone number format")
      .required("Company phone number is required"),
    companyWebsite: Yup.string().url("Invalid URL"),

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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "700px",
          bgcolor: "#121212",
          p: 4,
          borderRadius: 3,
          boxShadow: 5,
        }}
      >
        <Formik
          initialValues={{
            companyName: "",
            companyEmail: "",
            location: "",
            companyDescription: "",
            companyField: "",
            companyNumbers: "",
            companyWebsite: "",
            contactName: "",
            contactPosition: "",
            contactPhoneNumber: "",
            password: "",
            password2: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              const { password2, ...companyData } = values;
              const res = await registerCompany(companyData);

              if (res.data?.error) {
                setFieldError("companyEmail", res.data.error);
                return;
              }

              if (res.data?.token) {
                // خزّن القيم المهمة هنا:
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("companyToken", res.data.token);
                localStorage.setItem("userId", res.data.userId); // لازم backend يرجع userId في رد التسجيل
                localStorage.setItem("role", "company");

                navigate("/verify-email", {
                  state: { email: values.companyEmail },
                });
                return;
              }

              if (res.data?.message) {
                // لو فقط رسالة بدون توكن، توجه للتحقق
                navigate("/verify-email", {
                  state: { email: values.companyEmail },
                });
                return;
              }

              setFieldError(
                "companyEmail",
                "Registration failed. Please try again."
              );
            } catch (error) {
              setFieldError(
                "companyEmail",
                error.response?.data?.error || "Error occurred. Try again."
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Typography
                variant="h4"
                align="center"
                sx={{ color: "white", mb: 3, fontFamily: "Geist" }}
              >
                Company Register
              </Typography>

              <Field
                as={TextField}
                name="companyName"
                label="Company Name"
                fullWidth
                variant="outlined"
                sx={{ ...TextFieldStyle, mb: 2 }}
                error={touched.companyName && Boolean(errors.companyName)}
                helperText={<ErrorMessage name="companyName" />}
              />
              <Field
                as={TextField}
                name="companyEmail"
                label="Email"
                fullWidth
                variant="outlined"
                sx={{ ...TextFieldStyle, mb: 2 }}
                error={touched.companyEmail && Boolean(errors.companyEmail)}
                helperText={<ErrorMessage name="companyEmail" />}
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
                name="companyDescription"
                label="Company Description"
                fullWidth
                variant="outlined"
                sx={{ ...TextFieldStyle, mb: 2 }}
                error={
                  touched.companyDescription &&
                  Boolean(errors.companyDescription)
                }
                helperText={<ErrorMessage name="companyDescription" />}
              />
              <Field
                as={TextField}
                name="companyField"
                label="Company Field"
                fullWidth
                variant="outlined"
                sx={{ ...TextFieldStyle, mb: 2 }}
                error={touched.companyField && Boolean(errors.companyField)}
                helperText={<ErrorMessage name="companyField" />}
              />
              <Field
                as={TextField}
                name="companyNumbers"
                label="Company Phone Number"
                fullWidth
                variant="outlined"
                sx={{ ...TextFieldStyle, mb: 2 }}
                error={touched.companyNumbers && Boolean(errors.companyNumbers)}
                helperText={<ErrorMessage name="companyNumbers" />}
              />
              <Field
                as={TextField}
                name="companyWebsite"
                label="Company Website"
                fullWidth
                variant="outlined"
                sx={{ ...TextFieldStyle, mb: 2 }}
                error={touched.companyWebsite && Boolean(errors.companyWebsite)}
                helperText={<ErrorMessage name="companyWebsite" />}
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

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ ...ButtonStyle, mt: 4 }}
                endIcon={<ArrowForwardIcon />}
              >
                Register
              </Button>

              <Typography
                variant="body1"
                align="center"
                sx={{ mt: 2, color: "#B9BBBD", fontFamily: "Geist" }}
              >
                Already have a company account?{" "}
                <Link
                  to="/login"
                  style={{ color: "#90caf9", textDecoration: "none" }}
                >
                  Login
                </Link>
              </Typography>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default CompanyRegister;
