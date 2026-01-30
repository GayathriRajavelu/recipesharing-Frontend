import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch existing recipe
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/recipes/${id}`);
        const recipe = res.data;

        setTitle(recipe.title);
        setDescription(recipe.description);
        setIngredients(recipe.ingredients.join(", "));
        setSteps(recipe.steps.join(", "));
        setLoading(false);
      } catch (err) {
        console.error(err.response?.data || err.message);
        alert("Failed to load recipe");
        navigate("/");
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  // 🔹 Update recipe
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("ingredients", ingredients);
      formData.append("steps", steps);

      if (media) {
        formData.append("media", media); // 👈 optional new image/video
      }

      await api.put(`/recipes/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Recipe updated successfully");
      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error(err.response?.data || err.message);
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

        <textarea
          placeholder="Ingredients (comma separated)"
          className="w-full p-3 border rounded-lg"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />

        <textarea
          placeholder="Steps (comma separated)"
          className="w-full p-3 border rounded-lg"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          required
        />

        {/* Optional media update */}
        <input
          type="file"
          accept="image/*,video/*"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => setMedia(e.target.files[0])}
        />

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
