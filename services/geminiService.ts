import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserStats, WorkoutPlan, NutritionPlan, MealSuggestion, Gym } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- WORKOUT SCHEMA ---
const workoutSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    planName: { type: Type.STRING, description: "A catchy name for the workout plan" },
    nutritionTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 short nutritional guidelines"
    },
    schedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING, description: "e.g., Monday" },
          focus: { type: Type.STRING, description: "e.g., Push Day" },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sets: { type: Type.STRING },
                reps: { type: Type.STRING },
                tips: { type: Type.STRING }
              },
              required: ["name", "sets", "reps", "tips"]
            }
          }
        },
        required: ["day", "focus", "exercises"]
      }
    }
  },
  required: ["planName", "schedule", "nutritionTips"]
};

// --- NUTRITION SCHEMA ---
const nutritionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    planName: { type: Type.STRING },
    dailyCalories: { type: Type.STRING, description: "Target daily calorie intake" },
    macroTargets: {
      type: Type.OBJECT,
      properties: {
        protein: { type: Type.INTEGER, description: "Total grams of protein" },
        carbs: { type: Type.INTEGER, description: "Total grams of carbs" },
        fats: { type: Type.INTEGER, description: "Total grams of fats" }
      },
      required: ["protein", "carbs", "fats"]
    },
    meals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "e.g. Breakfast: Oatmeal" },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          calories: { type: Type.STRING },
          macros: { type: Type.STRING, description: "Brief macro breakdown" }
        },
        required: ["name", "ingredients", "calories", "macros"]
      }
    }
  },
  required: ["planName", "dailyCalories", "meals", "macroTargets"]
};

// --- SINGLE MEAL SCHEMA ---
const singleMealSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING, description: "Short appetizing description" },
    calories: { type: Type.STRING },
    protein: { type: Type.STRING },
    carbs: { type: Type.STRING },
    fats: { type: Type.STRING },
    cookingTime: { type: Type.STRING },
    instructions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Step-by-step cooking instructions."
    }
  },
  required: ["name", "description", "calories", "protein", "carbs", "fats", "cookingTime", "instructions"]
};

export const generateWorkoutPlan = async (stats: UserStats): Promise<WorkoutPlan> => {
  const prompt = `
    Create a workout plan for:
    Name: ${stats.firstName}
    Age: ${stats.age}
    Weight: ${stats.weight}kg
    Height: ${stats.height}cm
    Goal: ${stats.goal}
    Availability: ${stats.daysPerWeek} days/week.

    Focus on beginner-friendly but effective compound movements.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: workoutSchema,
        systemInstruction: "You are KSOFit, an elite bodybuilding coach.",
      }
    });
    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as WorkoutPlan;
  } catch (error) {
    console.error("Gemini Workout Error:", error);
    throw error;
  }
};

export const generateNutritionPlan = async (stats: UserStats, customIngredients?: string): Promise<NutritionPlan> => {
  let prompt = `
    Create a highly specific daily nutrition plan for:
    Name: ${stats.firstName}
    Gender: ${stats.gender}
    Age: ${stats.age}
    Height: ${stats.height}cm
    Weight: ${stats.weight}kg
    Activity Level: ${stats.daysPerWeek} days of training per week.
    Primary Goal: ${stats.goal}.
    Dietary Preferences: ${stats.foodPreferences?.join(', ') || 'Standard Balanced'}.

    TASK:
    1. Calculate the user's BMR and TDEE based on the provided biometrics.
    2. Adjust the total daily calories according to their goal (e.g., -500 for weight loss, +300 for gain).
    3. Generate 3 to 5 meals that fit these calculated macros exactly.
    4. Ensure meals use accessible ingredients.
  `;

  if (customIngredients) {
    prompt += `
    IMPORTANT INSTRUCTION: The user has specifically requested to use these ingredients: "${customIngredients}".
    Create the meal plan primarily around these ingredients while ensuring it still meets their goal of ${stats.goal}.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: nutritionSchema,
        systemInstruction: "You are KSOFit, a clinical sports nutritionist. You calculate calories precisely based on Harris-Benedict and Activity multipliers.",
      }
    });
    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as NutritionPlan;
  } catch (error) {
    console.error("Gemini Nutrition Error:", error);
    throw error;
  }
};

export const suggestChefMeal = async (stats: UserStats, ingredients: string): Promise<MealSuggestion> => {
  const prompt = `
    The user has these EXACT ingredients with quantities: "${ingredients}".
    Create ONE meal using ONLY these ingredients (plus basic pantry items like salt, pepper, water, oil, heat).
    
    CRITICAL: Calculate the Macros and Calories based specifically on the quantities provided (e.g. if 200g chicken is listed, calculate macros for 200g chicken).
    Provide step-by-step instructions.
    
    User Profile: ${stats.goal}.
    Return name, calories, macros, cooking time, and instructions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: singleMealSchema,
        systemInstruction: "You are a strict pragmatic chef. You only cook with what is given. Calculate macros precisely based on input quantities."
      }
    });
    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as MealSuggestion;
  } catch (error) {
    console.error("Chef Suggestion Error:", error);
    throw error;
  }
};

export const findNearbyGyms = async (lat?: number, lng?: number, query?: string): Promise<Gym[]> => {
  try {
    let contents = "Find the top 5 highest rated gyms nearby. List them with their ratings.";
    let retrievalConfig = {};

    if (lat && lng) {
        retrievalConfig = {
            latLng: {
              latitude: lat,
              longitude: lng
            }
        };
    } else if (query) {
        contents = `Find the top 5 highest rated gyms in ${query}. List them with their ratings.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        tools: [{googleMaps: {}}],
        toolConfig: {
            retrievalConfig: Object.keys(retrievalConfig).length > 0 ? retrievalConfig : undefined
        }
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const gyms: Gym[] = [];

    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
            gyms.push({
                title: chunk.web.title,
                uri: chunk.web.uri,
                address: "View on Map" 
            });
        }
      });
    }

    return gyms;
  } catch (error) {
    console.error("Gemini Maps Error:", error);
    throw error;
  }
}