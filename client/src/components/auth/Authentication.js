import React from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Ellipse from "../../assets/Ellipse.png";
import Vector from "../../assets/Vector.png";
import "../../App.css";
import { Link } from "react-router-dom";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  color: "white",
  flexDirection: "column",
  gap: "20px",
  position: "relative",
  padding: "0 20px",
};

const ImageStyleTopLeft = {
  position: "absolute",
  top: "0px",
  left: "0px",
  width: "35%",
  maxWidth: "350px",
};

const ImageStyleBottomRight = {
  position: "absolute",
  bottom: "0px",
  right: "0px",
  width: "35%",
  maxWidth: "350px",
};

const TextFieldStyle = {
  width: "100%",
  maxWidth: "400px",
  height: "50px",
  borderRadius: "15px",
  backgroundColor: "transparent",
  color: "#fff",
  "& label, & label.Mui-focused, & .MuiInputBase-input": { color: "#fff" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#fff" },
    "&:hover fieldset": { borderColor: "#fff" },
    "&.Mui-focused fieldset": { borderColor: "#fff" },
  },
  fontFamily: "Poppins",
};

const ButtonStyle = {
  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
  bgcolor: "white",
  color: "black",
  "&:hover": { bgcolor: "#f0f0f0" },
  width: "100%",
  maxWidth: "350px",
  borderRadius: "10px",
  fontFamily: "Poppins",
};

const ButtonStyleBlack = {
  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
  bgcolor: "black",
  color: "white",
  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
  width: "100%",
  maxWidth: "350px",
  borderRadius: "10px",
  fontFamily: "Poppins",
  border: "1px solid #fff",
};

const Authentication = () => {
  return (
    <Box
      sx={{ backgroundColor: "black", height: "100vh", position: "relative" }}
    >
      <Box sx={style}>

      <Box sx={{ display: "flex",flexDirection: "column", alignItems: "center", gap: "10px"}}>
        <LockOpenIcon
          sx={{
            color: "white",
            fontSize: { xs: "4rem", sm: "5rem", md: "6rem" },
          }}
        />
        <Typography variant="h4" sx={{ fontFamily: "Poppins" , textAlign: "center" }}>
          Two-factor Authentication
        </Typography>
       </Box>
        <TextField
          label="Authentication code"
          variant="outlined"
          sx={TextFieldStyle}
        />
        <Button variant="contained" sx={ButtonStyle}>
          Verify
        </Button>
        <Link
          to={"/register"}
          style={{ textDecoration: "none", width: "100%", maxWidth: "350px" }}
        >
          <Button variant="contained" sx={ButtonStyleBlack}>
            Cancel
          </Button>
        </Link>
      </Box>

      <img src={Ellipse} alt="Ellipse" style={ImageStyleTopLeft} />
      <img src={Vector} alt="Vector" style={ImageStyleBottomRight} />
    </Box>
  );
};

export default Authentication;
