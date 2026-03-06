import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box, TextField, Button, Typography, Checkbox, FormControlLabel,
  Paper, InputAdornment, Link as MuiLink, Dialog, DialogTitle,
  DialogContent, DialogActions, Divider
} from "@mui/material";
import {
  Shield, CreditCardOutlined, BadgeOutlined,
  PersonOutline, LocationOnOutlined
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
  mb: 3,
  "&:hover": { bgcolor: "#0e314a" },
  "&.Mui-disabled": { bgcolor: "#cfd8dc", color: "#fff" }
};

export default function Registration() {
  const navigate = useNavigate();

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [form, setForm] = useState({
    adharno: "",
    acno: "",
    fullname: "",
    city: "",
    termsAccepted: false
  });

  const [openTerms, setOpenTerms] = useState(false);

  // ==========================================
  // HANDLERS & API LOGIC
  // ==========================================
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.termsAccepted) {
      alert("You must accept Terms & Conditions");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert("Registered successfully");
        navigate("/");
      } else {
        const msg = await res.text();
        alert(msg || "Registration failed");
      }
    } catch (err) {
      alert("Failed to connect to the server.");
    }
  };

  const handleOpenTerms = (e) => {
    e.preventDefault(); 
    setOpenTerms(true);
  };

  const handleCloseTerms = () => setOpenTerms(false);

  const handleAcceptTermsInsideModal = () => {
    setForm((prev) => ({ ...prev, termsAccepted: true }));
    setOpenTerms(false);
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

  const renderRegistrationForm = () => (
    <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: 3, width: "100%", maxWidth: 500, boxShadow: "0 10px 40px rgba(0,0,0,0.06)", border: "1px solid #eef2f6", bgcolor: "white" }}>
      
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" fontWeight="800" sx={{ color: "#111", mb: 1 }}>Sign up to RD Account</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
          Enter your details to create an RD account
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        
        {/* Aadhaar Input */}
        <Box mb={2.5}>
          <Typography variant="caption" fontWeight="bold" sx={{ color: "#555", ml: 0.5 }}>Aadhaar Number *</Typography>
          <TextField
            fullWidth placeholder="12-digit UIDAI Number" name="adharno"
            value={form.adharno} onChange={handleChange} required size="small" sx={{ mt: 0.5 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><BadgeOutlined sx={{ color: "action.active", fontSize: 20 }} /></InputAdornment>,
              sx: { borderRadius: 2 }
            }}
          />
        </Box>

        {/* Account Number Input */}
        <Box mb={2.5}>
          <Typography variant="caption" fontWeight="bold" sx={{ color: "#555", ml: 0.5 }}>Account Number *</Typography>
          <TextField
            fullWidth placeholder="Enter your RD account number" name="acno"
            value={form.acno} onChange={handleChange} required size="small" sx={{ mt: 0.5 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><CreditCardOutlined sx={{ color: "action.active", fontSize: 20 }} /></InputAdornment>,
              sx: { borderRadius: 2 }
            }}
          />
        </Box>

        {/* Full Name Input */}
        <Box mb={2.5}>
          <Typography variant="caption" fontWeight="bold" sx={{ color: "#555", ml: 0.5 }}>Full Name *</Typography>
          <TextField
            fullWidth placeholder="Enter full legal name" name="fullname"
            value={form.fullname} onChange={handleChange} required size="small" sx={{ mt: 0.5 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><PersonOutline sx={{ color: "action.active", fontSize: 20 }} /></InputAdornment>,
              sx: { borderRadius: 2 }
            }}
          />
        </Box>

        {/* City Input */}
        <Box mb={3}>
          <Typography variant="caption" fontWeight="bold" sx={{ color: "#555", ml: 0.5 }}>City *</Typography>
          <TextField
            fullWidth placeholder="Primary city of residence" name="city"
            value={form.city} onChange={handleChange} required size="small" sx={{ mt: 0.5 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><LocationOnOutlined sx={{ color: "action.active", fontSize: 20 }} /></InputAdornment>,
              sx: { borderRadius: 2 }
            }}
          />
        </Box>

        {/* Terms Checkbox Area */}
        <Box sx={{ bgcolor: "#f8fafc", p: 2, borderRadius: 2, mb: 3, border: "1px solid #eef2f6" }}>
          <FormControlLabel
            control={
              <Checkbox name="termsAccepted" checked={form.termsAccepted} onChange={handleChange} size="small" sx={{ color: NAVY_BLUE, '&.Mui-checked': { color: NAVY_BLUE } }} />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                I accept the <MuiLink component="button" type="button" onClick={handleOpenTerms} sx={{ color: NAVY_BLUE, fontWeight: 'bold', textDecoration: "none" }}>Terms & Conditions</MuiLink> of RD Account services.
              </Typography>
            }
          />
        </Box>

        <Button type="submit" fullWidth variant="contained" disabled={!form.termsAccepted} sx={primaryButtonStyle}>
          REGISTER
        </Button>

        <Typography textAlign="center">
          <RouterLink to="/" style={{ color: NAVY_BLUE, fontWeight: 700, fontSize: "0.85rem", letterSpacing: 0.5, textDecoration: "none", textTransform: "uppercase" }}>
            ALREADY HAVE AN ACCOUNT? LOGIN HERE
          </RouterLink>
        </Typography>
      </Box>
    </Paper>
  );

  const renderTermsModal = () => (
    <Dialog open={openTerms} onClose={handleCloseTerms} maxWidth="md" fullWidth scroll="paper" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: '900', color: NAVY_BLUE, pb: 1 }}>
        नियम व अटी / Terms & Conditions
      </DialogTitle>
      <DialogContent dividers sx={{ py: 3 }}>
        
        {/* Marathi Section */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: NAVY_BLUE }}>मराठी</Typography>
        <Typography variant="body2" paragraph color="text.secondary">१) R.D. ची रक्कम ही पूर्ण बारा महिने ठेवावी लागेल.</Typography>
        <Typography variant="body2" paragraph color="text.secondary">२) R.D. ची रक्कम दिलेल्या दर महिन्याच्या तारखेला भरणे बंधनकारक आहे. तारीख चुकल्यास पन्नास रुपये दिवसाप्रमाणे वाढत जातील.</Typography>
        <Typography variant="body2" paragraph color="text.secondary">३) सुरु केलेले R.D. चे खाते मध्येच बंद करता येणार नाही. बंद केल्यास जमा असलेली रक्कम बारा महिने कालावधी (५०%) पन्नास टक्के कमी करुन मिळेल.</Typography>
        <Typography variant="body2" paragraph color="text.secondary">४) आपल्या संस्थेच्या माध्यमातून मिळणारे कर्ज हे फक्त R.D. धारकांनाच मिळेल व R.D. खाते सहा महिने जुने व चालु असावे.</Typography>
        <Typography variant="body2" paragraph color="text.secondary">५) कर्ज घेण्यासाठी दोन जामिनदार हे R.D. धारकाचे असावे.</Typography>
        <Box sx={{ pl: 4, mb: 2, color: "text.secondary" }}>
          <Typography variant="body2" fontWeight="bold">• R.D. रक्कम १००० - कर्ज रक्कम १०,०००</Typography>
          <Typography variant="body2" fontWeight="bold">• R.D. रक्कम २००० - कर्ज रक्कम २०,०००</Typography>
          <Typography variant="body2" fontWeight="bold">• R.D. रक्कम ३००० - कर्ज रक्कम ३० ते ५०,०००</Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 'bold', fontStyle: 'italic', mb: 4, color: "#333" }}>
          मी सही करणार, मला वरील नियम व अटी मान्य आहे. मला ही योजना करण्यास कोणीही जबरदस्ती व आग्रह केलेला नाही. मी माझ्या स्वेच्छेने ही योजना करत आहे.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* English Section */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: NAVY_BLUE }}>English</Typography>
        <Typography variant="body2" paragraph color="text.secondary">1) The R.D. amount must be kept for a full twelve months.</Typography>
        <Typography variant="body2" paragraph color="text.secondary">2) It is mandatory to pay the R.D. amount on the designated date every month. If the date is missed, a penalty of 50 rupees per day will be added.</Typography>
        <Typography variant="body2" paragraph color="text.secondary">3) An active R.D. account cannot be closed prematurely. If closed, only 50% of the deposited amount will be refunded for the twelve-month period.</Typography>
        <Typography variant="body2" paragraph color="text.secondary">4) Loans provided through our institution will exclusively be available to R.D. holders. The R.D. account must be active and at least six months old.</Typography>
        <Typography variant="body2" paragraph color="text.secondary">5) To avail of a loan, two guarantors must also be R.D. account holders.</Typography>
        <Box sx={{ pl: 4, mb: 2, color: "text.secondary" }}>
          <Typography variant="body2" fontWeight="bold">• R.D. Amount 1000 - Loan Amount 10,000</Typography>
          <Typography variant="body2" fontWeight="bold">• R.D. Amount 2000 - Loan Amount 20,000</Typography>
          <Typography variant="body2" fontWeight="bold">• R.D. Amount 3000 - Loan Amount 30,000 to 50,000</Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 'bold', fontStyle: 'italic', color: "#333" }}>
          I, the undersigned, accept the above rules and conditions. No one has forced or pressured me to join this scheme. I am participating in this scheme voluntarily.
        </Typography>

      </DialogContent>
      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button onClick={handleCloseTerms} sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Cancel</Button>
        <Button onClick={handleAcceptTermsInsideModal} variant="contained" sx={{ bgcolor: NAVY_BLUE, fontWeight: "bold", borderRadius: 2, px: 3, "&:hover": { bgcolor: "#0e314a" } }}>
          Accept Terms
        </Button>
      </DialogActions>
    </Dialog>
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

      <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
        {renderRegistrationForm()}
      </Box>

      {renderFooter()}
      
      {renderTermsModal()}

    </Box>
  );
}