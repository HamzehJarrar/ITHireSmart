import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEnrolledCourses,
  acceptStudent,
  getAcceptedStudents,
  rejectStudent,
  getRejectedStudents,
  setPendingStudent,
} from "../../API/courseAPI";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Container,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Mail } from "@mui/icons-material";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const CoursesApplicants = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [rejectedStudents, setRejectedStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await getEnrolledCourses(courseId);
      const acceptedRes = await getAcceptedStudents(courseId);
      const rejectedRes = await getRejectedStudents(courseId);

      setStudents(res.data);
      setAcceptedStudents(acceptedRes.data);
      setRejectedStudents(rejectedRes.data);
    } catch (error) {
      console.error("Failed to load course students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [courseId]);

  const confirmAction = (action, student) => {
    setDialogAction(action);
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const handleConfirmedAction = async () => {
    if (!selectedStudent || !dialogAction) return;

    try {
      if (dialogAction === "accept") {
        await acceptStudent(courseId, selectedStudent._id);
      } else if (dialogAction === "reject") {
        await rejectStudent(courseId, selectedStudent._id);
      } else if (dialogAction === "pending") {
        await setPendingStudent(courseId, selectedStudent._id);
      }

      await fetchStudents();
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setOpenDialog(false);
      setSelectedStudent(null);
      setDialogAction(null);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const renderStudentCard = (student, type) => {
    const name = `${student?.firstName || ""} ${student?.lastName || ""}`;
    const email = student?.email || "No email provided";
    const commonButtons = (
      <>
        {type !== "pending" && (
          <IconButton
            onClick={() => confirmAction("pending", student)}
            sx={{
              bgcolor: "#fb8c00",
              color: "white",
              "&:hover": { bgcolor: "#ef6c00" },
              width: 26,
              height: 26,
            }}
          >
            <AccessTimeIcon fontSize="small" />
          </IconButton>
        )}
        {type !== "accepted" && (
          <IconButton
            onClick={() => confirmAction("accept", student)}
            sx={{
              bgcolor: "success.main",
              color: "white",
              "&:hover": { bgcolor: "success.dark" },
              width: 26,
              height: 26,
            }}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
        )}
        {type !== "rejected" && (
          <IconButton
            onClick={() => confirmAction("reject", student)}
            sx={{
              bgcolor: "error.main",
              color: "white",
              "&:hover": { bgcolor: "error.dark" },
              width: 26,
              height: 26,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </>
    );

    return (
      <Card
        key={student._id}
        sx={{
          minWidth: 300,
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
          ...(type === "rejected" && {
            backgroundColor: "#fff8f8",
            border: "1px solid #fbcaca",
          }),
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              src={student?.profilepic?.url}
              alt={name}
              sx={{ width: 56, height: 56 }}
            >
              {!student?.profilepic?.url && name[0]}
            </Avatar>
          }
          title={
            <Typography
              fontWeight="medium"
              color={type === "rejected" ? "error" : "initial"}
            >
              {name}
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Mail fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">{email}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              size="small"
              label="Information"
              icon={<NewspaperIcon fontSize="small" />}
              variant="outlined"
              clickable
              sx={{ p: 1 }}
              onClick={() => navigate(`/user/${student._id}`)}
            />
            {commonButtons}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          mb: 3,
          borderBottom: "2px solid #f0f0f0",
          pb: 2,
        }}
      >
        Course Applicants
        <Chip
          label={`${students.length} Pending`}
          size="small"
          sx={{ ml: 2, bgcolor: "#e3f2fd" }}
        />
      </Typography>

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

      {/* Pending Students */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Pending Students
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {students
          .filter(
            (student) =>
              !acceptedStudents.some((a) => a._id === student._id) &&
              !rejectedStudents.some((r) => r._id === student._id)
          )
          .map((student) => renderStudentCard(student, "pending"))}
      </Box>

      {/* Accepted Students */}
      <Divider sx={{ my: 4 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Typography variant="h5">Accepted Students</Typography>
        <Chip
          label={`${acceptedStudents.length} Accepted`}
          size="small"
          sx={{ bgcolor: "#e3f2fd", fontWeight: "bold" }}
        />
      </Box>
      {acceptedStudents.length === 0 ? (
        <Typography>No accepted students yet.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {acceptedStudents.map((student) =>
            renderStudentCard(student, "accepted")
          )}
        </Box>
      )}

      {/* Rejected Students */}
      <Divider sx={{ my: 4 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Typography variant="h5">Rejected Students</Typography>
        <Chip
          label={`${rejectedStudents.length} Rejected`}
          size="small"
          sx={{ bgcolor: "#fdecea", color: "#c62828", fontWeight: "bold" }}
        />
      </Box>
      {rejectedStudents.length === 0 ? (
        <Typography>No rejected students yet.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {rejectedStudents.map((student) =>
            renderStudentCard(student, "rejected")
          )}
        </Box>
      )}

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to <strong>{dialogAction}</strong>{" "}
            {selectedStudent?.firstName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmedAction}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CoursesApplicants;
