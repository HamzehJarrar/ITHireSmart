import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Container } from "@mui/material";
import { getProfile } from "../../API/API";
import moment from "moment";
import { Person } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import EmailIcon from "@mui/icons-material/Email";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CakeIcon from "@mui/icons-material/Cake";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const UserCVPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(id);
        const {
          user: userInfo,
          location,
          experience,
          education,
          skills,
          languages,
          trainingCourses,
        } = response.data;
        console.log("Profile response:", response.data);
        setUser({
          ...userInfo,
          location: location || "",
          experience: experience || [],
          education: education || [],
          skills: skills || [],
          languages: languages || [],
          trainingCourses: trainingCourses || [],
          profilepic: userInfo.profilepic || null,
        });
        setPhoto(userInfo.profilepic || null);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    fetchProfile();
  }, [id]);
  const formatDate = (dateStr) => {
    return moment(dateStr).format("MMMM D, YYYY");
  };

  const formatMonthYear = (dateStr) => {
    return moment(dateStr).format("MMM YYYY");
  };
  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography align="center" variant="h6">
          Loading...
        </Typography>
      </Container>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <Box sx={{ maxWidth: "900px", margin: "24px auto", padding: "0 16px" }}>
      {/* Profile card */}
      <Button
        variant="contained"
        size="medium"
        startIcon={<ArrowBackIosNewIcon />}
        sx={{
          mb: 3,
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
      <Box
        sx={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
            color: "white",
            padding: "24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            {/* Avatar */}
            <Avatar
              src={user?.profilepic?.url}
              sx={{
                width: 140,
                height: 140,
                border: "3px solid #333",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <Person sx={{ fontSize: 80, color: "#666" }} />
            </Avatar>

            {/* User info */}
            <Box
              sx={{
                flex: 1,
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              {/* Name */}
              <Box
                sx={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                {fullName}
              </Box>

              {/* Contact info */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: "16px",
                  fontSize: "0.9rem",
                }}
              >
                {/* Email */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <EmailIcon sx={{ fontSize: "20px" }} />
                  <Box>{user.email}</Box>
                </Box>

                {/* Phone */}
                {user.mobileNumber && (
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <PhoneAndroidIcon sx={{ fontSize: "20px" }} />
                    <Box>{user.mobileNumber}</Box>
                  </Box>
                )}

                {/* Location */}
                {user.location && (
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <LocationOnIcon sx={{ fontSize: "20px" }} />
                    <Box>{user.location}</Box>
                  </Box>
                )}
              </Box>

              {/* Date of birth */}
              {user.dateOfBirth && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    marginTop: "8px",
                  }}
                >
                  <CakeIcon sx={{ fontSize: "20px" }} />
                  <Box>{formatDate(user.dateOfBirth)}</Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Content Section */}
        <Box sx={{ padding: "24px" }}>
          {/* Bio */}
          {user.bio && (
            <Box sx={{ marginBottom: "24px" }}>
              <Box
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#2c3e50",
                  marginBottom: "8px",
                }}
              >
                Professional Summary
              </Box>
              <Box
                sx={{
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  color: "#666",
                }}
              >
                {user.bio}
              </Box>
            </Box>
          )}

          {/* Two Column Layout */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: "24px",
            }}
          >
            {/* Left Column */}
            <Box sx={{ flex: 1 }}>
              {/* Experience */}
              {user.experience?.length > 0 && (
                <Box sx={{ marginBottom: "24px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <BusinessCenterIcon sx={{ fontSize: "1.5rem", color: "#2c3e50" }} />
                    <Box sx={{ fontSize: "1.25rem", fontWeight: "700", color: "#2c3e50" }}>
                      Experience
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {user.experience.map((exp, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          border: "1px solid #dee2e6",
                          borderLeft: "4px solid #2c3e50",
                          padding: "16px",
                          borderRadius: "4px",
                          fontSize: "1rem",
                        }}
                      >
                        {exp}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Education */}
              {user.education?.length > 0 && (
                <Box sx={{ marginBottom: "24px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <Box sx={{ fontSize: "20px", color: "#2c3e50" }}>🎓</Box>
                    <Box
                      sx={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        color: "#2c3e50",
                      }}
                    >
                      Education
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {user.education.map((edu, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          border: "1px solid #dee2e6",
                          borderLeft: "4px solid #6c757d",
                          padding: "16px",
                          borderRadius: "4px",
                          fontSize: "1rem",
                        }}
                      >
                        {edu}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
</Box>
            {/* Right Column */}
            <Box sx={{ flex: "0 0 250px", minWidth: "250px" }}>
              {/* Skills */}
              {user.skills?.length > 0 && (
                <Box sx={{ marginBottom: "24px" }}>
                  <Box
                    sx={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      color: "#2c3e50",
                      marginBottom: "8px",
                    }}
                    
                  >
                    Skills
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {user.skills.map((skill, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          border: "1px solid #6c757d",
                          borderRadius: "16px",
                          padding: "4px 12px",
                          fontSize: "0.8rem",
                          color: "#2c3e50",
                          "&:hover": {
                            backgroundColor: "#f8f9fa",
                            borderColor: "#2c3e50",
                          },
                        }}
                      >
                        {skill}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Languages */}
              {user.languages?.length > 0 && (
                <Box sx={{ marginBottom: "24px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <Box sx={{ fontSize: "18px", color: "#2c3e50" }}>🌐</Box>
                    <Box
                      sx={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        color: "#2c3e50",
                      }}
                    >
                      Languages
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {user.languages.map((lang, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          border: "1px solid #6c757d",
                          borderRadius: "16px",
                          padding: "4px 12px",
                          fontSize: "0.8rem",
                          color: "#495057",
                        }}
                      >
                        {lang}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Training Courses */}
              {user.trainingCourses?.length > 0 && (
                <Box sx={{ marginBottom: "24px" }}>
                  <Box
                    sx={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      color: "#2c3e50",
                      marginBottom: "8px",
                    }}
                  >
                    Training & Certifications
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {user.trainingCourses.map((course, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          border: "1px solid #dee2e6",
                          borderRadius: "4px",
                          padding: "12px",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                        }}
                      >
                        {course}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              borderTop: "1px solid #dee2e6",
              marginTop: "16px",
              paddingTop: "16px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
                gap: "8px",
                fontSize: "0.8rem",
                color: "#999",
              }}
            >
              Member since {formatMonthYear(user.createdAt)}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserCVPage;
