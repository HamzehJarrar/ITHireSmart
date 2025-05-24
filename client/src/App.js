import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Landing from "./components/pages/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import FindJob from "./components/jobs/FindJob";
import Authentication from "./components/auth/Authentication";
import { Fragment } from "react";
import { registerUser, loginUser } from "./API/API";
import Navbar from "./components/common/Navbar";
import JobDetails from "./components/jobs/JobDetails";
import NotFoundPage from "./components/pages/NotFound404";
import Courses from "./components/pages/Courses";
import PostJob from "./components/jobs/post-job";
import UploadCvPage from "./components/users/UploadCvPage";
import CompanyDashboard from "./components/jobs/CompanyDashboard";
import EditJob from "./components/jobs/EditJob";
import ApplicantsPage from "./components/jobs/ApplicantsPage";
import UserProfilePage from "./components/users/UserProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ForgotPassword from "./components/auth/forgotpassword"
function App() {
  const location = useLocation();

  const handleRegister = async (values) => {
    try {
      const response = await registerUser(values);
      return response.data;
    } catch (error) {
      if (error.response?.data?.errors) {
        return { errors: error.response.data.errors };
      }
      return {
        errors: [
          {
            param: "general",
            msg: "An unexpected error occurred. Please try again later.",
          },
        ],
      };
    }
  };

  const handleLogin = async (values) => {
    try {
      const response = await loginUser(values);
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
      }
      // console.log("Backend response:", response.data);
      return response.data;
    } catch (error) {
      return { errors: [{ param: "email", msg: "Invalid email or password" }] };
    }
  };

  const showNavbar = !["/", "/login", "/register", "/authentication" ,"/forgotpassword"].includes(
    location.pathname.toLowerCase()
  );

  return (
    <Fragment>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login login={handleLogin} />} />
        <Route
          path="/register"
          element={<Register register={handleRegister} />}
        />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/findjob" element={<FindJob />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/uploadcvpage" element={<UploadCvPage />} />
        <Route path="/user/:userId" element={<UserProfilePage />} />

        {/* Protected Routes for company role */}
        <Route element={<ProtectedRoute allowedRole="company" />}>
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/companydashboard" element={<CompanyDashboard />} />
          <Route path="/jobs/:id/edit" element={<EditJob />} />
          <Route path="/jobs/:jobId/applicants" element={<ApplicantsPage />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Fragment>
  );
}

export default App;
