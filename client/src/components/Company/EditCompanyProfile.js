import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { getCompanyProfile, updateCompanyProfile } from "../../API/company";

const EditCompanyProfile = () => {    
  const companyId = localStorage.getItem("companyId");
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    location: "",
    profilepic: { url: "" },
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await getCompanyProfile(companyId);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching company profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [companyId]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setUploading(true);
    const form = new FormData();
    form.append("image", imageFile);
    try {
      // const res = await uploadCompanyLogo(companyId, form);
      // setFormData((prev) => ({ ...prev, profilepic: res.data.profilepic }));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateCompanyProfile(companyId, formData);
      alert("Profile updated");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return loading ? (
    <CircularProgress />
  ) : (
    <Box>
      <Typography variant="h5">Edit Company Profile</Typography>

      <Box mt={2}>
        <Avatar
          src={formData.profilepic?.url}
          alt="Company Logo"
          sx={{ width: 80, height: 80 }}
        />
        <Button component="label" variant="outlined" sx={{ mt: 1 }}>
          Upload New Logo
          <input type="file" hidden onChange={handleImageChange} />
        </Button>
        <Button
          onClick={handleImageUpload}
          disabled={!imageFile || uploading}
          sx={{ ml: 2 }}
        >
          {uploading ? "Uploading..." : "Save Image"}
        </Button>
      </Box>

      <TextField
        label="Company Name"
        fullWidth
        margin="normal"
        value={formData.companyName}
        onChange={(e) =>
          setFormData({ ...formData, companyName: e.target.value })
        }
      />

      <TextField
        label="Company Email"
        fullWidth
        margin="normal"
        value={formData.companyEmail}
        onChange={(e) =>
          setFormData({ ...formData, companyEmail: e.target.value })
        }
      />

      <TextField
        label="Location"
        fullWidth
        margin="normal"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
      />

      <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditCompanyProfile;
