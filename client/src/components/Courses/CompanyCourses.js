import React, { useEffect, useState } from "react";
import {
  getCompanyCourses,
  hideCourse,
  unhideCourse,
  deleteCourse,
} from "../../API/courseAPI";
import enhancedBlackAndWhiteTheme from "../../assets/enhancedBlackAndWhiteTheme";
import {
  Button,
  Card,
  Typography,
  Box,
  Container,
  CircularProgress,
  Paper,
  Stack,
  ThemeProvider,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useNavigate } from "react-router-dom";

const CompanyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getCompanyCourses(userId);
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  const handleDialogConfirm = async () => {
    try {
      if (dialogAction === "hide") {
        await hideCourse(selectedCourseId);
        // حدث محلياً isHidden للكورس المختار لـ true
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === selectedCourseId
              ? { ...course, isHidden: true }
              : course
          )
        );
      } else if (dialogAction === "unhide") {
        await unhideCourse(selectedCourseId);
        // حدث محلياً isHidden للكورس المختار لـ false
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === selectedCourseId
              ? { ...course, isHidden: false }
              : course
          )
        );
      } else if (dialogAction === "delete") {
        await deleteCourse(selectedCourseId);
        // حذف الكورس من الحالة محلياً
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course._id !== selectedCourseId)
        );
      }

      setOpenDialog(false);
      setAnchorEl(null);
      setSelectedCourseId(null);
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const handleMenuOpen = (event, courseId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourseId(courseId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <CircularProgress size={80} sx={{ mb: 2, color: "black" }} />
        <Typography variant="h5">Loading Courses...</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={enhancedBlackAndWhiteTheme}>
      <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="md">
          {/* Dashboard Header */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderBottom: "4px solid #000",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "150px",
                height: "150px",
                bgcolor: "#f5f5f5",
                transform: "rotate(45deg) translate(50%, -50%)",
                zIndex: 0,
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  position: "relative",
                  display: "inline-block",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: 0,
                    width: "40px",
                    height: "4px",
                    backgroundColor: "#000",
                  },
                }}
              >
                Company Dashboard
              </Typography>

              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: "80%" }}
              >
                Manage your Course postings and track applicant progress
              </Typography>

              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mt: 2 }}>
                {/* Total Courses */}
                <Box
                  sx={{
                    width: "fit-content",
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    border: "1px solid #e0e0e0",
                    bgcolor: "#fff",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                      borderColor: "#000",
                    },
                  }}
                >
                  <Avatar
                    sx={{ bgcolor: "#000", mr: 2, width: 40, height: 40 }}
                  >
                    <MenuBookIcon sx={{ fontSize: 24 }} />
                  </Avatar>

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {courses.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Courses
                    </Typography>
                  </Box>
                </Box>
                {/* Total Applicants */}
                <Box
                  sx={{
                    width: "fit-content",
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    border: "1px solid #e0e0e0",
                    bgcolor: "#fff",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                      borderColor: "#000",
                    },
                  }}
                >
                  <Avatar
                    sx={{ bgcolor: "#000", mr: 2, width: 40, height: 40 }}
                  >
                    <PeopleIcon sx={{ fontSize: 24 }} />
                  </Avatar>

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {courses.reduce(
                        (total, course) => total + course.students.length,
                        0
                      )}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Total Applicants
                    </Typography>
                  </Box>
                </Box>
                {/* Active Courses (غير مخفية فقط) */}
                <Box
                  sx={{
                    width: "fit-content",
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    border: "1px solid #e0e0e0",
                    bgcolor: "#fff",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                      borderColor: "#000",
                    },
                  }}
                >
                  <Avatar
                    sx={{ bgcolor: "#000", mr: 2, width: 40, height: 40 }}
                  >
                    <DashboardIcon sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {courses.filter((course) => !course.isHidden).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Courses
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Course Management Section */}
          <Paper
            elevation={0}
            sx={{ p: 3, mb: 4, border: "1px solid #e0e0e0" }}
          >
            {/* Header Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Course Listings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {loading
                    ? "Loading..."
                    : `${courses.length} Course${
                        courses.length !== 1 ? "s" : ""
                      } posted`}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/post-course")}
                >
                  Add New Course
                </Button>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Course Cards Section */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : courses.length === 0 ? (
              <Box
                sx={{
                  py: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  bgcolor: "#fafafa",
                  border: "1px dashed #e0e0e0",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    bgcolor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <MenuBookIcon sx={{ fontSize: 40, color: "#9e9e9e" }} />
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  No Course posted yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, textAlign: "center", maxWidth: "400px" }}
                >
                  Create your first Course posting to start receiving
                  applications from qualified candidates
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/post-course")}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                  }}
                >
                  Post Your First Course
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {courses.map((course) => (
                  <Box
                    key={course._id}
                    sx={{ minWidth: "280px", display: "flex" }}
                  >
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                        width: "100%",
                        opacity: course.isHidden ? 0.5 : 1,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      {/* Card Header */}
                      <Box sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {course.courseTitle}
                          </Typography>
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, course._id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>

                        <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                          {/* Location */}
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LocationOnIcon
                              fontSize="small"
                              sx={{ mr: 0.5, color: "#000" }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {course.location || "Online"}
                            </Typography>
                          </Box>

                          {/* Applicants */}
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <PeopleIcon
                              fontSize="small"
                              sx={{ mr: 0.5, color: "#000" }}
                            />
                            <Badge
                              badgeContent={course.studentsEnrolled}
                              color="primary"
                              sx={{
                                "& .MuiBadge-badge": {
                                  right: -3,
                                  top: 8,
                                  border: "2px solid white",
                                  padding: "0 4px",
                                },
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mr: 2 }}
                              >
                                Applicants
                              </Typography>
                            </Badge>
                          </Box>
                        </Stack>

                        <Box
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        ></Box>
                      </Box>

                      <Divider sx={{ mx: 2 }} />

                      {/* Card Actions */}
                      <Box
                        sx={{
                          px: 2,
                          py: 1.5,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          Posted{" "}
                          {course.createdAt
                            ? new Date(course.createdAt).toLocaleDateString()
                            : "Recently"}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="Edit Course">
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() =>
                                navigate(`/EditCourses/${course._id}`)
                              }
                            >
                              Edit
                            </Button>
                          </Tooltip>
                          <Tooltip title="View applicants">
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() =>
                                navigate(`/courses/${course._id}/applicants`)
                              }
                            >
                              View Applicants
                            </Button>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                ))}
              </Box>
            )}

            {/* Menu Actions */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {(() => {
                const course = courses.find((c) => c._id === selectedCourseId);
                if (!course) return null;

                return [
                  <MenuItem
                    key="delete"
                    onClick={() => {
                      setDialogAction("delete");
                      setOpenDialog(true);
                      handleMenuClose();
                    }}
                    sx={{
                      color: "error.main",
                      "&:hover": {
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                      },
                    }}
                  >
                    Delete Course
                  </MenuItem>,
                  <MenuItem
                    key="hide-unhide"
                    onClick={() => {
                      setDialogAction(course.isHidden ? "unhide" : "hide");
                      setOpenDialog(true);
                      handleMenuClose();
                    }}
                    sx={{
                      color: course.isHidden ? "#10B981" : "#F59E0B",
                      "&:hover": {
                        backgroundColor: course.isHidden
                          ? "#E7F8F2"
                          : "#FEF5E6",
                      },
                    }}
                  >
                    {course.isHidden ? "Unhide Course" : "Hide Course"}
                  </MenuItem>,
                ];
              })()}
            </Menu>

            {/* Confirm Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to{" "}
                  {dialogAction === "hide"
                    ? "hide"
                    : dialogAction === "unhide"
                    ? "unhide"
                    : "delete"}{" "}
                  this course?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button color="primary" onClick={handleDialogConfirm}>
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CompanyCourses;
