import {
  Box,
  Typography,
  Button,
  CardContent,
  Paper,
  Container,
} from "@mui/material";
import { Home, ArrowBack, HelpOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e3f2fd 0%, #ffffff 50%, #f3e5f5 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          {/* Large 404 with visual effect */}
          <Box
            sx={{
              position: "relative",
              mb: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "8rem", md: "12rem" },
                fontWeight: 900,
                background: "linear-gradient(45deg, #1976d2, #9c27b0)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 0.8,
                userSelect: "none",
              }}
            >
              404
            </Typography>
            <Typography
              sx={{
                position: "absolute",
                fontSize: { xs: "8rem", md: "12rem" },
                fontWeight: 900,
                color: "#e3f2fd",
                lineHeight: 0.8,
                userSelect: "none",
                zIndex: -1,
                transform: "translate(8px, 8px)",
              }}
            >
              404
            </Typography>
          </Box>

          {/* Main content */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Title and description */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                  mb: 2,
                  fontSize: { xs: "2rem", md: "3rem" },
                }}
              >
                Oops! Page Not Found
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "text.secondary",
                  maxWidth: 400,
                  lineHeight: 1.6,
                }}
              >
                The page you're looking for seems to have wandered off into the
                digital void. Don't worry, it happens to the best of us!
              </Typography>
            </Box>

            {/* Action buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
                mb: 4,
                width: "100%",
                maxWidth: 500,
              }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<ArrowBack />}
                onClick={() => navigate("/login")}
                sx={{
                  textTransform: "none",
                  px: 4,
                  py: 1.5,
                  fontSize: "16px",
                  flex: { xs: "1", sm: "0 1 auto" },
                  minWidth: { xs: "100%", sm: "auto" },
                }}
              >
                Back to Login
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Home />}
                onClick={() => navigate("/FindJob")}
                sx={{
                  textTransform: "none",
                  px: 4,
                  py: 1.5,
                  fontSize: "16px",
                  flex: { xs: "1", sm: "0 1 auto" },
                  minWidth: { xs: "100%", sm: "auto" },
                }}
              >
                Go Home
              </Button>
            </Box>

            {/* Helpful suggestions */}
            <Paper
              elevation={3}
              sx={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                border: "none",
                mb: 4,
                width: "100%",
                maxWidth: 600,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    mb: 3,
                  }}
                >
                  <HelpOutline sx={{ color: "primary.main" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    What can you do?
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  {/* First row */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 3,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        flex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: "primary.main",
                          borderRadius: "50%",
                          mt: 1,
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          Check the URL
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Make sure the web address is spelled correctly
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        flex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: "secondary.main",
                          borderRadius: "50%",
                          mt: 1,
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          Go back
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Return to the previous page you were on
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Second row */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 3,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        flex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: "success.main",
                          borderRadius: "50%",
                          mt: 1,
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          Visit homepage
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Start fresh from our main page
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        flex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: "warning.main",
                          borderRadius: "50%",
                          mt: 1,
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          Contact support
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Get help if you think this is an error
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Paper>
          </Box>

          {/* Footer message */}
          <Box
            sx={{
              pt: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="text.disabled">
              Error Code: 404 • Page Not Found
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default NotFoundPage;
