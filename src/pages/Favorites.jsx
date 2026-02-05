import { useEffect, useState } from "react";
import api from "../api/axios";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const [recipes, setRecipes] = useState([]);

 useEffect(() => {
  const loadFavorites = async () => {
    const userRes = await api.get("/api/users/me");
    const favoriteIds = userRes.data.favorites;

    if (!favoriteIds.length) {
      setRecipes([]);
      return;
    }

    const recipesRes = await api.post("/api/recipes/byIds", {
      ids: favoriteIds
    });

    setRecipes(recipesRes.data);
  };

  loadFavorites();
}, []);

  return (
        <div
      className="min-h-screen p-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.splitshire.com/full/A-Simple-Recipes-Website-Background_5FQbM.png')"
      }}
    >


    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-black">
        ❤️ My Favorite Recipes ❤️
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
    </div>
  );
}


