import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import IngredientInput from "../components/IngredientInput";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load recipe
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/recipes/${id}`);
        const r = res.data;

        setTitle(r.title);
        setDescription(r.description);
        setIngredients(r.ingredients || []);
        setSteps(Array.isArray(r.steps) ? r.steps.join("\n") : r.steps);
        setVideoUrl(r.videoUrl || "");
        setPreview(r.mediaUrl || null);

        setLoading(false);
      } catch (err) {
        alert("Failed to load recipe");
        navigate("/");
      }
    };

    load();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("steps", steps);
      formData.append("videoUrl", videoUrl);

      if (media) {
        formData.append("media", media);
      }

      await api.put(`/api/recipes/${id}`, formData);

      alert("Recipe updated successfully 🎉");
      navigate(`/recipes/${id}`);
    } catch (err) {
      alert("Failed to update recipe");
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500 text-lg animate-pulse">
        Loading recipe...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-4"
      >
        <h2 className="text-3xl font-bold text-orange-600 text-center">
          ✏️ Edit Recipe
        </h2>

        <input
          type="text"
          className="w-full p-3 border rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full p-3 border rounded-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* Ingredient chips */}
        <IngredientInput value={ingredients} onChange={setIngredients} />

        <textarea
          className="w-full p-3 border rounded-lg"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          placeholder="Steps (one per line)"
          required
        />

        {/* Media upload */}
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
              {preview.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  src={preview}
                  controls
                  className="w-full h-64 object-cover rounded"
                />
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded"
                />
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
        >
          Update Recipe
        </button>
      </form>
    </div>
  );
}