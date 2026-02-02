import { useEffect, useState } from "react";
import api from "../api/axios";
import RecipeCard from "../components/RecipeCard";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState(""); // 🔹 added for search

  useEffect(() => {
    api.get("/api/recipes").then(res => setRecipes(res.data));
  }, []);

  // 🔹 Filter recipes by name or ingredients
  const filteredRecipes = recipes.filter((recipe) => {
    const query = search.toLowerCase();

    const nameMatch = recipe.title?.toLowerCase().includes(query);
    const ingredientMatch = recipe.ingredients
      ?.join(" ")
      .toLowerCase()
      .includes(query);

    return nameMatch || ingredientMatch;
  });

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">
        🍲 Explore Delicious Recipes
      </h1>

      {/* 🔍 Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by recipe name or ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl p-3 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* 🧩 Recipes Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>

      {/* ❌ No Results */}
      {filteredRecipes.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No recipes found.
        </p>
      )}
    </div>
  );
}