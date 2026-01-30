import { useEffect, useState } from "react";
import api from "../api/axios";
import RecipeCard from "../components/RecipeCard";

export default function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    api.get("/recipes").then(res => setRecipes(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">
        🍲 Explore Delicious Recipes
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
