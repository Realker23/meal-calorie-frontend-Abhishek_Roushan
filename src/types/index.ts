// Auth types
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Calorie types
export interface MacronutrientsPerServing {
  protein: number;
  total_fat: number;
  carbohydrates: number;
  fiber?: number;
  sugars?: number;
  saturated_fat?: number;
}

export interface TotalMacronutrients {
  protein: number;
  total_fat: number;
  carbohydrates: number;
  fiber?: number;
  sugars?: number;
  saturated_fat?: number;
}

export interface IngredientBreakdown {
  name: string;
  calories_per_100g: number;
  macronutrients_per_100g: {
    protein: number;
    total_fat: number;
    carbohydrates: number;
  };
  serving_size: string;
  data_type: string;
  fdc_id: number;
}

export interface MatchedFood {
  name: string;
  fdc_id: number;
  data_type: string;
  published_date: string;
}

export interface CalorieResponse {
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  macronutrients_per_serving: MacronutrientsPerServing;
  total_macronutrients: TotalMacronutrients;
  source: string;
  ingredient_breakdown: IngredientBreakdown[];
  matched_food: MatchedFood;
}

export interface CaloriePayload {
  dish_name: string;
  servings: number;
}

// Meal history
export interface MealHistoryEntry extends CalorieResponse {
  searched_at: string;
}

// API error
export interface ApiError {
  error: string;
  message: string;
  status_code: number;
  retryAfter?: number;
}
