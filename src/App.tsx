import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import ChefDashboard from "./ChefDashboard";
import UserProfile from "./UserProfile";
import "./styles.css"; // 👈 make sure this matches your filename

export default function App() {
  const [themeClass, setThemeClass] = useState("red"); // default theme

  useEffect(() => {
    async function loadTheme() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("uitheme_pref")
        .eq("id", user.id)
        .single();

      if (!error && data?.uitheme_pref) {
        setThemeClass(data.uitheme_pref);
      }
    }

    loadTheme();
  }, []);

  return (
    <div className={`App ${themeClass}`}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ChefDashboard />} />
          <Route path="/user" element={<UserProfile />} />
        </Routes>
      </Router>
    </div>
  );
}
