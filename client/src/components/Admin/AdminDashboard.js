import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  Divider,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  TextField,
  Card,
  CardContent,
  Stack,
  Badge,
  alpha,
  useTheme,
  Container,
  InputAdornment,
  CircularProgress,
  IconButton,
  Button,
} from "@mui/material";
import {
  Cancel,
  CheckCircle,
  Search,
  People,
  Business,
  Email,
  LocationOn,
  VerifiedUser,
  PendingActions,
} from "@mui/icons-material";
import { getAllUsers, toggleUserStatus } from "../../API/adminAPI";
import { getAllCompanies, verifyCompany } from "../../API/company";

const AdminDashboard = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [tab, setTab] = useState(0);
  const [companyFilter, setCompanyFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchCompanies()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const role = localStorage.getItem("role");

  const fetchCompanies = async () => {
    try {
      const res = await getAllCompanies();
      setCompanies(res.data);
      console.log("Companies fetched:", res.data);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    setSearch("");
  };

  const filteredUsers = users
    .filter((user) => user.role !== "admin")
    .filter((user) => {
      if (userFilter === "verified" && user.role === "none") return false;
      if (userFilter === "unverified" && user.role !== "none") return false;
      const searchTokens = search.toLowerCase().split(" ").filter(Boolean);

      return searchTokens.every(
        (token) =>
          user.firstName?.toLowerCase().includes(token) ||
          user.lastName?.toLowerCase().includes(token) ||
          user.email?.toLowerCase().includes(token)
      );
    });

  // Filter companies by isVerified (keep as is)
  const filteredCompanies = companies.filter((company) => {
    if (companyFilter === "verified" && !company.isVerified) return false;
    if (companyFilter === "unverified" && company.isVerified) return false;

    return (
      company.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      company.companyEmail?.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Stats
  const getStats = () => {
    const verifiedUsers = users.filter((user) => user.role !== "none").length;
    const verifiedCompanies = companies.filter(
      (company) => company.isVerified
    ).length;
    return {
      totalUsers: users.length,
      verifiedUsers,
      totalCompanies: companies.length,
      verifiedCompanies,
    };
  };

  // Toggle user role (enable/disable user)
  const toggleUserRole = async (userId) => {
    try {
      const res = await toggleUserStatus(userId);
      const newRole = res.data.role;

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      console.error("Failed to toggle user role:", err);
    }
  };

  // Toggle company status (approved/denied)
  const toggleCompanyStatus = async (companyId, currentStatus) => {
    try {
      const newStatus = currentStatus === "approved" ? "denied" : "approved";
      const res = await verifyCompany(companyId, newStatus);

      setCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company._id === companyId ? res.data.company : company
        )
      );
    } catch (error) {
      console.error("Failed to toggle company status:", error);
    }
  };

  const stats = getStats();
  const currentData = tab === 0 ? filteredUsers : filteredCompanies;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "grey.50",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {role === "admin" && <VerifiedUser />}
            {role === "admin" ? "Admin Dashboard" : "Search Dashboard"}
          </Typography>
          {role === "admin" ? (
            <Typography variant="body1" color="text.secondary">
              Manage users and companies across your platform
            </Typography>
          ) : null}
        </Box>

        {role === "admin" && (
          <>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: "100%",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: alpha("#fff", 0.2),
                        }}
                      >
                        <People />
                      </Box>
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {stats.totalUsers}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Total Users
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              {/* باقي الـ Cards مثل اللي فوق */}
              {/* ... */}
            </Grid>
          </>
        )}

        {/* Main Content Card */}
        <Card sx={{ overflow: "hidden" }}>
          {/* Tabs */}
          <Box
            sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "grey.50" }}
          >
            <Tabs
              value={tab}
              onChange={handleTabChange}
              sx={{
                px: 3,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                },
              }}
            >
              <Tab
                icon={<People />}
                iconPosition="start"
                label={`Users (${stats.totalUsers})`}
                sx={{ gap: 1 }}
              />

              {role == "admin" ? (
                <Tab
                  icon={<Business />}
                  iconPosition="start"
                  label={`Companies (${stats.totalCompanies})`}
                  sx={{ gap: 1 }}
                />
              ) : null}
            </Tabs>
          </Box>

          {/* Filters */}
          <Box sx={{ p: 3, bgcolor: "grey.25" }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "white",
                    },
                  }}
                />
              </Grid>

              {role == "admin" ? (
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status Filter</InputLabel>
                    <Select
                      value={tab === 0 ? userFilter : companyFilter}
                      label="Status Filter"
                      onChange={(e) =>
                        tab === 0
                          ? setUserFilter(e.target.value)
                          : setCompanyFilter(e.target.value)
                      }
                      sx={{ bgcolor: "white" }}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="verified">Verified Only</MenuItem>
                      <MenuItem value="unverified">Unverified Only</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              ) : null}
            </Grid>
          </Box>

          <Divider />

          {/* Content */}
          <Box sx={{ p: 3 }}>
            {currentData.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No {tab === 0 ? "users" : "companies"} found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filter criteria
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {tab === 0 &&
                  filteredUsers.map((user) => (
                    <Grid item xs={12} key={user._id}>
                      <Paper
                        sx={{
                          p: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: theme.shadows[8],
                          },
                        }}
                      >
                        <IconButton
                          onClick={() => toggleUserRole(user._id)}
                          aria-label={
                            user.role === "none"
                              ? "Enable User"
                              : "Disable User"
                          }
                          size="small"
                          sx={{ p: 0 }}
                        >
                          {role == "admin" ? (
                            <Badge
                              overlap="circular"
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                              }}
                              badgeContent={
                                user.role !== "role" ? (
                                  <CheckCircle
                                    sx={{
                                      color: "success.main",
                                      bgcolor: "white",
                                      borderRadius: "50%",
                                      fontSize: 20,
                                    }}
                                  />
                                ) : (
                                  <Cancel
                                    sx={{
                                      color: "error.main",
                                      bgcolor: "white",
                                      borderRadius: "50%",
                                      fontSize: 20,
                                    }}
                                  />
                                )
                              }
                            ></Badge>
                          ) : (
                            <Avatar
                              src={user.profilepic?.url}
                              alt={user.firstName}
                              sx={{ width: 80, height: 80 }}
                            >
                              {user.firstName?.charAt(0)}
                              {user.lastName?.charAt(0)}
                            </Avatar>
                          )}
                        </IconButton>

                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            fontWeight="600"
                            gutterBottom
                          >
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Stack spacing={1}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Email fontSize="small" color="action" />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {user.email}
                              </Typography>
                            </Box>
                            {user.location && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <LocationOn fontSize="small" color="action" />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {user.location}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                        </Box>

                        {role === "admin" ? (
                          <Box sx={{ textAlign: "center" }}>
                            <Chip
                              icon={
                                user.role !== "none" ? (
                                  <CheckCircle />
                                ) : (
                                  <PendingActions />
                                )
                              }
                              label={
                                user.role !== "none" ? "Enabled" : "Disabled"
                              }
                              color={
                                user.role !== "none" ? "success" : "warning"
                              }
                              variant="outlined"
                              sx={{ fontWeight: 600, mr: 1 }}
                            />

                            {role == "admin" ? (
                              <Button
                                variant="contained"
                                size="small"
                                color={
                                  user.role !== "none" ? "error" : "success"
                                }
                                onClick={() => toggleUserRole(user._id)}
                              >
                                {user.role !== "none" ? "Disable" : "Enable"}
                              </Button>
                            ) : null}
                          </Box>
                        ) : null}
                      </Paper>
                    </Grid>
                  ))}

                {role === "admin" && tab === 1
                  ? filteredCompanies.map((company) => (
                      <Grid item xs={12} key={company._id}>
                        <Paper
                          sx={{
                            p: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: theme.shadows[8],
                            },
                          }}
                        >
                          <Badge
                            overlap="circular"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            badgeContent={
                              company.isVerified ? (
                                <CheckCircle
                                  sx={{
                                    color: "success.main",
                                    bgcolor: "white",
                                    borderRadius: "50%",
                                    fontSize: 20,
                                  }}
                                />
                              ) : (
                                <Cancel
                                  sx={{
                                    color: "error.main",
                                    bgcolor: "white",
                                    borderRadius: "50%",
                                    fontSize: 20,
                                  }}
                                />
                              )
                            }
                          >
                            <Avatar
                              src={company.companyProfile?.url}
                              alt={company.companyName}
                              sx={{ width: 80, height: 80 }}
                            >
                              {company.companyName?.charAt(0)}
                            </Avatar>
                          </Badge>

                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              variant="h6"
                              fontWeight="600"
                              gutterBottom
                            >
                              {company.companyName}
                            </Typography>
                            <Stack spacing={1}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Email fontSize="small" color="action" />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {company.companyEmail}
                                </Typography>
                              </Box>
                              {company.location && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <LocationOn fontSize="small" color="action" />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {company.location}
                                  </Typography>
                                </Box>
                              )}
                            </Stack>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              textAlign: "center",
                              gap: 2,
                              flexWrap: "wrap",
                              mb: 1,
                            }}
                          >
                            <Chip
                              icon={
                                company.isVerified ? (
                                  <CheckCircle />
                                ) : (
                                  <PendingActions />
                                )
                              }
                              label={
                                company.isVerified ? "Verified" : "Pending"
                              }
                              color={company.isVerified ? "success" : "warning"}
                              variant="outlined"
                              sx={{ fontWeight: 600 }}
                            />

                            <Button
                              variant="contained"
                              size="small"
                              color={
                                company.status === "approved"
                                  ? "error"
                                  : "success"
                              }
                              onClick={() =>
                                toggleCompanyStatus(company._id, company.status)
                              }
                            >
                              {company.status === "approved"
                                ? "Deny"
                                : "Approve"}
                            </Button>
                          </Box>
                        </Paper>
                      </Grid>
                    ))
                  : null}
              </Stack>
            )}
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
