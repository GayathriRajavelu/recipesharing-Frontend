import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const submit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/auth/login", { email, password });

    // SAVE AUTH DATA
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data));
    localStorage.setItem("userId", res.data.user._id);

    
    console.log("Login success:", res.data);
    navigate("/");
    window.location.reload();   // force navbar to update
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Login failed");
  }
};

  return (
      <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:"url('https://png.pngtree.com/thumb_back/fh260/background/20240328/pngtree-healthy-thai-food-recipes-concept-image_15645273.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
>
<div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">
          Welcome Back 👋
        </h2>
        

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-orange-500 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>

  );
}
