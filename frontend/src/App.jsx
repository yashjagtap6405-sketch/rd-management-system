import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/login";
import Registration from "./Pages/registeration";
import Dashboard from "./Pages/Dashboard";
import Loan from "./Pages/Loan"; // 1. Import the new Loan page

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/loan" element={<Loan />} /> {/* 2. Add the route */}
      </Routes>
    </BrowserRouter>
  );
}