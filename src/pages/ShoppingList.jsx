import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ShoppingList() {
  const { id } = useParams();
  const [shoppingList, setShoppingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const res = await api.get(`/meal-plans/${id}/shopping-list`);
        setShoppingList(res.data || null);
      } catch (err) {
        console.error(err);
        setError("Failed to load shopping list");
      } finally {
        setLoading(false);
      }
    };

    fetchShoppingList();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading shopping list...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  const isArray = Array.isArray(shoppingList);
  const isObject =
    shoppingList && typeof shoppingList === "object" && !isArray;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-800">
            🛒 Shopping List
          </h2>
          <p className="text-gray-500 mt-1">
            Everything you need for the week
          </p>
        </div>

        {/* ARRAY FORMAT */}
        {isArray && (
          <>
            {shoppingList.length === 0 ? (
              <p className="text-center text-gray-500">
                No ingredients found.
              </p>
            ) : (
              <ul className="space-y-3">
                {shoppingList.map((item, idx) => (
                  <li
                    key={idx}
                    className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center hover:shadow-lg transition"
                  >
                    <span className="font-medium text-gray-700">
                      {item.name}
                    </span>
                    <span className="bg-orange-100 text-orange-600 text-sm px-3 py-1 rounded-full">
                      x{item.count}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* OBJECT FORMAT */}
        {isObject && (
          <>
            {Object.entries(shoppingList).filter(
              ([, value]) => Array.isArray(value) && value.length > 0
            ).length === 0 ? (
              <p className="text-center text-gray-500">
                No ingredients found.
              </p>
            ) : (
              <div className="space-y-5">
                {Object.entries(shoppingList)
                  .filter(
                    ([, value]) =>
                      Array.isArray(value) && value.length > 0
                  )
                  .map(([category, items]) => (
                    <div
                      key={category}
                      className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
                    >
                      <h3 className="font-semibold text-lg text-orange-600 capitalize mb-2">
                        {category}
                      </h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}

        {!isArray && !isObject && (
          <p className="text-center text-gray-500">
            No ingredients found.
          </p>
        )}
      </div>
    </div>
  );
}
