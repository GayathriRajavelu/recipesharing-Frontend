import { Link } from "react-router-dom";
import api from "../api/axios";
import { useState } from "react";

export default function RecipeCard({ recipe }) {
  const [likes, setLikes] = useState(recipe.likes?.length || 0);

  const handleLike = async () => {
    try {
      const res = await api.put(`/api/recipes/${recipe._id}/like`);
      setLikes(res.data.likes.length);
    } catch (err) {
      console.error(err);
    }
  };
   

  // ⭐ Calculate average rating
  const avgRating =
    recipe.ratings && recipe.ratings.length > 0
      ? (
          recipe.ratings.reduce((sum, r) => sum + r.value, 0) /
          recipe.ratings.length
        ).toFixed(1)
      : "0.0";

      const ratingColor =
  avgRating >= 4
    ? "text-green-600"
    : avgRating >= 2.5
    ? "text-orange-500"
    : "text-red-500";

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      {/* IMAGE / VIDEO */}
      {recipe.mediaUrl && (
        recipe.mediaType === "video" ? (
          <video
            src={recipe.mediaUrl}
            className="h-40 w-full object-cover rounded-lg"
            muted
          />
        ) : (
          <img
            src={recipe.mediaUrl}
            alt={recipe.title}
            className="h-40 w-full object-cover rounded-lg"
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
        )
      )}

      <h3 className="text-xl font-bold mt-2">{recipe.title}</h3>

    <div className="flex justify-between items-center mt-3">
  <div className="flex items-center gap-4">
    <button
      onClick={handleLike}
      className="text-red-500 font-semibold"
    >
      ❤️ {likes}
    </button>

    {/* ⭐ Average Rating */}
    <div className={`flex items-center gap-1 font-semibold ${ratingColor}`}>
      <span>★</span>
      <span>{avgRating}</span>
      <span className="text-xs text-gray-400">
        ({recipe.ratings?.length || 0})
      </span>
    </div>
  </div>

  <Link
    to={`/recipes/${recipe._id}`}
    className="text-orange-500 font-semibold"
  >
    View →
  </Link>
</div>
    </div>
  );
}