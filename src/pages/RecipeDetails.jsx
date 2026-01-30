import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [me, setMe] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    try {
      const recipeRes = await api.get(`/recipes/${id}`);
      setRecipe(recipeRes.data);

      const meRes = await api.get("/users/me");
      setMe(meRes.data);

      setIsFavorited(meRes.data.favorites.includes(id));
      setIsFollowing(meRes.data.following.includes(recipeRes.data.user._id));

      const myRating = recipeRes.data.ratings.find(
        (r) => r.user === meRes.data._id
      );
      if (myRating) setRating(myRating.value);
    } catch (err) {
      console.error(err);
    }
  };

  if (!recipe) return <p className="text-center mt-20 text-xl">Loading...</p>;

  const isOwner = me && recipe.user._id === me._id;

  const toggleLike = async () => {
    const res = await api.put(`/recipes/${id}/like`);
    setRecipe(res.data);
  };

  const submitRating = async (value) => {
    setRating(value);
    const res = await api.put(`/recipes/${id}/rate`, { value });
    setRecipe(res.data);
  };

  const submitComment = async () => {
    if (!comment.trim()) return;
    const res = await api.post(`/recipes/${id}/comment`, { text: comment });
    setRecipe(res.data);
    setComment("");
  };

  const deleteComment = async (commentId) => {
    const res = await api.delete(`/recipes/${id}/comment/${commentId}`);
    setRecipe(res.data);
  };

  const toggleFavorite = async () => {
    const res = await api.put(`/recipes/${id}/favorite`);
    setIsFavorited(res.data.favorites.includes(id));
  };

  const toggleFollow = async () => {
    await api.put(`/users/${recipe.user._id}/follow`);
    setIsFollowing(!isFollowing);
  };

  const handleDeleteRecipe = async () => {
    if (!window.confirm("Delete this recipe?")) return;
    try {
      await api.delete(`/recipes/${id}`);
      navigate("/");
    } catch (err) {
      alert("Failed to delete recipe");
    }
  };

  const averageRating =
    recipe.ratings && recipe.ratings.length > 0
      ? (
          recipe.ratings.reduce((sum, r) => sum + r.value, 0) /
          recipe.ratings.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-white px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* HERO */}
        <div className="relative rounded-[2rem] overflow-hidden shadow-xl">
          {recipe.mediaUrl &&
            (recipe.mediaType === "video" ? (
              <video src={recipe.mediaUrl} controls className="w-full h-[460px] object-cover" />
            ) : (
              <img src={recipe.mediaUrl} alt={recipe.title} className="w-full h-[460px] object-cover" />
            ))}

          <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 to-transparent p-10 flex flex-col justify-end">
            <h1 className="text-5xl font-extrabold text-white drop-shadow">
              {recipe.title}
            </h1>

            <div className="flex items-center justify-between mt-4">
              <p className="text-orange-200">
                by <span className="font-semibold text-white">{recipe.user.name}</span>
              </p>

              <div className="flex gap-3">
                {isOwner && (
                  <>
                    <button
                      onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                      className="px-5 py-2 rounded-full bg-white text-orange-600 font-semibold"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={handleDeleteRecipe}
                      className="px-5 py-2 rounded-full bg-red-500 text-white font-semibold"
                    >
                      🗑 Delete
                    </button>
                  </>
                )}

                {me && recipe.user._id !== me._id && (
                  <button
                    onClick={toggleFollow}
                    className={`px-6 py-2 rounded-full font-semibold ${
                      isFollowing
                        ? "bg-white/80 text-black"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

   
       {/* ACTION BAR */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 flex flex-wrap justify-between items-center gap-6">

        <div className="flex gap-4">
          <button
            onClick={toggleLike}
            className="px-6 py-2 rounded-full bg-red-100 text-red-600 font-semibold hover:bg-red-200"
          >
            ❤️ {recipe.likes.length}
          </button>

          <button
            onClick={toggleFavorite}
            className={`px-6 py-2 rounded-full font-semibold ${
              isFavorited
                ? "bg-orange-500 text-white"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {isFavorited ? "★ Saved" : "☆ Save"}
          </button>
        </div>

        {/* AVERAGE RATING */}
        <div className="flex items-center gap-3 bg-yellow-100 px-5 py-2 rounded-full shadow-inner">
          <span className="text-yellow-500 text-2xl">★</span>
          <span className="font-bold text-yellow-700 text-lg">
            {averageRating}
          </span>
          <span className="text-sm text-gray-500">
            ({recipe.ratings.length})
          </span>
        </div>

        {/* USER RATING */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((v) => (
            <span
              key={v}
              onClick={() => submitRating(v)}
              className={`cursor-pointer text-4xl transition ${
                v <= rating
                  ? "text-yellow-400 scale-110"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>

      </div>

      {/* CONTENT */}
      <div className="grid md:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow">
            <h2 className="text-2xl font-bold mb-3 text-orange-600">About</h2>
            <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow">
            <h2 className="text-2xl font-bold mb-4 text-orange-600">Steps</h2>
            <div className="space-y-4">
              {recipe.steps.map((s, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 bg-orange-50 p-4 rounded-xl"
                >
                  <span className="w-9 h-9 flex items-center justify-center bg-orange-500 text-white rounded-full font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-gray-800">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow h-fit">
          <h2 className="text-2xl font-bold mb-4 text-orange-600">Ingredients</h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((i, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 bg-orange-50 p-3 rounded-lg"
              >
                <span className="w-3 h-3 bg-orange-500 rounded-full" />
                {i}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* COMMENTS */}
      <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow space-y-6">
        <h2 className="text-3xl font-bold text-orange-600">Comments</h2>

        {recipe.comments.map((c) => (
          <div
            key={c._id}
            className="bg-orange-50 p-4 rounded-xl flex justify-between"
          >
            <div>
              <p className="font-semibold text-orange-600">
                {c.user?.name || "User"}
              </p>
              <p className="text-gray-700">{c.text}</p>
            </div>

            {me && c.user?._id === me._id && (
              <button
                onClick={() => deleteComment(c._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        ))}

        {me && (
          <div className="flex gap-4">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 border rounded-xl px-4 py-3"
              placeholder="Write a comment..."
            />
            <button
              onClick={submitComment}
              className="bg-orange-500 text-white px-8 rounded-xl hover:bg-orange-600"
            >
              Post
            </button>
          </div>
        )}
      </div>

      {isOwner && (
        <p className="text-center text-sm text-gray-500">
          You own this recipe
        </p>
      )}
    </div>
  </div>
);
}