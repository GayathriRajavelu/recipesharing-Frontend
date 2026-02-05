import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function MyMealPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | withMeals | empty
  const [sort, setSort] = useState("newest"); // newest | oldest

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/api/meal-plans/mine");
        setPlans(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this meal plan?")) return;

    try {
      await api.delete(`/api/meal-plans/${id}`);
      setPlans((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete meal plan");
    }
  };

  const handleShare = (id) => {
    const link = `${window.location.origin}/meal-plans/${id}`;
    navigator.clipboard.writeText(link);
    alert("Share link copied!");
  };

  // 🔹 FILTER + SEARCH + SORT
  const filteredPlans = useMemo(() => {
    return plans
      .filter((plan) => {
        const dateStr = new Date(plan.weekStart).toLocaleDateString();
        if (search && !dateStr.includes(search)) return false;

        const plannedDays = Object.values(plan.meals).filter(
          (d) => d && d.length > 0
        ).length;

        if (filter === "withMeals" && plannedDays === 0) return false;
        if (filter === "empty" && plannedDays > 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sort === "newest") {
          return new Date(b.weekStart) - new Date(a.weekStart);
        } else {
          return new Date(a.weekStart) - new Date(b.weekStart);
        }
      });
  }, [plans, search, filter, sort]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading meal plans...
        </p>
      </div>
    );
  }

  return (

     <div
      className="min-h-screen p-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/premium-photo/variety-indian-food-different-dishes-snacks-dark-rustic-background-pilaf-butter-chicken-curry-rice-palak-paneer-chicken-tikka-dal-soup-naan-bread-assortment-chutney-copy-space_92134-1884.jpg')"
      }}
    >

    <div className="min-h-screen p-6">
      <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
        📅 My Meal Plans
      </h2>

      {/* 🔍 Controls */}
      <div className="max-w-4xl mx-auto bg-white p-4 rounded-xl shadow mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by date (e.g. 1/15/2026)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">All</option>
          <option value="withMeals">With meals</option>
          <option value="empty">Empty</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {filteredPlans.length === 0 && (
        <p className="text-center text-white">
          No matching meal plans found 🍽️
        </p>
      )}

      {/* Cards */}
      <div className="max-w-4xl mx-auto grid gap-5 sm:grid-cols-2">
        {filteredPlans.map((plan) => {
          const plannedDays = Object.values(plan.meals).filter(
            (d) => d && d.length > 0
          ).length;

          return (
            <div
              key={plan._id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100"
            >
              <p className="text-lg font-semibold text-gray-800">
                Week starting
              </p>
              <p className="text-xl font-bold text-orange-600">
                {new Date(plan.weekStart).toLocaleDateString()}
              </p>

              <span className="inline-block mt-2 text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                {plannedDays} days planned
              </span>

              <div className="flex flex-wrap gap-3 mt-5">
                <Link
                  to={`/meal-plans/${plan._id}`}
                  className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm"
                >
                  👁️ View
                </Link>

                <Link
                  to={`/meal-plans/${plan._id}/shopping-list`}
                  className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm"
                >
                  🛒 Shop
                </Link>

                <button
                  onClick={() => handleShare(plan._id)}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg text-sm"
                >
                  🔗 Share
                </button>

                <button
                  onClick={() => handleDelete(plan._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}
