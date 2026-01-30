import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    api.get("/recipes/my").then(res => setRecipes(res.data));
  }, []);

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="font-bold mb-2">My Recipes</h3>
      {recipes.map(r => (
        <Link
          key={r._id}
          to={`/recipe/${r._id}`}
          className="block border-b py-1 hover:text-blue-600"
        >
          {r.title}
        </Link>
      ))}
    </div>
  );
}
