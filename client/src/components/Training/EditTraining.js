import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTrainingById, updateTraining } from "../../API/trainingAPI";
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

const EditTraining = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    trainingTitle: "",
    startAt: "",
    location: "",
    trainingDescription: "",
    endAt: "",
    topicsCovered: [],
    trainingType: "Online",
    Duration: "",
    companyName: "",
    capacity: "",
    Requirements: [],
  });

  const [requirementsText, setRequirementsText] = useState("");
  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const res = await getTrainingById(id);
        const data = res.data;

        setFormData({
          ...data,
          startAt: data.startAt ? data.startAt.split("T")[0] : "",
          endAt: data.endAt ? data.endAt.split("T")[0] : "",
          topicsCovered: Array.isArray(data.topicsCovered)
            ? data.topicsCovered
            : [],
          Requirements: Array.isArray(data.Requirements)
            ? data.Requirements
            : [],
        });

        setRequirementsText(
          Array.isArray(data.Requirements) ? data.Requirements.join(", ") : ""
        );
      } catch (err) {
        console.error("Failed to load training:", err);
        toast.error("Failed to load training data.");
      }
    };

    fetchTraining();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTopicsChange = (e) => {
    const input = e.target.value;
    const topics = input
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    setFormData((prev) => ({ ...prev, topicsCovered: topics }));
  };

  const handleRequirementsChange = (e) => {
    const input = e.target.value;
    setRequirementsText(input);

    const requirements = input
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    setFormData((prev) => ({ ...prev, Requirements: requirements }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const start = new Date(formData.startAt);
    const end = new Date(formData.endAt);

    if (end <= start) {
      toast.error("End date must be after start date!");
      return;
    }

    try {
      await updateTraining(id, formData);
      toast.success("Training updated successfully!");
      setTimeout(() => {
        navigate("/CompanyDashboard");
      }, 2000);
    } catch (err) {
      console.error("Failed to update training:", err);
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
            Edit Training
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Training Title"
              name="trainingTitle"
              value={formData.trainingTitle}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Start At"
              name="startAt"
              type="date"
              value={formData.startAt}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split("T")[0] }}
            />
            <TextField
              label="End At"
              name="endAt"
              type="date"
              value={formData.endAt}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Training Type"
              name="trainingType"
              value={formData.trainingType}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Company">Company</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </TextField>

            <TextField
              type="text"
              label="Duration"
              name="Duration"
              value={formData.Duration}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              type="number"
              label="Capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />

            <TextField
              label="Training Description"
              name="trainingDescription"
              value={formData.trainingDescription}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />

            <TextField
              label="Topics Covered (comma separated)"
              name="topicsCovered"
              value={formData.topicsCovered.join(", ")}
              onChange={handleTopicsChange}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />

            <TextField
              label="Requirements (comma separated)"
              name="Requirements"
              value={requirementsText}
              onChange={handleRequirementsChange}
              fullWidth
              multiline
              rows={3}
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
                marginTop: 2,
              }}
            >
              Update Training
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

export default EditTraining;
