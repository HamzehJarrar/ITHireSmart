import { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
  Container,
  Divider,
  Stack,
} from "@mui/material";
import {
  Work as WorkIcon,
  School as SchoolIcon,
  MenuBook as CourseIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  getJobApplications,
  getTrainingApplications,
  getCourseApplications,
} from "../../API/API";

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "approved":
    case "accepted":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
    case "declined":
      return "error";
    default:
      return "default";
  }
};

const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: 8,
      color: "text.secondary",
    }}
  >
    <Icon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2">{subtitle}</Typography>
  </Box>
);

const ApplicationsPage = () => {
  const [value, setValue] = useState(0);
  const [jobApplications, setJobApplications] = useState([]);
  const [trainingApplications, setTrainingApplications] = useState([]);
  const [courseApplications, setCourseApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (value === 0) {
          const { data } = await getTrainingApplications();
          setTrainingApplications(data);
        } else if (value === 1) {
          const { data } = await getCourseApplications();
          setCourseApplications(data);
        } else if (value === 2) {
          const { data } = await getJobApplications();
          setJobApplications(data);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [value]);

  const renderJobApplications = (applications) =>
    applications.length === 0 ? (
      <EmptyState
        icon={WorkIcon}
        title="No Job Applications"
        subtitle="You haven't applied to any jobs yet."
      />
    ) : (
      <Grid container spacing={3}>
        {applications.map((app, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card
              sx={{
                height: "100%",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <WorkIcon color="primary" sx={{ mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {app.jobTitle}
                      </Typography>
                      <Chip
                        label={app.status}
                        color={getStatusColor(app.status)}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Applied: {formatDate(app.appliedAt)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );

  const renderTrainingApplications = (applications) =>
    applications.length === 0 ? (
      <EmptyState
        icon={SchoolIcon}
        title="No Training Applications"
        subtitle="You haven't applied to any training programs yet."
      />
    ) : (
      <Grid container spacing={3}>
        {applications.map((app, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              sx={{
                height: "100%",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <SchoolIcon color="primary" sx={{ mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {app.trainingTitle}
                      </Typography>
                      <Chip
                        label={app.status}
                        color={getStatusColor(app.status)}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    </Box>
                  </Box>
                  <Divider />
                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {app.companyName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {app.location} • {app.trainingType}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(app.startAt)} - {formatDate(app.endAt)}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );

  const renderCourseApplications = (applications) =>
    applications.length === 0 ? (
      <EmptyState
        icon={CourseIcon}
        title="No Course Applications"
        subtitle="You haven't applied to any courses yet."
      />
    ) : (
      <Grid container spacing={3}>
        {applications.map((app, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              sx={{
                height: "100%",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <CourseIcon color="primary" sx={{ mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {app.courseTitle}
                      </Typography>
                      <Chip
                        label={app.status}
                        color={getStatusColor(app.status)}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    </Box>
                  </Box>
                  <Divider />
                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {app.instructorName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {app.location} • {app.courseType}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(app.startAt)} - {formatDate(app.endAt)}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Applications Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage all your applications in one place
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
            },
          }}
        >
          <Tab
            icon={<SchoolIcon />}
            iconPosition="start"
            label="Training Applications"
          />
          <Tab
            icon={<CourseIcon />}
            iconPosition="start"
            label="Course Applications"
          />
          <Tab
            icon={<WorkIcon />}
            iconPosition="start"
            label="Job Applications"
          />
        </Tabs>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 300,
          }}
        >
          <CircularProgress size={48} />
        </Box>
      ) : (
        <>
          <TabPanel value={value} index={0}>
            {renderTrainingApplications(trainingApplications)}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {renderCourseApplications(courseApplications)}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {renderJobApplications(jobApplications)}
          </TabPanel>
        </>
      )}
    </Container>
  );
};

export default ApplicationsPage;
