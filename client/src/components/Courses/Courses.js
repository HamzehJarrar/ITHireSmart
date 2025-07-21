import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  Chip,
  Button,
  Skeleton,
  Alert,
  Pagination,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Bolt as BoltIcon } from "@mui/icons-material";
import { getCourses, getRecommendedcourses } from "../../API/courseAPI";
import AddIcon from "@mui/icons-material/Add";

const COURSES_PER_PAGE = 6;

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  /* ───────────────────────────── Fetch All Courses ─────────────────────────── */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await getCourses();
        setCourses(res.data);
        setError("");
      } catch {
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  /* ──────────────────────── AI Recommendation Handler ─────────────────────── */
  const fetchRecommendedCourses = async () => {
    try {
      setLoading(true);
      const res = await getRecommendedcourses(); // [{ id,title,match_score,justification }]
      setRecommendedCourses(res.data);
      localStorage.setItem("recommendedCourses", JSON.stringify(res.data));
      setDrawerOpen(true);
    } catch (err) {
      console.error("Error fetching recommended courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedRecommendations = () => {
    const saved = localStorage.getItem("recommendedCourses");
    if (saved) {
      setRecommendedCourses(JSON.parse(saved));
      setDrawerOpen(true);
    } else {
      alert("No saved recommendations found.");
    }
  };

  const clearSavedRecommendations = () => {
    localStorage.removeItem("recommendedCourses");
    setRecommendedCourses([]);
    setDrawerOpen(false);
  };

  /* ───────────────────────────── Pagination Logic ──────────────────────────── */
  const totalPages = Math.ceil(courses.length / COURSES_PER_PAGE);
  const paginatedCourses = courses.slice(
    (page - 1) * COURSES_PER_PAGE,
    page * COURSES_PER_PAGE
  );

  const handlePageChange = (_e, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ────────────────────────────────── UI ───────────────────────────────────── */
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 5 }, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Discover Our Curated Courses
        </Typography>
        <Typography color="#666" sx={{ maxWidth: 600, mx: "auto" }}>
          Hand‑picked learning opportunities to boost your career and skills.
          Explore our top picks and start your journey today!
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: { xs: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#F5F5F5",
              px: 2,
              py: 0.8,
              borderRadius: "20px",
              border: "1px solid #BBB",
            }}
          >
            <BoltIcon sx={{ fontSize: 21, color: "#F3C623" }} />
            <Typography
              component="span"
              sx={{ ml: 0.5, fontSize: 18, fontWeight: 500 }}
            >
              {courses.length}
            </Typography>
            <Typography
              component="span"
              sx={{ ml: 1, fontSize: 20, fontWeight: 500 }}
            >
              Courses Available
            </Typography>
          </Box>

          {userRole === "user" && (
            <>
              <Button variant="contained" onClick={fetchRecommendedCourses}>
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
            </>
          )}
        </Box>

        {userRole === "company" && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/post-course")}
            sx={{ background: "black", "&:hover": { bgcolor: "black" } }}
          >
            Post a Course
          </Button>
        )}
      </Box>

      {/* Courses Grid */}
      {loading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,1fr)",
              md: "repeat(3,1fr)",
            },
            gap: 2,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={320}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : courses.length === 0 ? (
        <Typography align="center" color="#666">
          No courses found at the moment. Please check back later!
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,1fr)",
              md: "repeat(3,1fr)",
            },
            gap: 2,
          }}
        >
          {paginatedCourses.map((c) => (
            <Card
              key={c._id}
              sx={{
                borderRadius: 2,
                border: "2px solid #ECECEC",
                transition: "transform .2s",
                "&:hover": { transform: "translateY(-3px)", boxShadow: 4 },
              }}
            >
              <Box
                sx={{
                  background: "#F8F8F8",
                  p: 2,
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1.2,
                    }}
                  >
                    <img
                      src={
                        c.company?.profilepic ||
                        "https://cdn-icons-png.flaticon.com/512/1055/1055687.png"
                      }
                      alt={courses.company?.companyName || "Company Logo"}
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "12px",
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {c.companyName || "Unknown Company"}
                    </Typography>
                    <Typography variant="body2" color="#888">
                      {c.location || "Online"}
                    </Typography>
                  </Box>
                </Stack>
                <Typography
                  variant="h6"
                  sx={{ mt: 1, textTransform: "capitalize" }}
                >
                  {c.courseTitle}
                </Typography>
                <Stack direction="row" spacing={0.8} flexWrap="wrap" mt={1}>
                  {c.topics?.slice(0, 3).map((t) => (
                    <Chip key={t} label={t} size="small" />
                  ))}
                </Stack>
              </Box>
              <Box sx={{ p: 2, mt: "auto" }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(`/course/${c._id}`)}
                  sx={{
                    bgcolor: "#000000",
                    color: "#FFFFFF",
                    "&:hover": {
                      bgcolor: "#333333",
                    },
                  }}
                >
                  View Details
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
        />
      </Box>

      {/* Drawer – Recommended */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ width: 360, "& .MuiDrawer-paper": { width: 360, p: 2 } }}
      >
        <Typography variant="h6" gutterBottom>
          Top 5 Recommended Courses
        </Typography>

        {recommendedCourses.length === 0 ? (
          <Typography>No recommendations found.</Typography>
        ) : (
          <List>
            {recommendedCourses.map((rec, i) => (
              <ListItem key={i} divider alignItems="flex-start">
                <ListItemText
                  primary={
                    <Typography component="span" fontWeight="bold">
                      {rec.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        Match Score: {rec.match_score ?? "N/A"}
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {rec.justification}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Drawer>
    </Container>
  );
}

export default Courses;
