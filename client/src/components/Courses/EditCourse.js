import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, updateCourse } from "../../API/courseAPI";
import {
  Box,
  Paper,
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseTitle: "",
    startAt: "",
    location: "",
    description: "",
    endAt: "",
    topics: [],
    courseType: "Online",
    studentsEnrolled: "",
    duration: "",
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseById(id);
        setFormData(res.data);
      } catch (err) {
        console.error("Failed to load course:", err);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const start = new Date(formData.startAt);
    const end = new Date(formData.endAt);
    try {
      await updateCourse(id, formData);
      if (end <= start) {
        toast.error("End date must be after start date!");
      } else {
        toast.success("Course updated successfully!");
        setTimeout(() => {
          navigate("/CompanyDashboard");
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to update course:", err);
      toast.error("Something went wrong while updating!");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: 500,
          backgroundColor: "white",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              marginBottom: 3,
              color: "black",
              fontWeight: "bold",
            }}
          >
            Edit Course
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Course Title"
              name="courseTitle"
              value={formData.courseTitle}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Start At"
              name="startAt"
              type="date"
              value={formData.startAt.split("T")[0]}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="End At"
              name="endAt"
              type="date"
              value={formData.endAt.split("T")[0]}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Course Type"
              name="courseType"
              value={formData.courseType}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Company">Company</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
            </TextField>

            <TextField
              type="number"
              label="studentsEnrolled"
              name="studentsEnrolled"
              value={formData.studentsEnrolled}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              type="text"
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
            <TextField
              label="Topics"
              name="topics"
              value={formData.topics ? formData.topics.join(", ") : ""}
              onChange={(e) => {
                const input = e.target.value;

                const topics = input
                  .split(",")
                  .map((t) => t.trim())
                  .filter((t) => t);

                setFormData({
                  ...formData,
                  topics: topics,
                });
              }}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "black",
                color: "white",
                padding: 1.5,
                fontSize: "16px",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              Update Course
            </Button>
          </form>
          <ToastContainer
            position="top-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Container>
      </Paper>
    </Box>
  );
};

export default EditCourse;
