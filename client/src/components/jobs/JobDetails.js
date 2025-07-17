import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../../API/jobsAPI";
import {
  Card,
  CircularProgress,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  Snackbar,
  Alert,
  Container,
  Stack,
  Divider,
} from "@mui/material";
import {
  Work,
  LocationOn,
  AccessTime,
  MonetizationOn,
  CalendarMonth,
  Business,
  CheckCircle,
  Assignment,
} from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import { applyJob } from "../../API/jobsAPI";

function JobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleApply = async () => {
    try {
      await applyJob(id);
      setSnackbar({
        open: true,
        message: "Applied Successfully",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/FindJob");
      }, 1500);
    } catch (error) {
      console.log(error);
      const msg =
        error.response?.data?.msg || "you are already applied for this job";
      setSnackbar({ open: true, message: msg, severity: "error" });
      setTimeout(() => {
        navigate("/FindJob");
      }, 2000);
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getJobById(id);
        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };

    fetchJob();
  }, [id]);

  if (!job) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#ffffff",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#000000" }} />
        <Typography variant="h6" sx={{ mt: 2, color: "#666666" }}>
          Loading job details...
        </Typography>
      </Box>
    );
  }

  const InfoItem = ({ icon, children, label }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 0.5,
      }}
    >
      <Box sx={{ color: "#666666", minWidth: 24 }}>{icon}</Box>
      <Box>
        <Typography
          variant="body2"
          sx={{ color: "#888888", fontSize: "0.75rem" }}
        >
          {label}
        </Typography>
        <Typography variant="body1" sx={{ color: "#000000", fontWeight: 500 }}>
          {children}
        </Typography>
      </Box>
    </Box>
  );

  const SectionCard = ({ title, icon, children }) => (
    <Card
      sx={{
        bgcolor: "#ffffff",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        mb: 3,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          height: "100%",
          bgcolor: "#000000",
          borderRadius: "2px 0 0 2px",
        },
      }}
      elevation={1}
    >
      <Box sx={{ p: 3, pl: 4 }}>
        <Typography
          variant="h6"
          sx={{
            color: "#000000",
            fontWeight: 600,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {icon}
          {title}
        </Typography>
        {children}
      </Box>
    </Card>
  );

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Navigation */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIosNewIcon />}
            onClick={() => navigate(-1)}
            sx={{
              color: "#000000",
              borderColor: "#e0e0e0",
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 500,
              "&:hover": {
                borderColor: "#000000",
                bgcolor: "#f5f5f5",
              },
            }}
          >
            Back to Jobs
          </Button>
        </Box>

        {/* Job Header Card */}
        <Card
          sx={{
            bgcolor: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: 3,
            mb: 3,
            position: "relative",
            overflow: "hidden",
          }}
          elevation={2}
        >
          {/* Black accent bar */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              bgcolor: "#000000",
            }}
          />

          <Box sx={{ p: 4, pt: 5 }}>
            {/* Company and Job Title */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 3,
                alignItems: { xs: "center", sm: "flex-start" },
                textAlign: { xs: "center", sm: "left" },
                mb: 4,
              }}
            >
              <Box sx={{ mr: 1 }}>
                <img
                  src={job.user?.profilepic?.url}
                  alt="Company Logo"
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    fontFamily: "Geist",
                  }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#000000",
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: "1.75rem", sm: "2.125rem" },
                  }}
                >
                  {job.jobTitle}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#666666",
                    fontWeight: 500,
                    mb: 2,
                  }}
                >
                  {job.companyName}
                </Typography>

                {/* Job Tags */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <Chip
                    label={job.jobType}
                    sx={{
                      bgcolor: "#f5f5f5",
                      color: "#000000",
                      border: "1px solid #e0e0e0",
                      fontWeight: 500,
                      "&:hover": {
                        bgcolor: "#000000",
                        color: "#ffffff",
                      },
                    }}
                  />
                  <Chip
                    label={job.workType}
                    sx={{
                      bgcolor: "#f5f5f5",
                      color: "#000000",
                      border: "1px solid #e0e0e0",
                      fontWeight: 500,
                      "&:hover": {
                        bgcolor: "#000000",
                        color: "#ffffff",
                      },
                    }}
                  />
                  <Chip
                    label={job.experienceLevel}
                    sx={{
                      bgcolor: "#f5f5f5",
                      color: "#000000",
                      border: "1px solid #e0e0e0",
                      fontWeight: 500,
                      "&:hover": {
                        bgcolor: "#000000",
                        color: "#ffffff",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Job Details Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 3,
                mb: 3,
              }}
            >
              <InfoItem icon={<LocationOn />} label="Location">
                {job.location || "California, CA"}
              </InfoItem>
              <InfoItem icon={<AccessTime />} label="Job Type">
                {job.jobType || "Full-time"}
              </InfoItem>
              <InfoItem icon={<Work />} label="Experience">
                {job.experienceLevel || "Senior (5+ years)"}
              </InfoItem>
              <InfoItem icon={<MonetizationOn />} label="Salary">
                {job.salary ? `$${job.salary}` : "$2.5k"}/
                {job.salaryPeriod || "month"}
              </InfoItem>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Posted Date && expiration date */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarMonth sx={{ color: "#666666", fontSize: "1.25rem" }} />
              <Typography variant="body2" sx={{ color: "#666666" }}>
                Posted:{" "}
                {job.date
                  ? new Date(job.date).toLocaleDateString()
                  : "Recently"}
              </Typography>

              <Typography variant="body2" sx={{ color: "#666666", mx: 1 }}>
                |
              </Typography>

              <CalendarMonth sx={{ color: "#666666", fontSize: "1.25rem" }} />
              <Typography variant="body2" sx={{ color: "#666666" }}>
                To: {job.to ? new Date(job.to).toLocaleDateString() : "N/A"}
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Job Description */}
        <SectionCard
          title="Job Description"
          icon={<Business sx={{ color: "#666666" }} />}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#333333",
              lineHeight: 1.7,
              fontSize: "1rem",
            }}
          >
            {job.jobDescription}
          </Typography>
        </SectionCard>

        {/* Requirements */}
        <SectionCard
          title="Requirements"
          icon={<CheckCircle sx={{ color: "#666666" }} />}
        >
          <Stack spacing={1.5}>
            {job.Requirements.map((item, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: "#000000",
                    borderRadius: "50%",
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    color: "#333333",
                    lineHeight: 1.6,
                  }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </Stack>
        </SectionCard>

        {/* Responsibilities */}
        <SectionCard
          title="Responsibilities"
          icon={<Assignment sx={{ color: "#666666" }} />}
        >
          <Stack spacing={1.5}>
            {job.Responsibilities.map((item, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: "#000000",
                    borderRadius: "50%",
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    color: "#333333",
                    lineHeight: 1.6,
                  }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </Stack>
        </SectionCard>

        {/* Apply Button */}
        <Card
          sx={{
            bgcolor: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            position: "sticky",
            bottom: 20,
            zIndex: 10,
          }}
          elevation={3}
        >
          <Box sx={{ p: 3 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleApply}
              sx={{
                bgcolor: "#000000",
                color: "#ffffff",
                borderRadius: 2,
                fontWeight: 600,
                fontSize: "1.1rem",
                py: 1.5,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#333333",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Apply for this Position
            </Button>
          </Box>
        </Card>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default JobDetails;
