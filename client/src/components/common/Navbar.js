import { useState, useEffect } from "react";
import { useUser } from "../../utils/UserContext";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useMediaQuery,
  patch,
} from "@mui/material";
import { getProfile } from "../../API/API";
import { styled, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { motion } from "framer-motion";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Person } from "@mui/icons-material";
const StyledAppBar = styled(AppBar)({
  background: "black",
  boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
  backdropFilter: "blur(10px)",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
});

const NavButton = styled(Button)({
  color: "white",
  margin: "0 8px",
  fontWeight: 500,
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    width: 0,
    height: "2px",
    bottom: "6px",
    left: "50%",
    background: "white",
    transition: "all 0.3s ease",
    transform: "translateX(-50%)",
  },
  "&:hover": {
    backgroundColor: "transparent",
    "&:after": { width: "60%" },
  },
});

const Logo = styled(Typography)({
  fontWeight: 700,
  letterSpacing: "-0.5px",
  background: "linear-gradient(90deg, #fff 0%, #e0e7ff 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textDecoration: "none",
});

const StyledMenu = styled(Menu)({
  "& .MuiPaper-root": {
    backgroundColor: "black",
    color: "white",
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.05)",
    marginTop: 8,
  },
});

const StyledMenuItem = styled(MenuItem)({
  padding: "10px 20px",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  transition: "0.2s ease",
  "&:hover": { backgroundColor: "#dfdfdf", color: "black" },
});

// === Component ===
const Navbar = () => {
  const [navAnchor, setNavAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { user, setUser } = useUser();

  const navigate = useNavigate();
  const navItems = [
    { name: "Find Job", path: "/FindJob" },
    { name: "Courses", path: "/Courses" },
    { name: "Trainings", path: "/Trainings" }, 
    ...(localStorage.getItem("role") === "company"
      ? [{ name: "Dashboard", path: "/CompanyDashboard" }]
      : []),
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const userItems = [
    {
      name: "Profile",
      path: "./users/UserProfilePage",
      icon: <AccountCircleIcon fontSize="small" />,
    },
    {
      name: "Settings",
      path: "./common/Settings",
      icon: <SettingsIcon fontSize="small" />,
    },
    { name: "Logout", icon: <LogoutIcon fontSize="small" /> },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          throw new Error("User ID not found in localStorage.");
        }

        const response = await getProfile(userId);
        const profile = response.data;

        setUser({
          ...profile.user,
          location: profile.location,
          experience: profile.experience,
          education: profile.education,
          skills: profile.skills,
          profilepic: profile.user.profilepic,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const renderLinks = () =>
    navItems.map((item, i) => (
      <motion.div
        key={item.name}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
      >
        <Link to={item.path} style={{ textDecoration: "none" }}>
          <NavButton>{item.name}</NavButton>
        </Link>
      </motion.div>
    ));

  return (
    <StyledAppBar
      position="sticky"
      sx={{ py: scrolled ? 0.5 : 1, transition: "0.3s ease" }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/FindJob" style={{ textDecoration: "none" }}>
              <Logo variant="h5" component="span">
                ITHireSmart
              </Logo>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1 }}>{renderLinks()}</Box>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <>
              <IconButton
                onClick={(e) => setNavAnchor(e.currentTarget)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <StyledMenu
                anchorEl={navAnchor}
                open={Boolean(navAnchor)}
                onClose={() => setNavAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={() => setNavAnchor(null)}
                  >
                    <StyledMenuItem>{item.name}</StyledMenuItem>
                  </Link>
                ))}
              </StyledMenu>
            </>
          )}

          {/* User Avatar & Menu */}
          <Box>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={(e) => setUserAnchor(e.currentTarget)}
                  sx={{ p: 0.5 }}
                >
                  <Avatar
                    src={user?.profilepic?.url}
                    sx={{
                      width: 50,
                      height: 50,
                      border: "3px solid #333",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    }}
                  >
                    <Person sx={{ fontSize: 80, color: "#666" }} />
                  </Avatar>
                </IconButton>
              </Tooltip>
            </motion.div>
            <StyledMenu
              anchorEl={userAnchor}
              open={Boolean(userAnchor)}
              onClose={() => setUserAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              {userItems.map((item) => (
                <StyledMenuItem
                  key={item.name}
                  onClick={() => {
                    setUserAnchor(null);
                    if (item.name === "Logout") {
                      handleLogout();
                    } else if (item.name === "Profile") {
                      navigate("/MyProfile");
                    } else if (item.name === "Settings") {
                      navigate("/Settings");
                    }
                  }}
                >
                  {item.icon} {item.name}
                </StyledMenuItem>
              ))}
            </StyledMenu>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar;
