import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import ChefDashboard from "./ChefDashboard";
import CreateDinner from "./CreateDinner";
import UserProfile from "./UserProfile";

// src/index.tsx (or App.tsx)
import React from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "./auth";

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById("root")
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ChefDashboard />} />
        <Route path="/create" element={<CreateDinner />} />
        <Route path="/user" element={<UserProfile />} /> {/* NEW ROUTE */}
      </Routes>
    </Router>
  );
}

export default App;
