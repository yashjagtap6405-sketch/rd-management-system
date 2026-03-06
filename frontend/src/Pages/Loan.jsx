import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Typography, Button, Box, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Paper, Drawer, AppBar, Toolbar,
  IconButton, CircularProgress
} from "@mui/material";
import {
  Dashboard as DashboardIcon, AccountBalance, Logout, Shield,
  Menu as MenuIcon, VerifiedUser, ErrorOutline
} from "@mui/icons-material";

// ==========================================
// CONSTANTS & STYLES
// ==========================================
const SIDEBAR_WIDTH = 260;
const NAVY_BLUE = "#154360";
const NAVY_BLUE_HOVER = "#0e314a";

const primaryButtonStyle = {
  bgcolor: NAVY_BLUE,
  color: "white",
  boxShadow: "none",
  textTransform: "none",
  fontWeight: "bold",
  borderRadius: 3,
  px: 4,
  py: 1.5,
  fontSize: "1.1rem",
  "&:hover": {
    bgcolor: NAVY_BLUE_HOVER,
    boxShadow: "0 4px 12px rgba(21,67,96,0.2)"
  }
};

export default function Loan() {
  const navigate = useNavigate();
  const location = useLocation();
  const rdId = localStorage.getItem("rdId");

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  // 1. UI Control State
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // 2. Data State
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLERS & API LOGIC
  // ==========================================
  
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const checkLoanEligibility = async () => {
    if (!rdId) {
      alert("RD Account not found");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/rd/${rdId}/loan-eligibility`);
      setLoanData(res.data);
    } catch (err) {
      alert(err.response?.data || "Failed to check loan eligibility");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RENDER HELPERS (Breaks down the UI)
  // ==========================================

  const renderSidebarContent = () => (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5, borderBottom: "1px solid #eef2f6" }}>
        <Shield sx={{ color: NAVY_BLUE, fontSize: 32 }} />
        <Typography variant="h6" fontWeight="800" sx={{ color: NAVY_BLUE, letterSpacing: "-0.5px" }}>
          RD Secure
        </Typography>
      </Box>
      <List sx={{ px: 2, mt: 2, flexGrow: 1 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton onClick={() => navigate("/dashboard")} sx={{ borderRadius: 3, py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><DashboardIcon sx={{ color: "#9ca3af" }} /></ListItemIcon>
            <ListItemText primary="Dashboard" primaryTypographyProps={{ color: "text.secondary", fontWeight: "600" }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton selected={location.pathname === "/loan"} sx={{ borderRadius: 3, py: 1.5, "&.Mui-selected": { bgcolor: `${NAVY_BLUE}15` } }}>
            <ListItemIcon sx={{ minWidth: 40 }}><AccountBalance sx={{ color: NAVY_BLUE }} /></ListItemIcon>
            <ListItemText primary="Get Loan" primaryTypographyProps={{ fontWeight: "bold", color: NAVY_BLUE }} />
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ p: 3 }}>
        <Button startIcon={<Logout />} fullWidth onClick={handleLogout} sx={{ color: "#d32f2f", fontWeight: "bold", py: 1.5, borderRadius: 3, "&:hover": { bgcolor: "#ffebee" } }}>
          Logout Account
        </Button>
      </Box>
    </Box>
  );

  const renderInitialPrompt = () => (
    <>
      <Box sx={{ bgcolor: "#eef2f6", p: 3, borderRadius: "50%", mb: 3 }}>
        <AccountBalance sx={{ fontSize: 50, color: NAVY_BLUE }} />
      </Box>
      <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
        Check Loan Eligibility
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
        We will securely analyze your RD account tier and successful transaction history to determine your approved limit.
      </Typography>
      
      <Button 
        variant="contained" 
        size="large" 
        onClick={checkLoanEligibility} 
        disabled={loading} 
        sx={primaryButtonStyle}
      >
        {loading ? <CircularProgress size={26} color="inherit" /> : "Verify Eligibility Now"}
      </Button>
    </>
  );

  const renderLoanResult = () => {
    if (loanData.eligible) {
      return (
        <>
          <VerifiedUser sx={{ fontSize: 60, color: "#2e7d32", mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#2e7d32", mb: 1 }}>Pre-Approved!</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Congratulations! Based on your RD history, you are eligible for a loan.
          </Typography>
          
          <Box sx={{ bgcolor: "#f4fcf6", border: "1px solid #c8e6c9", borderRadius: 3, p: 4, mb: 4 }}>
            <Typography variant="overline" fontWeight="bold" color="text.secondary" sx={{ letterSpacing: 1 }}>
              APPROVED LOAN RANGE
            </Typography>
            <Typography variant="h3" fontWeight="900" sx={{ color: "#1b5e20", mt: 1 }}>
              ₹{loanData.minLoanAmount.toLocaleString()} - ₹{loanData.maxLoanAmount.toLocaleString()}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ mb: 3 }}>
            Please contact <span style={{ color: NAVY_BLUE }}>1800-XXX-XX65</span> to process your application.
          </Typography>
        </>
      );
    }

    return (
      <>
        <ErrorOutline sx={{ fontSize: 60, color: "#c62828", mb: 2 }} />
        <Typography variant="h5" fontWeight="bold" sx={{ color: "#c62828", mb: 1 }}>Not Eligible Yet</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {loanData.message}
        </Typography>
        <Button variant="outlined" onClick={() => setLoanData(null)} sx={{ fontWeight: "bold", borderRadius: 2 }}>
          Check Again Later
        </Button>
      </>
    );
  };

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      
      {/* APP BAR (Mobile) */}
      <AppBar position="fixed" elevation={0} sx={{ display: { md: "none" }, bgcolor: "white", borderBottom: "1px solid #eef2f6" }}>
        <Toolbar>
          <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, color: NAVY_BLUE }}>
            <MenuIcon />
          </IconButton>
          <Shield sx={{ color: NAVY_BLUE, mr: 1 }} />
          <Typography variant="h6" fontWeight="bold" color={NAVY_BLUE}>RD Secure</Typography>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR NAVIGATION */}
      <Box component="nav" sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: SIDEBAR_WIDTH, borderRight: "none", boxShadow: "4px 0 24px rgba(0,0,0,0.05)" } }}>
          {renderSidebarContent()}
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: SIDEBAR_WIDTH, borderRight: "1px solid #eef2f6" } }} open>
          {renderSidebarContent()}
        </Drawer>
      </Box>

      {/* MAIN CONTENT AREA */}
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, pt: { xs: 10, md: 5 }, display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        <Box sx={{ width: "100%", maxWidth: 800, mt: 4 }}>
          <Typography variant="h4" fontWeight="900" sx={{ color: NAVY_BLUE, mb: 1, textAlign: "center" }}>
            Loan Center
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mb: 5 }}>
            Leverage your active Recurring Deposit to get an instant, low-interest secured loan.
          </Typography>

          <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, boxShadow: "0 20px 40px rgba(0,0,0,0.04)", border: "1px solid #eef2f6", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            
            {/* Conditional Rendering logic is completely isolated to the helper functions */}
            {!loanData ? (
              renderInitialPrompt()
            ) : (
              <Box sx={{ width: "100%", animation: "fadeIn 0.5s" }}>
                {renderLoanResult()}
              </Box>
            )}

          </Paper>
        </Box>
      </Box>
      
    </Box>
  );
}