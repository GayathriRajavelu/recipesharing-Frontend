import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import IngredientInput from "../components/IngredientInput";

export default function AddRecipe() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState("");
  const [videoUrl, setVideoUrl] = useState(""); // Tutorial Video URL
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("steps", steps);
     

      if (media) {
        formData.append("media", media);
      }

      await api.post("/api/recipes", formData);

      alert("Recipe added successfully 🎉");
      navigate("/");
    } catch (err) {
      console.error("ADD RECIPE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-4"
      >
        <h2 className="text-3xl font-bold text-orange-600 text-center">
          🍳 Add New Recipe
        </h2>

        <input
          type="text"
          placeholder="Recipe Title"
          className="w-full p-3 border rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full p-3 border rounded-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* INGREDIENT CHIP INPUT */}
        <IngredientInput value={ingredients} onChange={setIngredients} />

        <textarea
          placeholder="Steps (one per line is recommended)"
          className="w-full p-3 border rounded-lg"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          required
        />

      
        {/* Image OR Video Upload */}
        <div>
          <label className="block font-semibold mb-1">
            Recipe Image or Video
          </label>

          <input
            type="file"
            accept="image/*,video/*"
            className="w-full p-2 border rounded-lg"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              setMedia(file);
              setPreview(URL.createObjectURL(file));
            }}
          />

          {preview && (
            <div className="mt-3 rounded overflow-hidden">
              {media.type.startsWith("image") ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded"
                />
              ) : (
                <video
                  src={preview}
                  controls
                  className="w-full h-64 object-cover rounded"
                />
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Add Recipe"}
        </button>
      </form>
    </div>
  );
}