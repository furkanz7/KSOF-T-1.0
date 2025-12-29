
export type Screen = 
  | 'LOGIN' 
  | 'REGISTER' 
  | 'DASHBOARD' 
  | 'PROFILE_EDIT' 
  | 'WORKOUT_SETUP' 
  | 'WORKOUT_RESULT' 
  | 'NUTRITION_SETUP' 
  | 'NUTRITION_RESULT'
  | 'SETTINGS'
  | 'NEARBY_GYMS'
  | 'BMI_CALCULATOR'
  | 'TIMER'
  | 'HISTORY';

export type Goal = 'Lose Weight' | 'Gain Weight' | 'Recomp' | 'Bulk';

export interface UserProfile {
  firstName: string;
  lastName: string;
  age: string;
  weight: string; // kg
  height: string; // cm
  gender: 'Male' | 'Female' | 'Other';
}

export interface UserStats extends UserProfile {
  daysPerWeek?: string;
  goal?: Goal;
  foodPreferences?: string[];
}

export interface Exercise {
  id?: string; // For tracking
  name: string;
  sets: string;
  reps: string;
  tips: string;
  isCompleted?: boolean;
}

export interface DailyPlan {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string; // Unique ID for history
  createdAt: number; // Timestamp
  planName: string;
  schedule: DailyPlan[];
  nutritionTips: string[];
}

export interface Meal {
  id?: string;
  name: string;
  ingredients: string[];
  calories: string;
  macros: string; // e.g. "30g P / 40g C / 10g F"
  isCompleted?: boolean;
}

export interface MealSuggestion {
  name: string;
  description: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  cookingTime: string;
  instructions: string[]; // Step-by-step guide
}

export interface Gym {
  title: string;
  uri: string;
  rating?: string; // Extracted from text or mocked if not in grounding chunk details
  address?: string;
}

export interface NutritionPlan {
  id: string; // Unique ID for history
  createdAt: number; // Timestamp
  planName: string;
  dailyCalories: string;
  macroTargets?: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: Meal[];
}

export interface HistoryLog {
  id: string;
  date: number; // timestamp
  type: 'WORKOUT' | 'NUTRITION';
  title: string; // "Push Day" or "Daily Nutrition"
  completionRate: number; // 0-100 percentage
  details: any; // Snapshot of the completed items
}
