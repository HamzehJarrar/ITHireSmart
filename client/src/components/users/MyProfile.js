import { useEffect, useState } from "react";
import { getMyProfile } from "../../API/API";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Avatar,
  Chip,
  Card,
  CardContent,
  Stack,
  Container,
} from "@mui/material";
import {
  Email,
  Phone,
  CalendarToday,
  LocationOn,
  Work,
  School,
  Code,
  Person,
} from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getMyProfile();
        const profile = response.data;

        setUser({
          ...profile.user,
          location: profile.location,
          experience: profile.experience,
          education: profile.education,
          skills: profile.skills,
          trainingCourses: profile.trainingCourses,
          languages: profile.languages,
          profilepic: profile.user.profilepic,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#ffffff",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#000000" }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#ffffff",
          gap: 2,
        }}
      >
        <Person sx={{ fontSize: 80, color: "#666666" }} />
        <Typography variant="h5" sx={{ color: "#000000" }}>
          User not found
        </Typography>
      </Box>
    );
  }

  const ProfileSection = ({ children, sx = {} }) => (
    <Card
      sx={{
        bgcolor: "#ffffff",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        mb: 2,
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
        ...sx,
      }}
      elevation={1}
    >
      <CardContent sx={{ p: 3, pl: 4 }}>{children}</CardContent>
    </Card>
  );

  const InfoItem = ({ icon, children, secondary = false }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 1,
      }}
    >
      <Box sx={{ color: secondary ? "#666666" : "#000000", minWidth: 24 }}>
        {icon}
      </Box>
      <Typography
        variant="body1"
        sx={{
          color: secondary ? "#555555" : "#000000",
          fontWeight: secondary ? 400 : 500,
        }}
      >
        {children}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Back Button */}
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
            Back
          </Button>
        </Box>

        {/* Header */}
        <ProfileSection>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              alignItems: { xs: "center", sm: "flex-start" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Avatar
              src={user.profilepic?.url}
              sx={{
                width: 160,
                height: 160,
                border: "4px solid #333",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <Person sx={{ fontSize: 80, color: "#666" }} />
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="h6" sx={{ color: "#666666" }}>
                Professional Developer
              </Typography>
              <Stack spacing={1} mt={2}>
                {user.location && <InfoItem icon={<LocationOn />} secondary>{user.location}</InfoItem>}
                <InfoItem icon={<Email />} secondary>{user.email}</InfoItem>
              </Stack>
            </Box>
          </Box>
        </ProfileSection>

        {/* Contact Info */}
        <ProfileSection>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            <Email sx={{ color: "#666666", mr: 1 }} />
            Contact Information
          </Typography>
          <Stack spacing={2}>
            <InfoItem icon={<Email />}>{user.email}</InfoItem>
            {user.mobileNumber && <InfoItem icon={<Phone />}>{user.mobileNumber}</InfoItem>}
            {user.dateOfBirth && (
              <InfoItem icon={<CalendarToday />}>
                Born {new Date(user.dateOfBirth).toLocaleDateString()}
              </InfoItem>
            )}
            {user.location && <InfoItem icon={<LocationOn />}>{user.location}</InfoItem>}
          </Stack>
        </ProfileSection>

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <ProfileSection>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              <Code sx={{ color: "#666666", mr: 1 }} />
              Skills & Technologies
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              {user.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  sx={{
                    bgcolor: "#f5f5f5",
                    color: "#000",
                    border: "1px solid #ccc",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor: "#000",
                      color: "#fff",
                    },
                  }}
                />
              ))}
            </Box>
          </ProfileSection>
        )}

        {/* Education */}
        {user.education && user.education.length > 0 && (
          <ProfileSection>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              <School sx={{ color: "#666666", mr: 1 }} />
              Education
            </Typography>
            <Stack spacing={2}>
              {user.education.map((edu, index) => (
                <Typography key={index} variant="body1" sx={{ color: "#555" }}>
                  • {edu}
                </Typography>
              ))}
            </Stack>
          </ProfileSection>
        )}
{/* Work Experience */}
{user.experience && user.experience.length > 0 && (
  <ProfileSection>
    <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
      <Work sx={{ color: "#666666", mr: 1 }} />
      Work Experience
    </Typography>
    <Stack spacing={1}>
      {user.experience.map((exp, index) => (
        <Typography key={index} variant="body1" sx={{ color: "#555" }}>
          • {exp}
        </Typography>
      ))}
    </Stack>
  </ProfileSection>
)}
        {/* Training Courses */}
        {user.trainingCourses && user.trainingCourses.length > 0 && (
          <ProfileSection>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              <School sx={{ color: "#666666", mr: 1 }} />
              Training Courses
            </Typography>
            <Stack spacing={1}>
              {user.trainingCourses.map((course, index) => (
                <Typography key={index} variant="body1" sx={{ color: "#555" }}>
                  • {course}
                </Typography>
              ))}
            </Stack>
          </ProfileSection>
        )}

        {/* Languages */}
        {user.languages && user.languages.length > 0 && (
          <ProfileSection>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              <Code sx={{ color: "#666666", mr: 1 }} />
              Languages
            </Typography>
            <Stack spacing={1}>
              {user.languages.map((lang, index) => (
                <Typography key={index} variant="body1" sx={{ color: "#555" }}>
                  • {lang}
                </Typography>
              ))}
            </Stack>
          </ProfileSection>
        )}
      </Container>
    </Box>
  );
};

export default UserProfilePage;
