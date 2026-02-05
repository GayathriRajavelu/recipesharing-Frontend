import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MainNavbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 relative z-50">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-orange-600">
          🍲 RecipeShare
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:text-orange-500 font-medium">Home</Link>
          <Link to="/favorites" className="hover:text-orange-500 font-medium">Favorites</Link>
          <Link to="/dashboard" className="hover:text-orange-500 font-medium">Dashboard</Link>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setOpen(true)}
        >
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sliding Mobile Menu */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white z-50 p-6 shadow-lg transform transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end mb-8">
          <button onClick={() => setOpen(false)} className="text-2xl">✕</button>
        </div>

        <div className="flex flex-col gap-5">
          <Link to="/" onClick={() => setOpen(false)} className="hover:text-orange-500">Home</Link>
          <Link to="/favorites" onClick={() => setOpen(false)} className="hover:text-orange-500">Favorites</Link>
          <Link to="/dashboard" onClick={() => setOpen(false)} className="hover:text-orange-500">Dashboard</Link>

          <button
            onClick={logout}
            className="bg-red-500 text-white py-2 rounded hover:bg-red-600 mt-4"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}