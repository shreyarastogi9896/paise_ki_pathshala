import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Router>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: 10 }}>Home</Link>
        <Link to="/sms" style={{ marginRight: 10 }}> SMS</Link>
        <Link to="/speak">STT</Link>
        <Link to="/lesson">Lesson</Link>
        <Link to="/upload"> Upload</Link>
        <Link to="/expense">Expense</Link>
        <Link to="/final-guide">Final Guide</Link>
      </nav>
      <AppRoutes />
    </Router>
  );
}

export default App;
