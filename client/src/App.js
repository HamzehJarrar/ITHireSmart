import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { UserProvider } from "./utils/UserContext";

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
import Courses from "./components/Courses/Courses";
import PostJob from "./components/jobs/post-job";
import UploadCvPage from "./components/users/UploadCvPage";
import CompanyJobs from "./components/jobs/CompanyJobs";
import EditJob from "./components/jobs/EditJob";
import ApplicantsPage from "./components/jobs/ApplicantsPage";
import MyProfile from "./components/users/MyProfile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ForgotPassword from "./components/auth/forgotpassword";
import UserSetting from "./components/users/UserSetting";
import UserDetailsPage from "./components/users/UserDetailsPage";
import Settings from "./components/common/Settings";
import Security from "./components/users/Security";
import PostCourse from "./components/Courses/post-course";
import CourseDetails from "./components/Courses/CourseDetails";
import CompanyDashboard from "./components/Company/CompanyDashboard";
import CompanyCourses from "./components/Courses/CompanyCourses";
import EditCourse from "./components/Courses/EditCourse";
import CoursesApplicants from "./components/Courses/CoursesApplicants";
import VerifyEmail from "./components/auth/VerifyEmail";
import Trainings from "./components/Training/Trainings";
import TrainingDetails from "./components/Training/TrainingDetails";
import CompanyTrainings from "./components/Training/CompanyTrainings";
import PostTraining from "./components/Training/post-training";
import TrainingsApplicants from "./components/Training/TrainingsApplicants";
import EditTraining from "./components/Training/EditTraining";
import ConfirmEmail from "./components/auth/ConfirmEmail";
import CompanyRegister from "./components/Company/CompanyRegister";
import ConfirmCompanyEmail from "./components/Company/ConfirmCompanyEmail";
import CompanyLogin from "./components/Company/CompanyLogin";
import CompanyProfilePage from "./components/Company/CompanyProfilePage";
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
      return response.data;
    } catch (error) {
      return { errors: [{ param: "email", msg: "Invalid email or password" }] };
    }
  };

  const showNavbar = ![
    "/",
    "/login",
    "/register",
    "/authentication",
    "/forgotpassword",
    "/confirmemail",
    "/verify-email",
    "/companyregister",
    "/confirmcompanyemail",
    "/companylogin",
  ].includes(location.pathname.toLowerCase());

  return (
    <UserProvider>
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
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/UserSetting" element={<UserSetting />} />
          <Route path="/user/:id" element={<UserDetailsPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/security" element={<Security />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/trainings" element={<Trainings />} />
          <Route path="/training/:id" element={<TrainingDetails />} />
          <Route path="/ConfirmEmail" element={<ConfirmEmail />} />
          <Route path="/companyregister" element={<CompanyRegister />} />
          <Route path="/companylogin" element={<CompanyLogin />} />
          <Route path="/CompanyProfilePage" element={<CompanyProfilePage />} />
          
          {/* Protected Routes for company role */}
          <Route element={<ProtectedRoute allowedRole="company" />}>
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/CompanyJobs " element={<CompanyJobs />} />
            <Route path="/jobs/:id/edit" element={<EditJob />} />
            <Route
              path="/jobs/:jobId/applicants"
              element={<ApplicantsPage />}
            />
            <Route path="/post-course" element={<PostCourse />} />
            <Route path="/companydashboard" element={<CompanyDashboard />} />
            <Route path="/companycourses" element={<CompanyCourses />} />
            <Route path="/EditCourses/:id" element={<EditCourse />} />
            <Route
              path="/courses/:courseId/applicants"
              element={<CoursesApplicants />}
            />
            <Route path="/companytrainings" element={<CompanyTrainings />} />
            <Route path="/post-training" element={<PostTraining />} />
            <Route
              path="/training-applicants/:trainingId"
              element={<TrainingsApplicants />}
            />
            <Route path="/edit-training/:id" element={<EditTraining />} />
            <Route
              path="/confirmcompanyemail"
              element={<ConfirmCompanyEmail />}
            />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Fragment>
    </UserProvider>
  );
}

export default App;
