import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else {
      navigate("/profile"); // 👈 redirect after login
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* email, password inputs, buttons */}
    </form>
  );
};

export default Login;
