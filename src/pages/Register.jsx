import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";


export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/api/auth/register", { name, email, password });
    console.log("Registered:", res.data);
    navigate("/login");
  } catch (err) {
    console.error("Register error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Registration failed");
  }
};
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:"url('https://thumbs.dreamstime.com/b/wooden-board-menu-fresh-vegetables-recipe-background-392705795.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Register Box */}
      <div className="relative bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">
          Create Account 🍳
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="email"
            placeholder="Email Address"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
