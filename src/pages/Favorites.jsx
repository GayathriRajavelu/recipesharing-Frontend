import { useEffect, useState } from "react";
import api from "../api/axios";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    api.get("/users/me").then(res => {
      setRecipes(res.data.favorites);
    });
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-orange-600">
        ❤️ Favorite Recipes
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
