import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function MealPlanDetails() {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    api
      .get(`/api/meal-plans/${id}`)
      .then((res) => setPlan(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Loading meal plan...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-extrabold text-gray-800">
            📅 Meal Plan
          </h2>
          <span className="mt-2 sm:mt-0 text-sm text-gray-500">
            Week of {new Date(plan.weekStart).toDateString()}
          </span>
        </div>

        {/* Days Grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {Object.entries(plan.meals).map(([day, recipes]) => (
            <div
              key={day}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-orange-600 capitalize mb-2">
                {day}
              </h3>

              {recipes.length === 0 ? (
                <p className="text-gray-400 text-sm italic">
                  No meals planned
                </p>
              ) : (
                <ul className="space-y-2">
                  {recipes.map((r) => (
                    <li
                      key={r._id}
                      className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg text-gray-700"
                    >
                      <span className="text-orange-500">🍽️</span>
                      <span className="font-medium">{r.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Shopping List Button */}
        <div className="text-center mt-10">
          <Link
            to={`/meal-plans/${plan._id}/shopping-list`}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition transform hover:scale-105"
          >
            🛒 View Shopping List
          </Link>
        </div>
      </div>
    </div>
  );
}
