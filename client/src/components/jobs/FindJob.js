import React, { useEffect, useState } from "react";
import {
  Card,
  CircularProgress,
  Button,
  Typography,
  Box,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Pagination,
  Divider,
  FormGroup,
} from "@mui/material";
import { getJobs, searchJobByKeyword } from "../../API/jobsAPI";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import BoltIcon from "@mui/icons-material/Bolt";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkIcon from "@mui/icons-material/Work";
import AddIcon from "@mui/icons-material/Add";
function FindJob() {
  const getRandomLightColor = (idx) => {
    const colors = ["#EFF5F5"];
    return colors[idx % colors.length];
  };

  const [errorOpen, setErrorOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const jobsPerPage = 6;
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    experienceLevel: "",
    workTypes: [],
    jobTypes: [],
  });
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [userRole, setRole] = useState("");
  const fetchJobs = async () => {
    try {
      const response = await getJobs();
      const userRole = localStorage.getItem("role");

      const visibleJobs = response.data.filter((job) => !job.isHidden);
      if (userRole) {
        setRole(userRole);
      }
      setJobs(response.data);
      setFilteredJobs(visibleJobs);
      console.log("Jobs fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      navigate("/404");
    }
  };
  useEffect(() => {
    fetchJobs();
  }, [navigate]);

  if (!jobs.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "70vh",
        }}
      >
        <CircularProgress size={60} thickness={5} color="primary" />
        <Typography
          variant="h6"
          sx={{ marginTop: 2, fontFamily: "Poppins", color: "#555" }}
        >
          Loading jobs ....
        </Typography>
      </Box>
    );
  }

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setErrorOpen(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (field, value) => {
    let arr = filters[field];
    if (arr.includes(value)) {
      arr = arr.filter(function (item) {
        return item !== value;
      });
    } else {
      arr = arr.concat(value);
    }
    setFilters({ ...filters, [field]: arr });
  };

  const applyFilters = () => {
    let filtered = jobs;

    if (filters.keyword) {
      filtered = filtered.filter(function (job) {
        if (!job.title) return false;
        return job.title.toLowerCase().includes(filters.keyword.toLowerCase());
      });
    }

    if (filters.location) {
      filtered = filtered.filter(function (job) {
        if (!job.location) return false;
        return job.location
          .toLowerCase()
          .includes(filters.location.toLowerCase());
      });
    }

    if (filters.experienceLevel) {
      filtered = filtered.filter(function (job) {
        if (!job.experienceLevel) return false;
        return (
          job.experienceLevel.toLowerCase() ===
          filters.experienceLevel.toLowerCase()
        );
      });
    }

    if (filters.workTypes.length > 0) {
      filtered = filtered.filter(function (job) {
        return filters.workTypes.includes(job.workType);
      });
    }

    if (filters.jobTypes.length > 0) {
      filtered = filtered.filter(function (job) {
        return filters.jobTypes.includes(job.jobType);
      });
    }

    setFilteredJobs(filtered);
    setPage(1);
  };
  const clearFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      experienceLevel: "",
      jobTypes: [],
      workTypes: [],
    });
    fetchJobs();
  };

  const startIndex = (page - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <Box
      sx={{
        background: "#F7FAFC",
        minHeight: "100vh",
        px: { xs: 1, sm: 2, md: 6 },
        py: { xs: 2, md: 4 },
        fontFamily: "Geist",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "flex-start" },
          gap: { xs: 2, md: 3 },
          fontFamily: "Geist",
        }}
      >
        {/* Sidebar */}

        <Box
          sx={{
            width: { xs: "100%", md: 320 },
            maxWidth: 400,
            marginTop: { xs: 0, md: 7.7 },
            mb: { xs: 2, md: 0 },
            alignSelf: { xs: "auto", md: "flex-start" },
            fontFamily: "Geist",
          }}
        >
          <Card
            sx={{
              p: 2,
              borderRadius: 5,
              background: "",
              fontFamily: "Geist",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
                fontFamily: "Geist",
                background: "black",
                mx: -2,
                mt: -2,
                px: 2,
                py: 1.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#fff",
                  fontFamily: "Geist",
                }}
              >
                Filters
              </Typography>
              <FilterAltIcon
                sx={{
                  fontSize: 38,
                  color: "#fff",
                  bgcolor: "#fff3",
                  borderRadius: "50%",
                  p: 0.5,
                }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Search by Keyword"
                variant="outlined"
                fullWidth
                size="small"
                value={filters.keyword}
                onChange={handleFilterChange}
                name="keyword"
                sx={{
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 1,
                  background: "black",
                  color: "white",
                  "&:hover": {
                    background: "#333",
                  },
                }}
                onClick={async () => {
                  try {
                    const res = await searchJobByKeyword(filters.keyword);
                    const visibleJobs = res.data.filter((job) => !job.isHidden);
                    setJobs(visibleJobs);
                    setFilteredJobs(visibleJobs);
                    setPage(1);
                  } catch (err) {
                    console.error(err);
                    setErrorOpen(true);
                  }
                }}
              >
                Search
              </Button>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 30 }} />
              <TextField
                label="Location"
                fullWidth
                size="small"
                select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                sx={{
                  borderRadius: "16px",
                  mb: 1.5,
                  color: "black",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": { borderColor: "black" },
                    "&:hover fieldset": { borderColor: "black" },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                    fontFamily: "Geist",
                  },
                  "& .MuiInputLabel-root": { color: "black" },
                  "& .MuiInputBase-input": { color: "black" },
                }}
                InputLabelProps={{ style: { color: "black" } }}
                InputProps={{ style: { color: "black" } }}
                SelectProps={{ style: { color: "black" } }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="ramallah">Ramallah</MenuItem>
                <MenuItem value="nablus">Nablus</MenuItem>
                <MenuItem value="hebron">Hebron</MenuItem>
                <MenuItem value="jenin">Jenin</MenuItem>
                <MenuItem value="tulkarm">Tulkarm</MenuItem>
                <MenuItem value="qalqilya">Qalqilya</MenuItem>
                <MenuItem value="jericho">Jericho</MenuItem>
                <MenuItem value="bethlehem">Bethlehem</MenuItem>
                <MenuItem value="salfit">Salfit</MenuItem>
                <MenuItem value="gaza">Gaza</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
              <WorkspacePremiumIcon sx={{ fontSize: 30 }} />
              <TextField
                label="Experience Level"
                fullWidth
                size="small"
                select
                name="experienceLevel"
                value={filters.experienceLevel || ""}
                onChange={handleFilterChange}
                sx={{
                  borderRadius: "16px",
                  mb: 1.5,
                  color: "black",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": { borderColor: "black" },
                    "&:hover fieldset": { borderColor: "black" },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                    fontFamily: "Geist",
                  },
                  "& .MuiInputLabel-root": { color: "black" },
                  "& .MuiInputBase-input": { color: "black" },
                }}
                InputLabelProps={{ style: { color: "black" } }}
                InputProps={{ style: { color: "black" } }}
                SelectProps={{ style: { color: "black" } }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="entry">Entry</MenuItem>
                <MenuItem value="mid">Mid</MenuItem>
                <MenuItem value="senior">Senior</MenuItem>
              </TextField>
            </Box>

            <Box
              p={2}
              width={300}
              sx={{ borderRight: "1px solid #ddd", fontFamily: "Geist" }}
            >
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon />
                <Typography variant="subtitle1">Job Type</Typography>
              </Box>

              <FormGroup>
                <Box
                  sx={{
                    background: "#F7F7F7FF",
                    borderRadius: "12px",
                    mb: 1.2,
                    px: 2,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.jobTypes.includes("full-time")}
                        onChange={() =>
                          handleMultiSelect("jobTypes", "full-time")
                        }
                      />
                    }
                    label={
                      <Typography sx={{ color: "#334155", fontWeight: 500 }}>
                        Full Time
                      </Typography>
                    }
                    sx={{ flex: 1, m: 0 }}
                  />
                </Box>
                <Box
                  sx={{
                    background: "#F7F7F7FF",
                    borderRadius: "12px",
                    mb: 1.2,
                    px: 2,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.jobTypes.includes("part-time")}
                        onChange={() =>
                          handleMultiSelect("jobTypes", "part-time")
                        }
                      />
                    }
                    label={
                      <Typography sx={{ color: "#334155", fontWeight: 500 }}>
                        Part Time
                      </Typography>
                    }
                    sx={{ flex: 1, m: 0 }}
                  />
                </Box>
              </FormGroup>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", gap: 1 }}>
                <WorkIcon />
                <Typography variant="subtitle1">Work Type</Typography>
              </Box>
              <FormGroup>
                <Box
                  sx={{
                    background: "#F7F7F7FF",
                    borderRadius: "12px",
                    mb: 1.2,
                    px: 2,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.workTypes.includes("Remote")}
                        onChange={() =>
                          handleMultiSelect("workTypes", "Remote")
                        }
                      />
                    }
                    label={
                      <Typography sx={{ color: "#334155", fontWeight: 500 }}>
                        Remote
                      </Typography>
                    }
                    sx={{ flex: 1, m: 0 }}
                  />
                </Box>
                <Box
                  sx={{
                    background: "#F7F7F7FF",
                    borderRadius: "12px",
                    mb: 1,
                    px: 2,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.workTypes.includes("onsite")}
                        onChange={() =>
                          handleMultiSelect("workTypes", "onsite")
                        }
                      />
                    }
                    label={
                      <Typography sx={{ color: "#334155", fontWeight: 500 }}>
                        On-site
                      </Typography>
                    }
                    sx={{ flex: 1, m: 0 }}
                  />
                </Box>
                <Box
                  sx={{
                    background: "#F7F7F7FF",
                    borderRadius: "12px",
                    mb: 1.2,
                    px: 2,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.workTypes.includes("Hybrid")}
                        onChange={() =>
                          handleMultiSelect("workTypes", "Hybrid")
                        }
                      />
                    }
                    label={
                      <Typography sx={{ color: "#334155", fontWeight: 500 }}>
                        Hybrid
                      </Typography>
                    }
                    sx={{ flex: 1, m: 0 }}
                  />
                </Box>
              </FormGroup>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mt: 3,
                  fontFamily: "Geist",
                  background: "black",
                  color: "#fff",
                  boxShadow: "none",
                  "&:hover": {
                    background: "#2E2E2FFF",
                  },
                }}
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mt: 1.5,
                  fontFamily: "Geist",
                  color: "black",
                  borderColor: "black",
                  boxShadow: "none",
                  "&:hover": {
                    background: "#f5f5f5",
                    borderColor: "black",
                  },
                }}
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </Box>
          </Card>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 80 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#F7F7F7FF",
                color: "#7C3AED",
                px: 1.5,
                py: 0.5,
                borderRadius: "20px",
                fontWeight: 600,
                fontSize: 18,
                border: "1px solid #F3C623",
                minWidth: 48,
                justifyContent: "center",
                fontFamily: "Geist",
              }}
            >
              <BoltIcon sx={{ fontSize: 20, color: "#F3C623" }} />
              <span style={{ fontWeight: 500, fontSize: 14, color: "#F3C623" }}>
                {filteredJobs.length}
              </span>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 500, color: "#222", fontSize: 20, ml: 1 }}
              >
                Available positions
              </Typography>
            </Box>

            {userRole === "company" && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  mt: 3,
                  fontFamily: "Geist",
                  background: "black",
                  color: "#fff",
                  boxShadow: "none",
                  "&:hover": {
                    background: "black",
                  },
                }}
                onClick={() => navigate("/post-job")}
              >
                Post a Job
              </Button>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              maxWidth: "1200px",
              margin: "0 auto",
              overflowX: { xs: "auto", md: "visible" },
              justifyContent: { xs: "center", md: "flex-start" },
              fontFamily: "Geist",
            }}
          >
            {paginatedJobs.map((job, idx) => {
              const randomColor = getRandomLightColor(idx);

              return (
                <Box
                  key={job._id}
                  sx={{
                    flex: { xs: "1 1 100%", sm: "1 1 300px" },
                    maxWidth: { xs: "100%", sm: "48%", md: "32%" },
                    minWidth: "260px",
                    boxSizing: "border-box",
                    display: "flex",
                    fontFamily: "Geist",
                  }}
                >
                  <Card
                    sx={{
                      width: "100%",
                      borderRadius: "16px",
                      border: "2px solid #ECECEC",
                      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
                      background: "#fff",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      fontFamily: "Geist",
                    }}
                  >
                    {/* Inner Card */}

                    <Box
                      sx={{
                        width: "100%",
                        borderRadius: "16px 16px 0 0",
                        background: randomColor,
                        p: 2,
                        minHeight: 180,
                        boxSizing: "border-box",
                        fontFamily: "Geist",
                      }}
                    >
                      {/* Company logo and name */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1.2 }}
                      >
                        <Box sx={{ mr: 1 }}>
                          <img
                            src={
                              job.user?.profilepic?.url ||
                              "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                            }
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
                        <Box>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: "#334155",
                                fontFamily: "DM Sans, Poppins, Arial",
                                fontSize: "15px",
                                fontWeight: 500,
                                textTransform: "capitalize",
                                letterSpacing: 0.1,
                              }}
                            >
                              {job.user?.firstName}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: "#334155",
                                fontFamily: "DM Sans, Poppins, Arial",
                                fontSize: "15px",
                                fontWeight: 500,
                                textTransform: "capitalize",
                                letterSpacing: 0.1,
                              }}
                            >
                              {job.user?.lastName}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "14px",
                              color: "#888",
                              fontWeight: 100,
                            }}
                          >
                            {job.location || "California, CA"}
                          </Typography>
                        </Box>
                      </Box>
                      {/* Job Title */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1.2,
                          color: "black",
                          fontSize: "19px",
                          fontFamily: "Geist",
                          textTransform: "capitalize",
                          lineHeight: 1.2,
                          letterSpacing: 0.1,
                        }}
                      >
                        {job.title || job.jobTitle}
                      </Typography>
                      {/* Job tags */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          mb: 1.2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Box
                          sx={{
                            px: 2,
                            py: 0.5,
                            borderRadius: "20px",
                            fontSize: 13,
                            fontWeight: 500,
                            color: "black",
                            border: `1px solid black`,
                            letterSpacing: 0.2,
                            alignContent: "center",
                            textAlign: "start",
                            fontFamily: "Geist",
                          }}
                        >
                          {job.jobType || "Full Time"}
                        </Box>
                        <Box
                          sx={{
                            px: 2,
                            py: 0.5,
                            borderRadius: "20px",
                            fontSize: 13,
                            fontWeight: 500,
                            color: "black",
                            border: `1px solid black`,
                            letterSpacing: 0.2,
                            alignContent: "center",
                            textAlign: "start",
                            fontFamily: "Geist",
                          }}
                        >
                          {job.workType || "Remote"}
                        </Box>
                        <Box
                          sx={{
                            px: 2,
                            py: 0.5,
                            borderRadius: "20px",
                            fontSize: 13,
                            fontWeight: 500,
                            color: "black",
                            border: `1px solid black`,
                            letterSpacing: 0.2,
                            textAlign: "start",
                            alignContent: "center",
                            fontFamily: "Geist",
                          }}
                        >
                          {job.experienceLevel || "Senior Level"}
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ p: 2, fontFamily: "Geist" }}>
                      {/* Salary and Button */}
                      <Box
                        sx={{
                          width: "100%",
                          px: 0.5,
                          pt: 1,
                          fontFamily: "Geist",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontFamily: "Geist",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontFamily: "Geist",
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                color: "#222",
                                fontSize: "24px",
                                mr: 0.5,
                                fontFamily: "Geist",
                              }}
                            >
                              {job.salary ? `$${job.salary}` : "0"}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#888",
                                fontWeight: 500,
                                fontSize: "13px",
                                mt: "4px",
                                fontFamily: "Geist",
                              }}
                            >
                              /{job.salaryPeriod || "Monthly"}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{
                              bgcolor: "black",
                              color: "#fff",
                              borderRadius: "14px",
                              fontFamily: "Geist",
                            }}
                            onClick={() => navigate(`/job/${job._id}`)}
                          >
                            Details
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              );
            })}
          </Box>
          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "black",
                  borderColor: "#E0E7FF",
                  "&.Mui-selected": {
                    backgroundColor: "gray",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#DFDFDF",
                    },
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Failed to load jobs. Please Login try again later.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default FindJob;
