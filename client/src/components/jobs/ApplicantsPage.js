import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ViewApplicants,
  acceptApplicant,
  rejectApplicant,
  getAcceptedApplicants,
  getRejectedApplicants,
  setPendingApplicant,
} from "../../API/jobsAPI";
import { GetRecommendedApplicants } from "../../API/API";
import { orange } from "@mui/material/colors";
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
  TextField,
  InputAdornment,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import { Mail, Search } from "@mui/icons-material";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const drawerWidth = 360;

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [acceptedApplicants, setAcceptedApplicants] = useState([]);
  const [rejectedApplicants, setRejectedApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tabValue, setTabValue] = useState("pending");

  const navigate = useNavigate();

  const fetchAllApplicantsData = async () => {
    try {
      setLoading(true);
      const [pendingRes, acceptedRes, rejectedRes] = await Promise.all([
        ViewApplicants(jobId),
        getAcceptedApplicants(jobId),
        getRejectedApplicants(jobId),
      ]);
      setApplicants(pendingRes.data || []);
      setAcceptedApplicants(acceptedRes.data || []);
      setRejectedApplicants(rejectedRes.data || []);
    } catch (error) {
      console.log("Failed to fetch applicants data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllApplicantsData();
  }, [jobId]);

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

  const handleAccept = async (userId) => {
    try {
      await acceptApplicant(jobId, userId);
      fetchAllApplicantsData();
    } catch (error) {
      console.error("Failed to accept applicant:", error);
      alert("An error occurred while accepting the applicant.");
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectApplicant(jobId, userId);
      fetchAllApplicantsData();
    } catch (error) {
      console.error("Failed to reject applicant:", error);
      alert("An error occurred while rejecting the applicant.");
    }
  };

  const handlePending = async (userId) => {
    try {
      await setPendingApplicant(jobId, userId);
      fetchAllApplicantsData();
    } catch (error) {
      console.error("Failed to set applicant to pending:", error);
      alert("An error occurred while setting applicant to pending.");
    }
  };

  const filterUsers = (list, hasAppliedAt = false) => {
    const searchLower = search.toLowerCase();
    return list.filter((item) => {
      const user = hasAppliedAt ? item.user : item;
      if (!user) return false;
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`;
      return (
        fullName.toLowerCase().includes(searchLower) ||
        (user.email || "").toLowerCase().includes(searchLower)
      );
    });
  };

  const filteredPending = filterUsers(applicants, true);
  const filteredAccepted = filterUsers(acceptedApplicants);
  const filteredRejected = filterUsers(rejectedApplicants);

  let displayList = [];
  if (tabValue === "pending") {
    displayList = filteredPending;
  } else if (tabValue === "accepted") {
    displayList = filteredAccepted;
  } else if (tabValue === "rejected") {
    displayList = filteredRejected;
  }

  const renderApplicantCard = (item) => {
    const user = tabValue === "pending" ? item.user : item;
    const appliedAt = tabValue === "pending" ? item.appliedAt : null;

    if (!user) return null;

    const name =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      "Unknown Applicant";
    const email = user.email || "No email provided";
    const profilePic = user.profilepic?.url;
    const appliedDate = appliedAt ? new Date(appliedAt).toLocaleString() : "";

    return (
      <Card
        key={user._id}
        sx={{
          width: 320,
          display: "flex",
          flexDirection: "column",
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
              {!profilePic && name?.[0]}
            </Avatar>
          }
          title={
            <Typography variant="h6" sx={{ fontWeight: "medium" }}>
              {name}
            </Typography>
          }
          subheader={appliedDate ? `Applied on ${appliedDate}` : ""}
        />
        <Divider />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Mail fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
          </Box>
          <Chip
            size="small"
            label="View Profile"
            icon={<NewspaperIcon fontSize="small" />}
            variant="outlined"
            clickable
            sx={{ p: 1 }}
            onClick={() => navigate(`/user/${user._id}`)}
          />
        </CardContent>

        {tabValue === "pending" && (
          <Box
            sx={{
              p: 2,
              display: "flex",
              gap: 1,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={() => handleAccept(user._id)}
              sx={{ flex: 1 }}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleReject(user._id)}
              sx={{ flex: 1 }}
            >
              Reject
            </Button>
          </Box>
        )}
        {tabValue === "accepted" && (
          <Box
            sx={{
              p: 2,
              display: "flex",
              gap: 1,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Button
              variant="contained"
              onClick={() => handlePending(user._id)}
              sx={{
                flex: 1,
                backgroundColor: orange[500],
                color: "white",
                "&:hover": {
                  backgroundColor: orange[700],
                },
              }}
            >
              {" "}
              Pending
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleReject(user._id)}
              sx={{ flex: 1 }}
            >
              Reject
            </Button>
          </Box>
        )}
        {tabValue === "rejected" && (
          <Box
            sx={{
              p: 2,
              display: "flex",
              gap: 1,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={() => handleAccept(user._id)}
              sx={{ flex: 1 }}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              onClick={() => handlePending(user._id)}
              sx={{
                flex: 1,
                backgroundColor: orange[500],
                color: "white",
                "&:hover": {
                  backgroundColor: orange[700],
                },
              }}
            >
              {" "}
              Pending
            </Button>
          </Box>
        )}
      </Card>
    );
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
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Applicants
          <Chip
            label={`Pending: ${applicants.length}, Accepted: ${acceptedApplicants.length}, Rejected: ${rejectedApplicants.length}`}
            size="small"
            sx={{ ml: 2, bgcolor: "#e3f2fd" }}
          />
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
          mb={2}
        >
          <Button
            variant="contained"
            size="medium"
            startIcon={<ArrowBackIosNewIcon />}
            sx={{
              bgcolor: "black",
              textTransform: "none",
              borderRadius: 2,
              color: "white",
            }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchRecommendations}
          >
            AI Recommend Top 5
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={loadSavedRecommendations}
          >
            Show Saved
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={clearSavedRecommendations}
          >
            Clear Saved
          </Button>
        </Stack>

        <TextField
          fullWidth
          label="Search by Name or Email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3, bgcolor: "white" }}
        />

        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ mb: 3 }}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label={`Pending (${filteredPending.length})`} value="pending" />
          <Tab
            label={`Accepted (${filteredAccepted.length})`}
            value="accepted"
          />
          <Tab
            label={`Rejected (${filteredRejected.length})`}
            value="rejected"
          />
        </Tabs>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : displayList.length === 0 ? (
          <Card sx={{ p: 4, textAlign: "center", bgcolor: "#f5f5f5" }}>
            <Typography variant="h6" color="text.secondary">
              No applicants found.
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {displayList.map(renderApplicantCard)}
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
            {recommended.map((rec, index) => (
              <ListItem key={index} alignItems="flex-start" divider>
                <ListItemText
                  primary={
                    <>
                      {rec.name || "Unknown"} — Score:{" "}
                      {rec.match_score ?? "N/A"}%
                      {rec.Email && ` (${rec.Email})`}
                    </>
                  }
                  secondary={<>{rec.justification || ""}</>}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Drawer>
    </Box>
  );
};

export default ApplicantsPage;
