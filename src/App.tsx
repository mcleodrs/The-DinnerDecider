import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { Routes, Route } from "react-router-dom"; // ✅ no need for BrowserRouter here
import Home from "./Home";
import Login from "./Login";
import ChefDashboard from "./ChefDashboard";
import UserProfile from "./UserProfile";
import "./styles.css";
import CreateDinner from "./CreateDinner";
import NavBar from "./NavBar"; // add at top
import InviteDiners from "./InviteDiners";
import PWReset from "./PWReset";


export default function App() {
  const [themeClass, setThemeClass] = useState("red");

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
      <NavBar /> {/* ✅ Persistent Navigation */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ChefDashboard />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/create-event" element={<CreateDinner />} />
        <Route path="/invite-diners" element={<InviteDiners />} />
        <Route path="/reset-password" element={<PWReset />} />
       </Routes>
    </div>
  );
}
