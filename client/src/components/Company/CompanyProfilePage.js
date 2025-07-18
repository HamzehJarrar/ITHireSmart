import { useEffect, useState } from "react";
import { getCompanyProfile } from "../../API/company";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Stack,
  Container,
  Avatar,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  Language,
  Person,
  Work,
  Description,
} from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

const CompanyProfilePage = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        setLoading(true);
        const companyId = localStorage.getItem("userId");
        if (!companyId)
          throw new Error("Company ID not found in localStorage.");

        const response = await getCompanyProfile(companyId);
        setCompany(response.data);

        console.log("companyId from localStorage:", companyId);
      } catch (error) {
        console.error("Error fetching company profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#fff",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#000" }} />
      </Box>
    );
  }

  if (!company) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#fff",
          gap: 2,
        }}
      >
        <Person sx={{ fontSize: 80, color: "#666" }} />
        <Typography variant="h5" sx={{ color: "#000" }}>
          Company not found
        </Typography>
      </Box>
    );
  }

  const ProfileSection = ({ children, sx = {} }) => (
    <Card
      sx={{
        bgcolor: "#fff",
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
          bgcolor: "#000",
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
      <Box sx={{ color: secondary ? "#666" : "#000", minWidth: 24 }}>
        {icon}
      </Box>
      <Typography
        variant="body1"
        sx={{
          color: secondary ? "#555" : "#000",
          fontWeight: secondary ? 400 : 500,
        }}
      >
        {children}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Navigation */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIosNewIcon />}
            onClick={() => navigate(-1)}
            sx={{
              color: "#000",
              borderColor: "#e0e0e0",
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 500,
              "&:hover": {
                borderColor: "#000",
                bgcolor: "#f5f5f5",
              },
            }}
          >
            Back
          </Button>
        </Box>

        {/* Company Header */}
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
              sx={{
                width: 160,
                height: 160,
                bgcolor: "#000",
                fontSize: 80,
                border: "4px solid #333",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              {company.companyName?.charAt(0).toUpperCase() || "C"}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  color: "#000",
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: "2rem", sm: "3rem" },
                }}
              >
                {company.companyName}
              </Typography>

              {company.companyField && (
                <Typography
                  variant="h6"
                  sx={{ color: "#666", fontWeight: 400, mb: 2 }}
                >
                  {company.companyField}
                </Typography>
              )}
            </Box>
          </Box>
        </ProfileSection>

        {/* Contact Information */}
        <ProfileSection>
          <Typography
            variant="h5"
            sx={{
              color: "#000",
              fontWeight: 600,
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Email sx={{ color: "#666" }} />
            Contact Information
          </Typography>

          <Stack spacing={2}>
            <InfoItem icon={<Email />}>{company.companyEmail}</InfoItem>
            {company.companyNumbers && (
              <InfoItem icon={<Phone />}>{company.companyNumbers}</InfoItem>
            )}
            {company.contactName && (
              <InfoItem icon={<Person />}>{company.contactName}</InfoItem>
            )}
            {company.contactPosition && (
              <InfoItem icon={<Work />}>{company.contactPosition}</InfoItem>
            )}
            {company.contactPhoneNumber && (
              <InfoItem icon={<Phone />}>{company.contactPhoneNumber}</InfoItem>
            )}
            {company.location && (
              <InfoItem icon={<LocationOn />}>{company.location}</InfoItem>
            )}
            {company.companyWebsite && (
              <InfoItem icon={<Language />}>
                <a
                  href={company.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#000" }}
                >
                  {company.companyWebsite}
                </a>
              </InfoItem>
            )}
          </Stack>
        </ProfileSection>

        {/* Company Description */}
        <ProfileSection
          sx={{
            maxHeight: "400px",
            overflowY: "auto",
            whiteSpace: "pre-line",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#000",
              fontWeight: 600,
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Description sx={{ color: "#666" }} />
            Company Description
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#333",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
              fontSize: "1.1rem",
            }}
          >
            {company.companyDescription || "No description available."}
          </Typography>
        </ProfileSection>
      </Container>
    </Box>
  );
};

export default CompanyProfilePage;
