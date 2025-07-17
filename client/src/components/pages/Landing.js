import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Ellipse from "../../assets/Ellipse.png";
import Vector from "../../assets/Vector.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  color: "white",
  flexDirection: "column",
  gap: "20px",
  position: "relative"
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

const Landing = () => {
  return (
    <Box sx={{ backgroundColor: "black", height: "100vh", position: "relative" }}>
      <Box sx={style}>
        <motion.img
          src={Ellipse}
          alt="Ellipse"
          style={ImageStyleTopLeft}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h2"
            sx={{ color: "black",padding: "0 20px", fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" }, textAlign: 'center', background:"white" }}
          >
            IT HireSmart
          </Typography>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 300 }}>
          <Link to="/login" style={{ textDecoration: 'none', width: '100%' }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                bgcolor: 'white',
                color: 'black',
                '&:hover': { bgcolor: '#f0f0f0' },
              }}
            >
              Login
            </Button>
          </Link>

            <Link to="/Register" style={{ textDecoration: "none" , width: "100%" }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "white",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.5)",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Sign Up
              </Button>
            </Link>
          </Box>
        </motion.div>
      </Box>

      <motion.img
        src={Vector}
        alt="Vector"
        style={ImageStyleBottomRight}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      />
    </Box>
  );
};

export default Landing;
