import React, { useEffect, useState } from "react";
import {
  getCompanyTrainings,
  hideTraining,
  unhideTraining,
  deleteTraining,
} from "../../API/trainingAPI";
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
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

const CompanyTrainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [selectedTrainingId, setSelectedTrainingId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setLoading(true);
        const response = await getCompanyTrainings(userId);
        setTrainings(response.data);
      } catch (err) {
        console.error("Failed to fetch trainings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainings();
  }, [userId]);

  const handleDialogConfirm = async () => {
    try {
      if (dialogAction === "hide") {
        await hideTraining(selectedTrainingId);
        setTrainings((prev) =>
          prev.map((t) =>
            t._id === selectedTrainingId ? { ...t, isHidden: true } : t
          )
        );
      } else if (dialogAction === "unhide") {
        await unhideTraining(selectedTrainingId);
        setTrainings((prev) =>
          prev.map((t) =>
            t._id === selectedTrainingId ? { ...t, isHidden: false } : t
          )
        );
      } else if (dialogAction === "delete") {
        await deleteTraining(selectedTrainingId);
        setTrainings((prev) =>
          prev.filter((t) => t._id !== selectedTrainingId)
        );
      }
      setOpenDialog(false);
      setAnchorEl(null);
      setSelectedTrainingId(null);
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedTrainingId(id);
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
        }}
      >
        <CircularProgress size={80} sx={{ mb: 2, color: "black" }} />
        <Typography variant="h5">Loading Trainings...</Typography>
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
                sx={{ mb: 3 }}
              >
                Manage your Training postings and track applicant progress
              </Typography>

              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mt: 2 }}>
                {/* Total Trainings */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    border: "1px solid #e0e0e0",
                    bgcolor: "#fff",
                  }}
                >
                  <Avatar sx={{ bgcolor: "#000", mr: 2 }}>
                    <WorkIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{trainings.length}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Trainings
                    </Typography>
                  </Box>
                </Box>

                {/* Total Applicants */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    border: "1px solid #e0e0e0",
                    bgcolor: "#fff",
                  }}
                >
                  <Avatar sx={{ bgcolor: "#000", mr: 2 }}>
                    <PeopleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {trainings.reduce(
                        (total, t) => total + (t.enrolledUsers?.length || 0),
                        0
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Applicants
                    </Typography>
                  </Box>
                </Box>

                {/* Active Trainings */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    border: "1px solid #e0e0e0",
                    bgcolor: "#fff",
                  }}
                >
                  <Avatar sx={{ bgcolor: "#000", mr: 2 }}>
                    <DashboardIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {trainings.filter((t) => !t.isHidden).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Trainings
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Training Management Section */}
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
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Training Listings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {trainings.length} Training{trainings.length !== 1 && "s"}{" "}
                  posted
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/post-training")}
              >
                Add New Training
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Cards */}
            {trainings.length === 0 ? (
              <Box
                sx={{
                  py: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  bgcolor: "#fafafa",
                  border: "1px dashed #e0e0e0",
                }}
              >
                <WorkIcon sx={{ fontSize: 40, color: "#9e9e9e", mb: 2 }} />
                <Typography variant="h6" fontWeight="bold">
                  No Training posted yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, textAlign: "center", maxWidth: "400px" }}
                >
                  Create your first Training posting to start receiving
                  applications from qualified candidates
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/post-training")}
                >
                  Post Your First Training
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {trainings.map((training) => (
                  <Card
                    key={training._id}
                    sx={{
                      width: "360px",
                      opacity: training.isHidden ? 0.5 : 1,
                      transition: "opacity 0.3s ease",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          {training.trainingTitle}
                        </Typography>
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, training._id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>

                      <Stack direction="row" spacing={2} sx={{ my: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="body2">
                            {training.location || "Online"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" component="span">
                            <Badge
                              badgeContent={training.enrolledUsers?.length || 0}
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

                    <Divider />

                    <Box
                      sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Tooltip title="Edit Training">
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() =>
                            navigate(`/edit-training/${training._id}`)
                          }
                        >
                          Edit
                        </Button>
                      </Tooltip>
                      <Tooltip title="View Applicants">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() =>
                            navigate(`/training-applicants/${training._id}`)
                          }
                        >
                          View Applicants
                        </Button>
                      </Tooltip>
                    </Box>
                  </Card>
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
                const training = trainings.find(
                  (t) => t._id === selectedTrainingId
                );
                if (!training) return null;

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
                      "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)" },
                    }}
                  >
                    Delete Training
                  </MenuItem>,
                  <MenuItem
                    key="hide-unhide"
                    onClick={() => {
                      setDialogAction(training.isHidden ? "unhide" : "hide");
                      setOpenDialog(true);
                      handleMenuClose();
                    }}
                    sx={{
                      color: training.isHidden ? "#10B981" : "#F59E0B",
                      "&:hover": {
                        backgroundColor: training.isHidden
                          ? "#E7F8F2"
                          : "#FEF5E6",
                      },
                    }}
                  >
                    {training.isHidden ? "Unhide Training" : "Hide Training"}
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
                  this training?
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

export default CompanyTrainings;
