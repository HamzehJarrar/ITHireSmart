import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ViewApplicants } from "../../API/jobsAPI";
import { GetRecommendedApplicants } from "../../API/API";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Container,
  CardHeader,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Mail } from "@mui/icons-material";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const drawerWidth = 360;

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedRecommended = localStorage.getItem("recommendedApplicants");
    if (savedRecommended) {
      try {
        setRecommended(JSON.parse(savedRecommended));

      } catch {
        localStorage.removeItem("recommendedApplicants");
      }
    }
  }, []);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const res = await ViewApplicants(jobId);
        setApplicants(res.data);
        console.log("Fetched applicants:", res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await GetRecommendedApplicants(jobId);
      setRecommended(res.data);
      localStorage.setItem("recommendedApplicants", JSON.stringify(res.data));
      setDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedRecommendations = () => {
    const saved = localStorage.getItem("recommendedApplicants");
    if (saved) {
      setRecommended(JSON.parse(saved));
      setDrawerOpen(true);
    } else {
      alert("No saved recommendations found.");
    }
  };

  const clearSavedRecommendations = () => {
    localStorage.removeItem("recommendedApplicants");
    setRecommended([]);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            mb: 3,
            borderBottom: "2px solid #f0f0f0",
            pb: 2,
          }}
        >
          Applicants
          <Chip
            label={`${applicants.length} total`}
            size="small"
            sx={{ ml: 2, bgcolor: "#e3f2fd" }}
          />
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            size="medium"
            startIcon={<ArrowBackIosNewIcon />}
            sx={{
              bgcolor: "black",
              textTransform: "none",
              borderRadius: 2,
              boxShadow: 2,
              px: 3,
              color: "white",
            }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>

          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
            onClick={fetchRecommendations}
          >
            AI Recommend Top 5
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
            onClick={loadSavedRecommendations}
          >
            Show Saved Recommendations
          </Button>

          <Button
            variant="outlined"
            color="error"
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
            onClick={clearSavedRecommendations}
          >
            Clear Saved Recommendations
          </Button>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : applicants.length === 0 ? (
          <Card
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "#f5f5f5",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No applicants found for this position yet.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Check back later or modify your job posting to attract more
              candidates.
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {applicants.map((applicant) => {
              const user = applicant.user;
              const name =
                user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.firstName
                  ? user.firstName
                  : "Unknown Applicant";
              const email = user?.email || "No email provided";
              const profilePic = user?.profilepic?.url;
              const appliedDateObj = new Date(applicant.appliedAt);
              const appliedDate =
                appliedDateObj.toLocaleDateString() +
                " " +
                appliedDateObj.toLocaleTimeString();

              return (
                <Box key={applicant._id}>
                  <Card
                    sx={{
                      height: "100%",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar
                          alt={`${name} Avatar`}
                          src={profilePic}
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: "#e3f2fd",
                            color: "#1976d2",
                          }}
                        >
                          {!profilePic && user?.firstName?.[0]}
                        </Avatar>
                      }
                      title={
                        <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                          {name}
                        </Typography>
                      }
                      subheader={`Applied on ${appliedDate}`}
                    />

                    <Divider />
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Mail
                          fontSize="small"
                          sx={{ color: "text.secondary", mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {email}
                        </Typography>
                      </Box>

                      {user && (
                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                          <Chip
                            size="small"
                            label="Information"
                            icon={<NewspaperIcon fontSize="small" />}
                            variant="outlined"
                            clickable
                            sx={{ p: 1 }}
                            onClick={() => navigate(`/user/${user._id}`)}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Box>
        )}
      </Container>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            p: 2,
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Top 5 Recommended Applicants
        </Typography>
        {recommended.length === 0 ? (
          <Typography>No recommendations found.</Typography>
        ) : (
<List>
  {recommended.map((rec, index) => {
    return (
      <ListItem key={index} alignItems="flex-start" divider>
        <ListItemText
          primary={rec.name || "Unknown"}
          secondary={rec.justification || ""}
        />
      </ListItem>
    );
  })}
</List>
        )}
      </Drawer>
    </Box>
  );
};

export default ApplicantsPage;
