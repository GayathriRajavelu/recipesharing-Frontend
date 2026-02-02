import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecipeDetails from "./pages/RecipeDetails";
import AddRecipe from "./pages/AddRecipe";
import MealPlanner from "./pages/MealPlanner";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import EditRecipe from "./pages/EditRecipe";
import ShoppingList from "./pages/ShoppingList";
import MyMealPlans from "./pages/MyMealPlans";
import MealPlanDetails from "./pages/MealPlanDetails";

export default function App() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {isLoggedIn && !hideNavbar && <Navbar />}

      <Routes>
  {/* PUBLIC */}
  <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
  <Route path="/recipes/:id" element={<RecipeDetails />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/favorites" element={<Favorites />} />

  {/* MEAL PLANS */}
  <Route path="/meal-plan" element={<MyMealPlans />} />
  <Route path="/meal-plan/create" element={<MealPlanner />} />
  <Route path="/meal-plans/:id" element={<MealPlanDetails />} />
  <Route path="/meal-plans/:id/shopping-list" element={<ShoppingList />} />

  {/* PROTECTED */}
  <Route element={<ProtectedRoute />}>
    <Route path="/add-recipe" element={<AddRecipe />} />
    <Route path="/edit-recipe/:id" element={<EditRecipe />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Route>
</Routes>
    </>
  );
}
