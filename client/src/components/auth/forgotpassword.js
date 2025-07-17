import React from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  FormHelperText,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

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
  maxWidth: "400px",
  borderRadius: "10px",
  fontFamily: "Geist",
};

const ForgotPassword = () => {
  const navigator = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log("Reset email sent to:", values.email);
        // send email logic here
        setTimeout(() => {
          setSubmitting(false);
          navigator("/login");
        }, 1500);
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
              <Typography
                variant="h4"
                sx={{ fontFamily: "Geist", textAlign: "center" }}
              >
                Forgot Password
              </Typography>

              <Typography
                variant="body1"
                sx={{ fontFamily: "Geist", textAlign: "center", mb: 1 }}
              >
                Enter your email and we'll send you a reset link
              </Typography>

              <Box sx={{ width: "100%", maxWidth: "400px" }}>
                <Field
                  name="email"
                  as={TextField}
                  label="Email"
                  variant="outlined"
                  sx={TextFieldStyle}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                />
                {touched.email && errors.email && (
                  <FormHelperText sx={{ color: "red", mt: 1 }}>
                    {errors.email}
                  </FormHelperText>
                )}
              </Box>

              <Button type="submit" variant="contained" sx={ButtonStyle}>
                Send Reset Link
              </Button>

              <Button
                onClick={() => navigator("/login")}
                variant="text"
                sx={{ color: "white", textDecoration: "underline" }}
              >
                Back to Login
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPassword;
