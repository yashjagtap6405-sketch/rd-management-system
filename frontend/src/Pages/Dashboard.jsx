import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Typography, Button, Box, Modal, TextField, Paper, Table, TableBody,
  TableCell, TableHead, TableRow, Grid, Chip, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Snackbar, Alert, Drawer, AppBar, Toolbar, IconButton, CircularProgress
} from "@mui/material";
import {
  Dashboard as DashboardIcon, AccountBalanceWallet, Assessment, Logout, Add,
  TrendingUp, AccountBalance, Shield, PersonOutline, CreditCard, VerifiedUser, Menu as MenuIcon
} from "@mui/icons-material";

// ==========================================
// CONSTANTS & STYLES
// ==========================================
const SIDEBAR_WIDTH = 260;
const NAVY_BLUE = "#154360";
const NAVY_BLUE_HOVER = "#0e314a";

const cardStyle = {
  p: 3,
  borderRadius: 4,
  boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
  border: "1px solid rgba(238, 242, 246, 0.8)",
  bgcolor: "white"
};

const highlightCardStyle = {
  ...cardStyle,
  bgcolor: NAVY_BLUE,
  color: "white",
  boxShadow: "0 10px 30px rgba(21, 67, 96, 0.2)",
};

const primaryButtonStyle = {
  bgcolor: NAVY_BLUE,
  color: "white",
  boxShadow: "none",
  textTransform: "none",
  fontWeight: "bold",
  borderRadius: 2,
  px: 3,
  py: 1.2,
  "&:hover": {
    bgcolor: NAVY_BLUE_HOVER,
    boxShadow: "0 4px 12px rgba(21,67,96,0.2)"
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [user, setUser] = useState(null);
  const [rdAccount, setRdAccount] = useState(null);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [payoutData, setPayoutData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [form, setForm] = useState({
    address: "", mobile: "", dob: "", gender: "", rdStartDate: "", rdAmount: "", panNo: "", occupation: ""
  });

  // ==========================================
  // API CALLS & EFFECTS
  // ==========================================
  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    fetchUser();
    fetchRdAccount();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/user/${userId}`);
      setUser(res.data);
    } catch (error) {
      console.error("Failed to load user");
    }
  };

  const fetchRdAccount = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/rd/user/${userId}`);
      setRdAccount(res.data);
      setLoading(false);
      
      if (res.data?.rid) localStorage.setItem("rdId", res.data.rid);
      if (res.data?.active) fetchTransactions(res.data.rid);
      else setTransactions([]);

    } catch (err) {
      if (err.response?.status === 404) setRdAccount(null);
      setLoading(false);
    }
  };

  const fetchTransactions = async (rdAccountId) => {
    try {
      const [summaryRes, historyRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/rd/transaction/summary/${rdAccountId}`),
        axios.get(`http://localhost:8080/api/rd/transaction/history/${rdAccountId}`)
      ]);
      setSummary(summaryRes.data);
      setTransactions(historyRes.data);
    } catch (error) {
      console.error("Failed to fetch transactions");
    }
  };

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleCloseSnackbar = (event, reason) => {
    if (reason !== "clickaway") setSnackbar({ ...snackbar, open: false });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleCreateRD = async () => {
    try {
      await axios.post(`http://localhost:8080/api/rd/create/${userId}`, form);
      setOpenModal(false);
      fetchRdAccount();
      showSnackbar("RD Account created successfully!", "success");
    } catch {
      showSnackbar("Failed to create RD account. Please try again.", "error");
    }
  };

  const handleGetPayout = () => {
    if (!rdAccount) return;
    const totalPaid = summary?.totalAmountPaid || 0;
    const estimatedInterest = totalPaid * 0.07; 
    setPayoutData({ closureType: "ESTIMATED MATURITY", payoutAmount: Math.round(totalPaid + estimatedInterest) });
    setPayoutDialogOpen(true);
  };

  // MODIFIED: Logic to check for 12 transactions before allowing payout
  const handleConfirmMaturityPayout = async () => {
    const completedTransactions = summary?.totalTransactions || 0;

    if (completedTransactions < 12) {
      showSnackbar("Minimum 12 deposits required for maturity payout.", "error");
      setPayoutDialogOpen(false);
      return;
    }

    try {
      const res = await axios.post(`http://localhost:8080/api/rd/${rdAccount.rid}/payout`);
      showSnackbar(`Maturity payout of ₹${res.data.payoutAmount} added successfully!`, "success");
      resetPayoutState();
      fetchRdAccount(); 
    } catch (err) {
      showSnackbar(err.response?.data || "Failed to apply payout.", "error");
    }
  };

  const confirmCloseAccount = async () => {
    setConfirmOpen(false);
    try {
      const res = await axios.post(`http://localhost:8080/api/rd/${rdAccount.rid}/close`);
      showSnackbar(`Account Closed! Final Payout: ₹${res.data.payoutAmount}`, "success");
      fetchRdAccount();
      setTransactions([]);
    } catch (err) {
      showSnackbar(err.response?.data || "An unexpected error occurred.", "error");
    }
  };

  const showSnackbar = (message, severity) => setSnackbar({ open: true, message, severity });
  const resetPayoutState = () => {
    setPayoutDialogOpen(false);
    setTransactions([]);
    setSummary(null);
  };

  const getStatusChip = (status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
      case "COMPLETED": return <Chip label="Completed" size="small" sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: "bold" }} />;
      case "PENDING": return <Chip label="Pending" size="small" sx={{ bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: "bold" }} />;
      case "FAILED":
      case "REJECTED": return <Chip label="Rejected" size="small" sx={{ bgcolor: "#ffebee", color: "#c62828", fontWeight: "bold" }} />;
      default: return <Chip label={status} size="small" />;
    }
  };

  // ==========================================
  // RENDER HELPERS
  // ==========================================
  const renderSidebarContent = () => (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5, borderBottom: "1px solid #eef2f6" }}>
        <Shield sx={{ color: NAVY_BLUE, fontSize: 32 }} />
        <Typography variant="h6" fontWeight="800" sx={{ color: NAVY_BLUE, letterSpacing: "-0.5px" }}>RD Secure</Typography>
      </Box>
      <List sx={{ px: 2, mt: 2, flexGrow: 1 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton selected={location.pathname === "/dashboard"} onClick={() => navigate("/dashboard")} sx={{ borderRadius: 3, py: 1.5, "&.Mui-selected": { bgcolor: `${NAVY_BLUE}15` } }}>
            <ListItemIcon sx={{ minWidth: 40 }}><DashboardIcon sx={{ color: NAVY_BLUE }} /></ListItemIcon>
            <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: "bold", color: NAVY_BLUE }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton onClick={() => navigate("/loan")} sx={{ borderRadius: 3, py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><AccountBalance sx={{ color: "#9ca3af" }} /></ListItemIcon>
            <ListItemText primary="Get Loan" primaryTypographyProps={{ color: "text.secondary", fontWeight: "600" }} />
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ p: 3 }}>
        <Button startIcon={<Logout />} fullWidth onClick={handleLogout} sx={{ color: "#d32f2f", fontWeight: "bold", py: 1.5, borderRadius: 3, "&:hover": { bgcolor: "#ffebee" } }}>
          Logout
        </Button>
      </Box>
    </Box>
  );

  const renderUserDetailsCard = () => (
    <Paper elevation={0} sx={{ ...cardStyle, mb: 4, display: "flex", flexWrap: "wrap", alignItems: "center", gap: { xs: 3, md: 6 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ bgcolor: `${NAVY_BLUE}15`, p: 1.5, borderRadius: 3 }}>
          <PersonOutline sx={{ color: NAVY_BLUE, fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="caption" fontWeight="bold" color="text.secondary">ACCOUNT HOLDER</Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ color: NAVY_BLUE }}>{user?.fullName || user?.fullname}</Typography>
        </Box>
      </Box>
      <Box>
        <Typography variant="caption" fontWeight="bold" color="text.secondary">CITY</Typography>
        <Typography variant="body1" fontWeight="bold" sx={{ color: NAVY_BLUE }}>{user?.city}</Typography>
      </Box>
      <Box>
        <Typography variant="caption" fontWeight="bold" color="text.secondary">AADHAAR</Typography>
        <Typography variant="body1" fontWeight="bold" sx={{ color: NAVY_BLUE }}>•••• •••• {user?.adharno?.slice(-4)}</Typography>
      </Box>
    </Paper>
  );

  const renderEmptyState = () => (
    <Paper elevation={0} sx={{ p: 8, textAlign: "center", borderRadius: 4, border: "2px dashed #cfd8dc", bgcolor: "transparent" }}>
      <AccountBalanceWallet sx={{ fontSize: 60, color: "#b0bec5", mb: 2 }} />
      <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>No Active RD Account</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: "auto" }}>
        Start growing your savings today by opening a secure Recurring Deposit account with us.
      </Typography>
      <Button variant="contained" size="large" startIcon={<Add />} onClick={() => setOpenModal(true)} sx={primaryButtonStyle}>
        Create RD Account
      </Button>
    </Paper>
  );

  const renderTransactionsTable = () => (
    <Paper elevation={0} sx={{ ...cardStyle, p: 0, overflow: "hidden" }}>
      <Box sx={{ p: 3, borderBottom: "1px solid #eef2f6", bgcolor: "#fcfcfd" }}>
        <Typography variant="h6" fontWeight="bold" color={NAVY_BLUE}>Transaction History</Typography>
      </Box>
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Period</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Penalty</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.tid} sx={{ "&:last-child td, &:last-child th": { border: 0 }, "&:hover": { bgcolor: "#f8fafc" } }}>
                <TableCell>{tx.transactionDate}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{tx.transactionMonth}/{tx.transactionYear}</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: NAVY_BLUE }}>₹{tx.amount}</TableCell>
                <TableCell>₹{tx.penaltyAmount}</TableCell>
                <TableCell>{getStatusChip(tx.status)}</TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>No transactions found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      
      {/* APP BAR (Mobile) */}
      <AppBar position="fixed" elevation={0} sx={{ display: { md: "none" }, bgcolor: "white", borderBottom: "1px solid #eef2f6" }}>
        <Toolbar>
          <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, color: NAVY_BLUE }}><MenuIcon /></IconButton>
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
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, pt: { xs: 10, md: 5 }, maxWidth: "1200px", margin: "0 auto" }}>
        <Box sx={{ mb: 4 }}><Typography variant="h4" fontWeight="800" sx={{ color: NAVY_BLUE, mb: 0.5 }}>User Dashboard</Typography></Box>

        {user && renderUserDetailsCard()}

        {!rdAccount ? renderEmptyState() : (
          <>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: NAVY_BLUE, mb: 2 }}>Account Summary</Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={0} sx={cardStyle}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Monthly RD Amount</Typography>
                    <Box sx={{ bgcolor: "#f3f4f6", p: 1, borderRadius: 2 }}><AccountBalanceWallet sx={{ color: NAVY_BLUE, fontSize: 20 }} /></Box>
                  </Box>
                  <Typography variant="h3" fontWeight="800" sx={{ color: NAVY_BLUE }}>₹{rdAccount.rdAmount}</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">Start Date: {rdAccount.rdStartDate}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={0} sx={highlightCardStyle}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "rgba(255,255,255,0.8)" }}>Total Amount Paid</Typography>
                    <Box sx={{ bgcolor: "rgba(255,255,255,0.2)", p: 1, borderRadius: 2 }}><TrendingUp sx={{ color: "white", fontSize: 20 }} /></Box>
                  </Box>
                  <Typography variant="h3" fontWeight="800">₹{summary?.totalAmountPaid ?? 0}</Typography>
                  <Chip label={rdAccount.active ? "ACTIVE" : "CLOSED"} size="small" sx={{ mt: 1, bgcolor: rdAccount.active ? "rgba(76, 175, 80, 0.2)" : "rgba(244, 67, 54, 0.2)", color: rdAccount.active ? "#a5d6a7" : "#ffcdd2", fontWeight: "bold" }} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={0} sx={cardStyle}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Total Transactions</Typography>
                    <Box sx={{ bgcolor: "#f3f4f6", p: 1, borderRadius: 2 }}><Assessment sx={{ color: NAVY_BLUE, fontSize: 20 }} /></Box>
                  </Box>
                  <Typography variant="h3" fontWeight="800" sx={{ color: NAVY_BLUE }}>{summary?.totalTransactions ?? 0}</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Account Details */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={8}>
                <Paper elevation={0} sx={{ ...cardStyle, display: "flex", alignItems: "center", gap: { xs: 3, md: 5 }, flexWrap: "wrap" }}>
                  <CreditCard sx={{ color: NAVY_BLUE, fontSize: 28 }} />
                  <Typography variant="subtitle2" fontWeight="bold">Holder Details</Typography>
                  <Box><Typography variant="caption" fontWeight="bold" color="text.secondary">NAME</Typography><Typography variant="body2" fontWeight="bold">{rdAccount.fullName}</Typography></Box>
                  <Box><Typography variant="caption" fontWeight="bold" color="text.secondary">ACCOUNT NO</Typography><Typography variant="body2" fontWeight="bold">{rdAccount.acno}</Typography></Box>
                  <Box><Typography variant="caption" fontWeight="bold" color="text.secondary">AADHAAR</Typography><Typography variant="body2" fontWeight="bold">{rdAccount.adharno}</Typography></Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ ...cardStyle, display: "flex", alignItems: "center", gap: 3 }}>
                  <VerifiedUser sx={{ color: NAVY_BLUE, fontSize: 28 }} />
                  <Typography variant="subtitle2" fontWeight="bold">Account Status</Typography>
                  <Chip label={rdAccount.active ? "ACTIVE" : "CLOSED"} sx={{ bgcolor: rdAccount.active ? "#e8f5e9" : "#ffebee", color: rdAccount.active ? "#2e7d32" : "#c62828", fontWeight: 800 }} />
                </Paper>
              </Grid>
            </Grid>

            {/* Actions */}
            {rdAccount.active && (
              <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button variant="outlined" sx={{ px: 3, py: 1.2, fontWeight: "bold", borderColor: NAVY_BLUE, color: NAVY_BLUE }} onClick={handleGetPayout}>
                  Check Expected Payout
                </Button>
                <Button variant="outlined" color="error" sx={{ px: 3, py: 1.2, fontWeight: "bold" }} onClick={() => setConfirmOpen(true)}>
                  Close Account
                </Button>
              </Box>
            )}

            {rdAccount.active && renderTransactionsTable()}
          </>
        )}
      </Box>

      {/* MODALS */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: "90%", md: 450 } }}>
          <Paper elevation={0} sx={{ ...cardStyle, p: 4 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Create RD Account</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField name="address" label="Address" fullWidth size="small" onChange={handleFormChange} /></Grid>
              <Grid item xs={6}><TextField name="mobile" label="Mobile" fullWidth size="small" onChange={handleFormChange} /></Grid>
              <Grid item xs={6}><TextField name="dob" type="date" label="DOB" fullWidth size="small" InputLabelProps={{ shrink: true }} onChange={handleFormChange} /></Grid>
              <Grid item xs={6}><TextField name="gender" label="Gender" fullWidth size="small" onChange={handleFormChange} /></Grid>
              <Grid item xs={6}><TextField name="occupation" label="Occupation" fullWidth size="small" onChange={handleFormChange} /></Grid>
              <Grid item xs={12}><TextField name="panNo" label="PAN" fullWidth size="small" onChange={handleFormChange} /></Grid>
              <Grid item xs={6}><TextField name="rdAmount" label="Monthly Amount" fullWidth size="small" onChange={handleFormChange} /></Grid>
            </Grid>
            <Button variant="contained" fullWidth sx={{ ...primaryButtonStyle, mt: 3 }} onClick={handleCreateRD}>Submit</Button>
          </Paper>
        </Box>
      </Modal>

      {/* 2. Payout Dialog with Validation Trigger */}
      <Dialog open={payoutDialogOpen} onClose={() => setPayoutDialogOpen(false)} PaperProps={{ sx: { borderRadius: 4, p: 2, minWidth: 350 } }}>
        <DialogTitle sx={{ fontWeight: "800", color: NAVY_BLUE, pb: 1, textAlign: "center" }}>Expected Payout Calculation</DialogTitle>
        <DialogContent>
          {payoutData && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body1" sx={{ mb: 1.5, textAlign: "center" }}>
                <strong>Closure Type:</strong> <Chip label={payoutData.closureType} size="small" sx={{ ml: 1, fontWeight: "bold" }} />
              </Typography>
              <Box sx={{ p: 3, bgcolor: "#f8fafc", borderRadius: 3, textAlign: "center", border: "1px solid #eef2f6" }}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ letterSpacing: 1 }}>ESTIMATED TOTAL PAYOUT</Typography>
                <Typography variant="h3" fontWeight="900" sx={{ color: "#2e7d32", mt: 1 }}>₹{payoutData.payoutAmount}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
                *This is an estimate. No changes have been made to your active account.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ flexDirection: "column", gap: 1.5, pb: 2, px: 3 }}>
          <Button onClick={() => setPayoutDialogOpen(false)} variant="outlined" sx={{ width: "100%", fontWeight: "bold", margin: "0 !important" }}>Done</Button>
          
          {/* Button triggers validation inside handleConfirmMaturityPayout */}
          <Button 
            onClick={handleConfirmMaturityPayout} 
            variant="contained" 
            sx={{ 
                ...primaryButtonStyle, 
                width: "100%", 
                margin: "0 !important",
                // Visual hint: fade the button if under 12 transactions
                opacity: (summary?.totalTransactions < 12) ? 0.7 : 1
            }}
          >
            {summary?.totalTransactions < 12 ? "Maturity Locked" : "Get Maturity Payout Now"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 3. Account Closure Confirm */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: "bold", color: NAVY_BLUE }}>Close RD Account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently close this account? This action cannot be undone and your final payout will be calculated immediately.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: "text.secondary", fontWeight: "bold" }}>Cancel</Button>
          <Button onClick={confirmCloseAccount} variant="contained" color="error" sx={{ fontWeight: "bold", borderRadius: 2, boxShadow: "none" }}>Yes, Close Account</Button>
        </DialogActions>
      </Dialog>

      {/* 4. Global Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 2, fontWeight: "bold" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
}