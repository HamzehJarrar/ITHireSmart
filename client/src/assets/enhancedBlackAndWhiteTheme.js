import { createTheme } from "@mui/material/styles";

const enhancedBlackAndWhiteTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
      light: "#333333",
      dark: "#000000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ffffff",
      light: "#ffffff",
      dark: "#e0e0e0",
      contrastText: "#000000",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#555555",
    },
    action: {
      active: "#000000",
      hover: "rgba(0, 0, 0, 0.04)",
    },
    divider: "#e0e0e0",
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: "-0.015em",
    },
    subtitle2: {
      fontWeight: 500,
      letterSpacing: "-0.015em",
    },
    body1: {
      fontWeight: 400,
      letterSpacing: "-0.01em",
    },
    body2: {
      fontWeight: 400,
      letterSpacing: "-0.01em",
    },
    button: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 16px",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-1px)",
          },
        },
        contained: {
          backgroundColor: "#000000",
          color: "#ffffff",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#333333",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          },
        },
        outlined: {
          borderColor: "#000000",
          borderWidth: "1px",
          color: "#000000",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            borderColor: "#000000",
            borderWidth: "1px",
          },
        },
        text: {
          color: "#000000",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid #e0e0e0",
          transition: "all 0.3s ease-in-out",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "4px",
            height: "100%",
            backgroundColor: "#000",
            opacity: 0,
            transition: "opacity 0.3s ease-in-out",
          },
          "&:hover": {
            borderColor: "#000",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            "&::before": {
              opacity: 1,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
        outlined: {
          borderColor: "#e0e0e0",
          color: "#000000",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation1: {
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#e0e0e0",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: "#f5f5f5",
          borderRadius: 0,
          height: 6,
        },
        bar: {
          borderRadius: 0,
          backgroundColor: "#000",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "#000",
          color: "#fff",
        },
      },
    },
  },
});
export default enhancedBlackAndWhiteTheme;
