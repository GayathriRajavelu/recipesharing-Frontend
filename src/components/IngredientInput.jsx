import { useState } from "react";

export default function IngredientInput({ value = [], onChange }) {
  const [input, setInput] = useState("");

  const addIngredient = () => {
    if (!input.trim()) return;

    if (value.includes(input.trim())) return; // prevent duplicates

    onChange([...value, input.trim()]);
    setInput("");
  };

  const removeIngredient = (index) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="w-full">
      <label className="block mb-1 font-semibold">Ingredients</label>

      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add ingredient"
          onKeyDown={(e) => e.key === "Enter" && addIngredient()}
        />
        <button
          type="button"
          onClick={addIngredient}
          className="bg-orange-500 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {value.map((ingredient, index) => (
          <div
            key={index}
            className="bg-orange-100 px-3 py-1 rounded-full flex items-center gap-2"
          >
            <span>{ingredient}</span>
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="text-red-600 font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}