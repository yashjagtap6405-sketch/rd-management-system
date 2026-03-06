import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box, TextField, Button, Typography, Paper, Checkbox,
  FormControlLabel, InputAdornment, Divider, Link as MuiLink
} from "@mui/material";
import {
  Shield, PersonOutline, LockOutlined,
  VerifiedUserOutlined, GppGoodOutlined
} from "@mui/icons-material";

// ==========================================
// CONSTANTS & STYLES
// ==========================================
const NAVY_BLUE = "#154360";

const primaryButtonStyle = {
  py: 1.5,
  bgcolor: NAVY_BLUE,
  fontSize: "1rem",
  fontWeight: "bold",
  textTransform: "none",
  borderRadius: 2,
  "&:hover": { bgcolor: "#0e314a" }
};

export default function Login() {
  const navigate = useNavigate();

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [form, setForm] = useState({
    adharno: "",
    acno: ""
  });

  // ==========================================
  // HANDLERS & API LOGIC
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        const user = await res.json();
        console.log("Logged in user:", user);

        localStorage.setItem("userId", user.userId);
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/dashboard");
      } else {
        alert("Invalid Aadhaar or Account Number");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Network error occurred during login.");
    }
  };

  // ==========================================
  // RENDER HELPERS (Breaks down the UI)
  // ==========================================

  const renderHeader = () => (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
      <Shield sx={{ color: NAVY_BLUE, fontSize: 28 }} />
      <Typography variant="h6" fontWeight="bold" sx={{ color: NAVY_BLUE }}>
        RD Account Secure Access
      </Typography>
    </Box>
  );

  const renderLoginForm = () => (
    <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, width: "100%", maxWidth: 450, boxShadow: "0 10px 40px rgba(0,0,0,0.06)", border: "1px solid #eef2f6", bgcolor: "white" }}>
      
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" fontWeight="800" sx={{ color: "#111", mb: 1 }}>Sign in to RD Account</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
          Enter your Aadhaar and Account number to securely access your portal
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleLogin}>
        
        {/* Aadhaar Input */}
        <Box mb={3}>
          <Typography variant="caption" fontWeight="bold" sx={{ color: "#555", ml: 0.5, display: 'flex', alignItems: 'center' }}>
            <VerifiedUserOutlined sx={{ fontSize: 16, mr: 0.5 }} /> Aadhaar Number *
          </Typography>
          <TextField
            fullWidth
            placeholder="0000 0000 0000"
            name="adharno"
            value={form.adharno}
            onChange={handleChange}
            required
            size="small"
            sx={{ mt: 0.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline sx={{ color: "action.active" }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
          />
        </Box>

        {/* Account Input */}
        <Box mb={2}>
          <Typography variant="caption" fontWeight="bold" sx={{ color: "#555", ml: 0.5, display: 'flex', alignItems: 'center' }}>
            <LockOutlined sx={{ fontSize: 16, mr: 0.5 }} /> Account Number *
          </Typography>
          <TextField
            fullWidth
            type="password"
            placeholder="Enter your account number"
            name="acno"
            value={form.acno}
            onChange={handleChange}
            required
            size="small"
            sx={{ mt: 0.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: "action.active" }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
          />
        </Box>

        {/* Remember Me & Forgot Details */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} ml={1}>
          <FormControlLabel
            control={<Checkbox size="small" sx={{ color: NAVY_BLUE, '&.Mui-checked': { color: NAVY_BLUE } }} />}
            label={<Typography variant="body2" color="text.secondary">Remember Me</Typography>}
          />
          <MuiLink href="#" underline="none" variant="body2" sx={{ color: NAVY_BLUE, fontWeight: "bold" }}>
            Forgot Details?
          </MuiLink>
        </Box>

        <Button type="submit" fullWidth variant="contained" sx={primaryButtonStyle}>
          LOGIN
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography textAlign="center" variant="body2" color="text.secondary">
          Don't have an account?{" "}
          <RouterLink to="/register" style={{ color: NAVY_BLUE, fontWeight: 700, textDecoration: "none" }}>
            Register
          </RouterLink>
        </Typography>
      </Box>
    </Paper>
  );

  const renderFooter = () => (
    <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(238, 242, 246, 0.8)", color: "text.secondary", fontSize: "0.8rem", px: { xs: 2, md: 10 } }}>
      <Typography variant="caption">© 2026 RD Account Secure Access. All rights reserved.</Typography>
      <Box sx={{ display: "flex", gap: 3 }}>
        <Typography variant="caption" sx={{ cursor: "pointer", "&:hover": { color: NAVY_BLUE } }}>Privacy Policy</Typography>
        <Typography variant="caption" sx={{ cursor: "pointer", "&:hover": { color: NAVY_BLUE } }}>Terms of Service</Typography>
      </Box>
    </Box>
  );

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f4f7f9", background: "linear-gradient(135deg, #f4f7f9 0%, #e0e8f0 100%)" }}>
      
      {renderHeader()}

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 2 }}>
        
        {renderLoginForm()}

        {/* Security Badge */}
        <Typography variant="caption" sx={{ mt: 3, display: "flex", alignItems: "center", color: "#778ca3", fontWeight: "bold" }}>
          <GppGoodOutlined sx={{ fontSize: 18, mr: 0.5 }} /> End-to-End Encrypted Secure Access
        </Typography>
      </Box>

      {renderFooter()}

    </Box>
  );
}