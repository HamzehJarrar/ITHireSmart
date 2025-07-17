import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEnrolledTrainings,
  acceptParticipant,
  getAcceptedParticipants,
  rejectParticipant,
  getRejectedParticipants,
  setPendingParticipant,
} from "../../API/trainingAPI";
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

const TrainingsApplicants = () => {
  const { trainingId } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [acceptedParticipants, setAcceptedParticipants] = useState([]);
  const [rejectedParticipants, setRejectedParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const res = await getEnrolledTrainings(trainingId);
      const acceptedRes = await getAcceptedParticipants(trainingId);
      const rejectedRes = await getRejectedParticipants(trainingId);

      setParticipants(res.data);
      setAcceptedParticipants(acceptedRes.data);
      setRejectedParticipants(rejectedRes.data);
      
    } catch (error) {
      console.error("Failed to load training participants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
    console.log("Training ID from URL:", trainingId);

  }, [trainingId]);

  const confirmAction = (action, participant) => {
    setDialogAction(action);
    setSelectedParticipant(participant);
    setOpenDialog(true);
  };

  const handleConfirmedAction = async () => {
    if (!selectedParticipant || !dialogAction) return;

    try {
      if (dialogAction === "accept") {
        await acceptParticipant(trainingId, selectedParticipant._id);
      } else if (dialogAction === "reject") {
        await rejectParticipant(trainingId, selectedParticipant._id);
      } else if (dialogAction === "pending") {
        await setPendingParticipant(trainingId, selectedParticipant._id);
      }

      await fetchParticipants();
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setOpenDialog(false);
      setSelectedParticipant(null);
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

  const renderParticipantCard = (participant, type) => {
    const name = `${participant?.firstName || ""} ${
      participant?.lastName || ""
    }`;
    const email = participant?.email || "No email provided";
    const commonButtons = (
      <>
        {type !== "pending" && (
          <IconButton
            onClick={() => confirmAction("pending", participant)}
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
            onClick={() => confirmAction("accept", participant)}
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
            onClick={() => confirmAction("reject", participant)}
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
        key={participant._id}
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
              src={participant?.profilepic?.url}
              alt={name}
              sx={{ width: 56, height: 56 }}
            >
              {!participant?.profilepic?.url && name[0]}
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
              onClick={() => navigate(`/user/${participant._id}`)}
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
        Training Applicants
        <Chip
          label={`${participants.length} Pending`}
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

      {/* Pending Participants */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Pending Participants
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {participants
          .filter(
            (participant) =>
              !acceptedParticipants.some((a) => a._id === participant._id) &&
              !rejectedParticipants.some((r) => r._id === participant._id)
          )
          .map((participant) => renderParticipantCard(participant, "pending"))}
      </Box>

      {/* Accepted Participants */}
      <Divider sx={{ my: 4 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Typography variant="h5">Accepted Participants</Typography>
        <Chip
          label={`${acceptedParticipants.length} Accepted`}
          size="small"
          sx={{ bgcolor: "#e3f2fd", fontWeight: "bold" }}
        />
      </Box>
      {acceptedParticipants.length === 0 ? (
        <Typography>No accepted participants yet.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {acceptedParticipants.map((participant) =>
            renderParticipantCard(participant, "accepted")
          )}
        </Box>
      )}

      {/* Rejected Participants */}
      <Divider sx={{ my: 4 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Typography variant="h5">Rejected Participants</Typography>
        <Chip
          label={`${rejectedParticipants.length} Rejected`}
          size="small"
          sx={{ bgcolor: "#fdecea", color: "#c62828", fontWeight: "bold" }}
        />
      </Box>
      {rejectedParticipants.length === 0 ? (
        <Typography>No rejected participants yet.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {rejectedParticipants.map((participant) =>
            renderParticipantCard(participant, "rejected")
          )}
        </Box>
      )}

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to <strong>{dialogAction}</strong>{" "}
            {selectedParticipant?.firstName}?
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

export default TrainingsApplicants;
