import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import CompanyJobs from "../jobs/CompanyJobs";
import CompanyCourses from "../Courses/CompanyCourses";
import CompanyTrainings from "../Training/CompanyTrainings";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SchoolIcon from "@mui/icons-material/School";
import SquareFootIcon from '@mui/icons-material/SquareFoot';
const CompanyDashboard = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", color: "black" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        TabIndicatorProps={{
          style: { backgroundColor: "black" },
        }}
        centered
      >
        <Tab
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 1,
            color: "black",
            ":hover": {
              color: "black",
            },
            "&.Mui-selected": {
              color: "black",
            },
          }}
          icon={<BusinessCenterIcon />}
          label="Jobs"
        />

        <Tab
          icon={<SchoolIcon />}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 1,
            color: "black",
            ":hover": {
              color: "black",
            },
            "&.Mui-selected": {
              color: "black",
            },
          }}
          label="Courses"
        />
        <Tab
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 1,
            color: "black",
            ":hover": {
              color: "black",
            },
            "&.Mui-selected": {
              color: "black",
            },
          }}
          label="Trainings"
          icon={<SquareFootIcon />}
        />
      </Tabs>

      <Box sx={{ p: 2 }}>
        {value === 0 && <CompanyJobs />}
        {value === 1 && <CompanyCourses />}
        {value === 2 && <CompanyTrainings />}
      </Box>
    </Box>
  );
};

export default CompanyDashboard;
