import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Typography,
  Box,
  Container,
  CircularProgress,
  Grid,
  Divider,
  Chip,
  CardContent,
  CardActions,
  Paper,
  Stack,
  ThemeProvider,
  createTheme,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  Skeleton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import {
  getCompanyJob,
  hideJob,
  unhideJob,
  deleteJob,
} from "../../API/jobsAPI";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import enhancedBlackAndWhiteTheme from "../../assets/enhancedBlackAndWhiteTheme";

function CompanyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await getCompanyJob(userId);
        setJobs(response.data);
      } catch (error) {
        console.error("Error in fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [userId]);

  const totalJobs = jobs.length;
  const totalApplicants = jobs.reduce(
    (sum, job) => sum + job.applicants.length,
    0
  );
  const activeJobs = jobs.filter((job) => !job.isHidden).length;

  const selectedJob = jobs.find((job) => job._id === selectedJobId);
  const isHidden = selectedJob?.isHidden;

  const handleOpen = (event, jobId) => {
    setAnchorEl(event.currentTarget);
    setSelectedJobId(jobId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedJobId(null);
  };

  const handleDelete = async () => {
    handleClose();
    if (selectedJobId) {
      try {
        await deleteJob(selectedJobId);
        setJobs((prevJobs) =>
          prevJobs.filter((job) => job._id !== selectedJobId)
        );
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  const handleVisible = async (jobId, currentState) => {
    try {
      const res = currentState ? await unhideJob(jobId) : await hideJob(jobId);
      if (res.status === 200) {
        setJobs((prev) =>
          prev.map((job) =>
            job._id === jobId ? { ...job, isHidden: !currentState } : job
          )
        );
      }
      handleClose();
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const handleOpenConfirm = (action) => {
    setActionToConfirm(action);
    setOpenConfirm(true);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setActionToConfirm(null);
  };

  const handleConfirmAction = () => {
    if (actionToConfirm === "delete") {
      handleDelete();
    } else if (actionToConfirm === "toggleVisibility") {
      handleVisible(selectedJobId, isHidden);
    }
    handleCloseConfirm();
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
        <Typography variant="h5">Loading jobs...</Typography>{" "}
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
                Manage your job postings and track applicant progress
              </Typography>

              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mt: 2 }}>
                {/* Total Jobs */}
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
                    <BusinessIcon sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {totalJobs}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Jobs
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
                      {totalApplicants}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Applicants
                    </Typography>
                  </Box>
                </Box>

                {/* Active Jobs */}
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
                      {activeJobs}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Jobs
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Job Management Section */}
          <Paper
            elevation={0}
            sx={{ p: 3, mb: 4, border: "1px solid #e0e0e0" }}
          >
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
                  Job Listings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {loading ? (
                    <Skeleton width={150} />
                  ) : (
                    `${jobs.length} job${jobs.length !== 1 ? "s" : ""} posted`
                  )}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                {/* <Button
                  variant="outlined"
                  startIcon={<SearchIcon />}
                  size="small"
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  size="small"
                >
                  Filter
                </Button>
                 */}
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/post-job")}
                >
                  Add New Job
                </Button>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {loading ? (
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
                <Box sx={{ mt: 3 }}>
                  {[1, 2, 3].map((item) => (
                    <Box
                      key={item}
                      sx={{ mb: 3, p: 2, border: "1px solid #e0e0e0" }}
                    >
                      <Skeleton variant="text" width="60%" height={32} />
                      <Box sx={{ display: "flex", gap: 4, mt: 1, mb: 2 }}>
                        <Skeleton variant="text" width="20%" />
                        <Skeleton variant="text" width="20%" />
                      </Box>
                      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <Skeleton
                          variant="rectangular"
                          width={60}
                          height={24}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={60}
                          height={24}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={60}
                          height={24}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : jobs.length === 0 ? (
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
                  <BusinessIcon sx={{ fontSize: 40, color: "#9e9e9e" }} />
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  No jobs posted yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, textAlign: "center", maxWidth: "400px" }}
                >
                  Create your first job posting to start receiving applications
                  from qualified candidates
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/post-job")}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                  }}
                >
                  Post Your First Job
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {jobs.map((job) => (
                  <Grid columns={12} key={job._id}>
                    <Card
                      sx={{
                        opacity: job.isHidden ? 0.5 : 1,
                        backgroundColor: job.isHidden ? "#f5f5f5" : "white",
                      }}
                    >
                      <CardContent sx={{ pb: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              gutterBottom
                            >
                              {job.jobTitle}
                            </Typography>
                            <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <LocationIcon
                                  fontSize="small"
                                  sx={{ mr: 0.5, color: "#000" }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {job.location}
                                </Typography>
                              </Box>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <PeopleIcon
                                  fontSize="small"
                                  sx={{ mr: 0.5, color: "#000" }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  component="span"
                                >
                                  <Badge
                                    badgeContent={job.applicants.length}
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
                                      component="span"
                                      sx={{ mr: 2 }}
                                    >
                                      Applicants
                                    </Typography>
                                  </Badge>
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                          <Box>
                            <Tooltip title="More options">
                              <IconButton
                                size="small"
                                onClick={(e) => handleOpen(e, job._id)}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleClose}
                              sx={{
                                "& .MuiPaper-root": {
                                  boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
                                  minWidth: 100,
                                  borderRadius: 1,
                                },
                              }}
                              MenuListProps={{ sx: { p: 0 } }}
                            >
                              <MenuItem
                                onClick={() => handleOpenConfirm("delete")}
                                sx={{
                                  color: "error.main",
                                  fontSize: "0.875rem",
                                  py: 0.75,
                                  px: 2,
                                  "&:hover": {
                                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                                  },
                                }}
                              >
                                Delete
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleOpenConfirm("toggleVisibility")
                                }
                                sx={{
                                  color: isHidden ? "green" : "orange",
                                  fontSize: "0.875rem",
                                  py: 0.75,
                                  px: 2,
                                  "&:hover": {
                                    backgroundColor: isHidden
                                      ? "rgba(0, 128, 0, 0.1)"
                                      : "rgba(255, 168, 0, 0.1)",
                                  },
                                }}
                              >
                                {isHidden ? "Unhide" : "Hide"}
                              </MenuItem>
                            </Menu>

                            {/* Dialog */}
                            <Dialog
                              open={openConfirm}
                              onClose={handleCloseConfirm}
                              aria-labelledby="confirm-dialog-title"
                              aria-describedby="confirm-dialog-description"
                              BackdropProps={{
                                style: {
                                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                                },
                              }}
                            >
                              <DialogTitle id="confirm-dialog-title">
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  {actionToConfirm === "delete" ? (
                                    <DeleteIcon
                                      color="error"
                                      sx={{
                                        fontSize: 45,
                                        bgcolor: "#fee2e2",
                                        borderRadius: "50%",
                                        p: 1,
                                      }}
                                    />
                                  ) : actionToConfirm === "toggleVisibility" &&
                                    isHidden ? (
                                    <VisibilityIcon
                                      sx={{
                                        fontSize: 45,
                                        color: "#10B981",
                                        bgcolor: "rgba(255, 0, 0, 0.1)",
                                        borderRadius: "50%",
                                        p: 1,
                                      }}
                                    />
                                  ) : (
                                    <VisibilityOffIcon
                                      sx={{
                                        fontSize: 45,
                                        color: "#F59E0B",
                                        bgcolor: "#FEF5E6",
                                        borderRadius: "50%",
                                        p: 1,
                                      }}
                                    />
                                  )}

                                  {actionToConfirm === "delete"
                                    ? "Confirm Deletion"
                                    : isHidden
                                    ? "Confirm Unhide"
                                    : "Confirm Hide"}
                                </Box>
                              </DialogTitle>

                              <DialogContent
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  textAlign: "center",
                                }}
                              >
                                <DialogContentText id="confirm-dialog-description">
                                  {actionToConfirm === "delete" ? (
                                    <>
                                      Are you sure you want to delete this job?
                                      <br />
                                      This action cannot be undone.
                                    </>
                                  ) : isHidden ? (
                                    "Are you sure you want to make this job visible?"
                                  ) : (
                                    "Are you sure you want to hide this job?"
                                  )}
                                </DialogContentText>
                              </DialogContent>

                              <DialogActions
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: 2,
                                }}
                              >
                                <Button
                                  onClick={handleCloseConfirm}
                                  color="primary"
                                  sx={{
                                    bgcolor: "white",
                                    color: "text.secondary",
                                    "&:hover": {
                                      bgcolor: "rgba(0, 0, 0, 0.05)",
                                    },
                                    fontFamily: "Geist",
                                    fontWeight: 500,
                                    border: "1px solid #e0e0e0",
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleConfirmAction}
                                  variant="contained"
                                  autoFocus
                                  sx={{
                                    bgcolor:
                                      actionToConfirm === "delete"
                                        ? "error.main"
                                        : isHidden
                                        ? "green"
                                        : "orange",
                                    color: "white",
                                    "&:hover": {
                                      bgcolor:
                                        actionToConfirm === "delete"
                                          ? "error.dark"
                                          : isHidden
                                          ? "darkgreen"
                                          : "darkorange",
                                    },
                                  }}
                                >
                                  Yes
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </Box>
                        </Box>

                        {job.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              maxHeight: "60px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {job.description.length > 150
                              ? `${job.description.substring(0, 150)}...`
                              : job.description}
                          </Typography>
                        )}

                        {job.skills && job.skills.length > 0 && (
                          <Box
                            sx={{
                              mt: 2,
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                            }}
                          >
                            {job.skills.map((skill, index) => (
                              <Chip
                                key={index}
                                label={skill}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: "#e0e0e0",
                                  "&:hover": {
                                    borderColor: "#000",
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </CardContent>

                      <Divider sx={{ mx: 2 }} />

                      <CardActions
                        sx={{
                          px: 2,
                          py: 1.5,
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Posted{" "}
                            {job.createdAt
                              ? new Date(job.createdAt).toLocaleDateString()
                              : "Recently"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="Edit job">
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => navigate(`/jobs/${job._id}/edit`)}
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
                                navigate(`/jobs/${job._id}/applicants`)
                              }
                            >
                              View Applicants
                            </Button>
                          </Tooltip>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default CompanyJobs;
