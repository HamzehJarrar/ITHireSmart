import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTrainingById, enrollTraining } from "../../API/trainingAPI";
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
  CalendarMonth,
  CheckCircle,
  Assignment,
} from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ChairIcon from "@mui/icons-material/Chair";

function TrainingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [training, setTraining] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEnroll = async () => {
    try {
      await enrollTraining(id);
      setSnackbar({
        open: true,
        message: "Enrolled Successfully",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/Trainings");
      }, 1500);
      
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.msg || "You are already enrolled";
      setSnackbar({ open: true, message: msg, severity: "error" });
      setTimeout(() => {
        navigate("/Trainings");
      }, 2000);
    }
  };

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const response = await getTrainingById(id);
        setTraining(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching training:", error);
      }
    };

    fetchTraining();
  }, [id]);

  if (!training) {
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
          Loading training details...
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
            Back to Trainings
          </Button>
        </Box>

        {/* Training Header Card */}
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
            {/* Provider and Training Title */}
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
                  src={training.user?.profilepic?.url}
                  alt="Company Logo"
                  style={{
                    width: "48px",
                    height: "48px",
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
                  {training.trainingTitle}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#666666",
                    fontWeight: 500,
                    mb: 2,
                  }}
                >
                  {training.user?.firstName + " " + training.user?.lastName}
                </Typography>
              </Box>
            </Box>

            {/* Training Info Grid */}
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
              <InfoItem icon={<CalendarMonth />} label="Start Date">
                {training.startAt
                  ? new Date(training.startAt).toLocaleDateString()
                  : "TBA"}
              </InfoItem>
              <InfoItem icon={<CalendarMonth />} label="End Date">
                {training.endAt
                  ? new Date(training.endAt).toLocaleDateString()
                  : "TBA"}
              </InfoItem>

              <InfoItem icon={<Work />} label="Duration">
                {training.Duration || "N/A"}
              </InfoItem>
              <InfoItem icon={<ChairIcon />} label="Capacity">
                {training.capacity || "N/A"}
              </InfoItem>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Training Description */}
            <SectionCard
              title="Training Description"
              icon={<Work sx={{ color: "#666666" }} />}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#333333",
                  lineHeight: 1.7,
                  fontSize: "1rem",
                }}
              >
                {training.trainingDescription}
              </Typography>
            </SectionCard>

            {/* Topics */}
            <SectionCard
              title="Topics Covered"
              icon={<Assignment sx={{ color: "#666666" }} />}
            >
              <Stack spacing={1.5} direction="row" flexWrap="wrap" gap={1}>
                {training.topicsCovered?.slice(0, 15).map((topic, idx) => (
                  <Chip
                    key={idx}
                    label={topic}
                    variant="outlined"
                    sx={{
                      borderColor: "#000000",
                      color: "#000000",
                      fontWeight: 500,
                      cursor: "default",
                    }}
                  />
                ))}
              </Stack>
            </SectionCard>

            {/* Requirements */}
            <SectionCard
              title="Requirements"
              icon={<CheckCircle sx={{ color: "#666666" }} />}
            >
              {training.Requirements?.length ? (
                <ul>
                  {training.Requirements.map((req, idx) => (
                    <li key={idx}>
                      <Typography variant="body2" sx={{ color: "#555555" }}>
                        {req}
                      </Typography>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ color: "#777777", fontStyle: "italic" }}
                >
                  No specific requirements.
                </Typography>
              )}
            </SectionCard>

            {/* Enroll Button */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleEnroll}
                sx={{
                  bgcolor: "#000000",
                  color: "#ffffff",
                  px: 6,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: "1rem",
                  "&:hover": {
                    bgcolor: "#333333",
                  },
                }}
              >
                Enroll Now
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TrainingDetails;
