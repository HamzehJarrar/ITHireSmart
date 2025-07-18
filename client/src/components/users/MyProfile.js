import { useEffect, useState } from "react";
import { getProfile,getMyProfile } from "../../API/API";
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
  IconButton,
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
            Back
          </Button>
        </Box>

        {/* Main Profile Header */}
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      color: "#000000",
                      fontWeight: 700,
                      mb: 1,
                      fontSize: { xs: "2rem", sm: "3rem" },
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#666666",
                      fontWeight: 400,
                      mb: 2,
                    }}
                  >
                    Professional Developer
                  </Typography>
                </Box>
              </Box>

              {/* Quick Contact Info */}
              <Stack spacing={1}>
                {user.location && (
                  <InfoItem icon={<LocationOn />} secondary>
                    {user.location}
                  </InfoItem>
                )}
                <InfoItem icon={<Email />} secondary>
                  {user.email}
                </InfoItem>
              </Stack>
            </Box>
          </Box>
        </ProfileSection>

        {/* Contact Information */}
        <ProfileSection>
          <Typography
            variant="h5"
            sx={{
              color: "#000000",
              fontWeight: 600,
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Email sx={{ color: "#666666" }} />
            Contact Information
          </Typography>

          <Stack spacing={2}>
            <InfoItem icon={<Email />}>{user.email}</InfoItem>
            {user.mobileNumber && (
              <InfoItem icon={<Phone />}>{user.mobileNumber}</InfoItem>
            )}
            {user.dateOfBirth && (
              <InfoItem icon={<CalendarToday />}>
                Born {new Date(user.dateOfBirth).toLocaleDateString()}
              </InfoItem>
            )}
            {user.location && (
              <InfoItem icon={<LocationOn />}>{user.location}</InfoItem>
            )}
          </Stack>
        </ProfileSection>

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <ProfileSection>
            <Typography
              variant="h5"
              sx={{
                color: "#000000",
                fontWeight: 600,
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Code sx={{ color: "#666666" }} />
              Skills & Technologies
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
              }}
            >
              {user.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  sx={{
                    bgcolor: "#f5f5f5",
                    color: "#000000",
                    border: "1px solid #e0e0e0",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    "&:hover": {
                      bgcolor: "#000000",
                      color: "#ffffff",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                />
              ))}
            </Box>
          </ProfileSection>
        )}

        {/* Experience */}
        {user.experience && user.experience.length > 0 && (
          <ProfileSection>
            <Typography
              variant="h5"
              sx={{
                color: "#000000",
                fontWeight: 600,
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Work sx={{ color: "#666666" }} />
              Experience
            </Typography>

            <Stack spacing={4}>
              {user.experience.map((exp, index) => (
                <Box key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 1, sm: 0 },
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#000000",
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        {exp.title}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#666666",
                          fontWeight: 500,
                        }}
                      >
                        {exp.company}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#ffffff",
                        fontWeight: 500,
                        bgcolor: "#000000",
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(exp.from).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                      })}{" "}
                      -{" "}
                      {exp.to
                        ? new Date(exp.to).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                          })
                        : "Present"}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#555555",
                      lineHeight: 1.6,
                      mt: 2,
                    }}
                  >
                    {exp.description}
                  </Typography>
                  {index < user.experience.length - 1 && (
                    <Box
                      sx={{
                        height: "1px",
                        bgcolor: "#333",
                        mt: 3,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Stack>
          </ProfileSection>
        )}

        {/* Education */}
        {user.education && user.education.length > 0 && (
          <ProfileSection>
            <Typography
              variant="h5"
              sx={{
                color: "#000000",
                fontWeight: 600,
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <School sx={{ color: "#666666" }} />
              Education
            </Typography>

            <Stack spacing={4}>
              {user.education.map((edu, index) => (
                <Box key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 1, sm: 0 },
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#000000",
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        {edu.degree || edu.fieldofstudy || "Education"}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#666666",
                          fontWeight: 500,
                        }}
                      >
                        {edu.school}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#ffffff",
                        fontWeight: 500,
                        bgcolor: "#000000",
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {edu.from
                        ? new Date(edu.from).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                          })
                        : "N/A"}{" "}
                      -{" "}
                      {edu.to
                        ? new Date(edu.to).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                          })
                        : "Present"}
                    </Typography>
                  </Box>
                  {edu.description && (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#555555",
                        lineHeight: 1.6,
                        mt: 2,
                      }}
                    >
                      {edu.description}
                    </Typography>
                  )}
                  {index < user.education.length - 1 && (
                    <Box
                      sx={{
                        height: "1px",
                        bgcolor: "#333",
                        mt: 3,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Stack>
          </ProfileSection>
        )}
      </Container>
    </Box>
  );
};

export default UserProfilePage;
