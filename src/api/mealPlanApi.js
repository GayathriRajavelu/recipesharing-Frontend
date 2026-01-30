import axios from "./axios";   // ✅ reuse your existing axios instance

export const createMealPlan = (data) =>
  axios.post("/meal-plans", data);

export const getMyMealPlans = () =>
  axios.get("/meal-plans/mine");

export const getMealPlanById = (id) =>
  axios.get(`/meal-plans/${id}`);

export const getShoppingList = (id) =>
  axios.get(`/meal-plans/${id}/shopping-list`);
