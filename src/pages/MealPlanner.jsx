import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function MealPlanner() {
  const [recipes, setRecipes] = useState([]);
  const [weekStart, setWeekStart] = useState("");

  const [meals, setMeals] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/recipes")
      .then((res) => setRecipes(res.data))
      .catch((err) => console.error("Recipe load error:", err));
  }, []);

  const addRecipe = (day, recipeId) => {
    if (!recipeId) return;

    setMeals((prev) => ({
      ...prev,
      [day]: prev[day].includes(recipeId)
        ? prev[day]
        : [...prev[day], recipeId]
    }));
  };

  const handleSubmit = async () => {
    if (!weekStart) {
      alert("Please select a week start date");
      return;
    }

    const hasMeals = Object.values(meals).some((day) => day.length > 0);
    if (!hasMeals) {
      alert("Please add at least one recipe");
      return;
    }

    try {
      await api.post("/api/meal-plans", { weekStart, meals });
      alert("Meal plan created!");
      navigate("/meal-plan");
    } catch (err) {
      console.error("Meal plan save error:", err);
      alert("Failed to save meal plan");
    }
  };

  return (

    <div
      className="min-h-screen p-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/premium-photo/variety-indian-food-different-dishes-snacks-dark-rustic-background-pilaf-butter-chicken-curry-rice-palak-paneer-chicken-tikka-dal-soup-naan-bread-assortment-chutney-copy-space_92134-1884.jpg')"
      }}
    >


    <div className="min-h-screen  py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-800">
            📅 Create Meal Plan
          </h2>
          <p className="text-gray-500 mt-1">
            Plan your meals for the week
          </p>

          <input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            className="mt-4 border border-gray-200 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Days Grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {Object.keys(meals).map((day) => (
            <div
              key={day}
              className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-orange-600 capitalize mb-2">
                {day}
              </h3>

              <select
                onChange={(e) => addRecipe(day, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              >
                <option value="">Select recipe</option>
                {recipes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.title}
                  </option>
                ))}
              </select>

              {meals[day].length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  🍽️ {meals[day].length} recipe(s) added
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="text-center mt-10">
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105"
          >
            💾 Save Meal Plan
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
