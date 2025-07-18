"use client";

import React, { useEffect, useState } from "react";
import { getCompanyProfile } from "../../API/company"; // عدل المسار حسب مشروعك
import {
  Avatar,
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  Link,
  Grid,
  Chip,
  Paper,
  Container,
  Skeleton,
  Alert,
  IconButton,
  Fade,
  useTheme,
  alpha,
} from "@mui/material";
import {
  LocationOn,
  Email,
  Phone,
  Language,
  Person,
  Business,
  Description,
  PhoneAndroid,
  ContentCopy,
  CheckCircle,
  CalendarToday,
} from "@mui/icons-material";

// مكون InfoItem
const InfoItem = ({ icon, label, value, copyable = false }) => {
  const theme = useTheme();

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // يمكنك إضافة إشعار نسخ هنا إن أردت
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        transition: "all 0.2s ease-in-out",
        height: "100%",
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[2],
        },
      }}
    >
      <Box display="flex" alignItems="flex-start" gap={1.5}>
        <Box sx={{ color: theme.palette.primary.main, mt: 0.25 }}>{icon}</Box>
        <Box flex={1}>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              mb: 0.5,
              display: "block",
            }}
          >
            {label}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ wordBreak: "break-word" }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {value}
            </Typography>
            {copyable && typeof value === "string" && (
              <IconButton
                size="small"
                onClick={() => handleCopy(value)}
                sx={{ ml: 1, opacity: 0.7, "&:hover": { opacity: 1 } }}
                aria-label={`Copy ${label}`}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

// مكون الهيكل العظمي أثناء تحميل البيانات
const LoadingSkeleton = () => (
  <Container maxWidth="md" sx={{ py: 4 }}>
    <Card sx={{ borderRadius: 4, overflow: "hidden", boxShadow: 4 }}>
      <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="text" width="60%" height={40} sx={{ mt: 2 }} />
          <Skeleton variant="text" width="40%" height={24} />
        </Box>
        <Grid container spacing={2}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Skeleton
                variant="rectangular"
                height={80}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>
        <Box mt={4}>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton
            variant="rectangular"
            height={120}
            sx={{ mt: 1, borderRadius: 1 }}
          />
        </Box>
      </CardContent>
    </Card>
  </Container>
);

function CompanyPublicProfile() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const companyId = localStorage.getItem("companyId") || null;
    if (!companyId) {
      setError("No company ID found in local storage.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getCompanyProfile(companyId);
        setCompany(res.data);
      } catch (err) {
        setError(
          err.response?.data?.msg || "Failed to load company information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton />;

  if (error)
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );

  if (!company) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Card
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: 4,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.background.paper,
              0.6
            )} 0%, ${alpha(theme.palette.background.default, 0.6)} 100%)`,
          }}
        >
          {/* ترويسة القسم */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "white",
              py: 5,
              px: { xs: 2, sm: 4 },
              textAlign: "center",
            }}
          >
            <Avatar
              src={
                company.profilepic?.url ||
                "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
              }
              alt={company.companyName || "Company"}
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                mb: 2,
                boxShadow: 4,
                border: `4px solid ${alpha("#fff", 0.2)}`,
              }}
            />
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {company.companyName || "Company Name"}
            </Typography>
            {company.companyField && (
              <Chip
                label={company.companyField}
                sx={{
                  backgroundColor: alpha("#fff", 0.2),
                  color: "white",
                  fontWeight: 600,
                }}
              />
            )}
          </Box>

          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            {/* معلومات الاتصال */}
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Business color="primary" />
              Contact Information
            </Typography>
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              {company.location && (
                <Grid item xs={12} sm={6}>
                  <InfoItem
                    icon={<LocationOn />}
                    label="Location"
                    value={company.location}
                  />
                </Grid>
              )}
              {company.companyEmail && (
                <Grid item xs={12} sm={6}>
                  <InfoItem
                    icon={<Email />}
                    label="Email"
                    value={
                      <Link
                        href={`mailto:${company.companyEmail}`}
                        underline="hover"
                      >
                        {company.companyEmail}
                      </Link>
                    }
                    copyable
                  />
                </Grid>
              )}
              {company.companyNumbers && (
                <Grid item xs={12} sm={6}>
                  <InfoItem
                    icon={<Phone />}
                    label="Phone"
                    value={
                      <Link
                        href={`tel:${company.companyNumbers}`}
                        underline="hover"
                      >
                        {company.companyNumbers}
                      </Link>
                    }
                    copyable
                  />
                </Grid>
              )}
              {company.companyWebsite && (
                <Grid item xs={12} sm={6}>
                  <InfoItem
                    icon={<Language />}
                    label="Website"
                    value={
                      <Link
                        href={company.companyWebsite}
                        target="_blank"
                        rel="noreferrer"
                        underline="hover"
                      >
                        {company.companyWebsite.replace(/^https?:\/\//, "")}
                      </Link>
                    }
                  />
                </Grid>
              )}
              {company.contactName && (
                <Grid item xs={12} sm={6}>
                  <InfoItem
                    icon={<Person />}
                    label="Contact Person"
                    value={`${company.contactName}${
                      company.contactPosition
                        ? ` (${company.contactPosition})`
                        : ""
                    }`}
                  />
                </Grid>
              )}
              {company.contactPhoneNumber && (
                <Grid item xs={12} sm={6}>
                  <InfoItem
                    icon={<PhoneAndroid />}
                    label="Contact Phone"
                    value={
                      <Link
                        href={`tel:${company.contactPhoneNumber}`}
                        underline="hover"
                      >
                        {company.contactPhoneNumber}
                      </Link>
                    }
                    copyable
                  />
                </Grid>
              )}
            </Grid>

            {/* وصف الشركة */}
            {company.companyDescription && (
              <>
                <Divider sx={{ my: 4 }} />
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Description color="primary" />
                    About the Company
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.grey[500], 0.04),
                      border: `1px solid ${alpha(
                        theme.palette.grey[500],
                        0.12
                      )}`,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: "pre-line",
                        lineHeight: 1.7,
                        color: "text.secondary",
                      }}
                    >
                      {company.companyDescription}
                    </Typography>
                  </Paper>
                </Box>
              </>
            )}

            {/* حالة الشركة وتاريخ الانضمام */}
            <Divider sx={{ my: 4 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <InfoItem
                  icon={<Business />}
                  label="Status"
                  value={company.status || "N/A"}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InfoItem
                  icon={<CheckCircle />}
                  label="Verified"
                  value={company.isVerified ? "Yes" : "No"}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InfoItem
                  icon={<CalendarToday />}
                  label="Joined"
                  value={
                    company.dateOfcreation
                      ? new Date(company.dateOfcreation).toLocaleDateString()
                      : "N/A"
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
}

export default CompanyPublicProfile;
