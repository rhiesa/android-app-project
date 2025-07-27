import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface FoodEntry {
  id: string;
  calories: number;
  timestamp: Date;
  reason: string;
}

export interface UserSettings {
  targetWeight: number;
  currentWeight: number;
  eatingWindowStart: string; // "08:00"
  eatingWindowEnd: string; // "18:00"
  bmr: number; // Basal Metabolic Rate
}

export interface CalorieState {
  currentCalories: number;
  dailyGoal: number;
  foodEntries: FoodEntry[];
  settings: UserSettings;
  isWithinEatingWindow: boolean;
  lastUpdated: Date;
}

// Actions
type CalorieAction =
  | { type: 'ADD_FOOD'; payload: FoodEntry }
  | { type: 'UPDATE_CALORIES'; payload: number }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'RESET_DAY' }
  | { type: 'LOAD_STATE'; payload: CalorieState };

// Initial state
const initialState: CalorieState = {
  currentCalories: 2200,
  dailyGoal: 2200,
  foodEntries: [],
  settings: {
    targetWeight: 150,
    currentWeight: 180,
    eatingWindowStart: "08:00",
    eatingWindowEnd: "18:00",
    bmr: 1920, // Default BMR (will be calculated based on weight)
  },
  isWithinEatingWindow: true,
  lastUpdated: new Date(),
};

// Reducer
function calorieReducer(state: CalorieState, action: CalorieAction): CalorieState {
  switch (action.type) {
    case 'ADD_FOOD':
      return {
        ...state,
        currentCalories: state.currentCalories + action.payload.calories,
        foodEntries: [...state.foodEntries, action.payload],
      };
    case 'UPDATE_CALORIES':
      return {
        ...state,
        currentCalories: action.payload,
        lastUpdated: new Date(),
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
        dailyGoal: action.payload.targetWeight ? action.payload.targetWeight * 3600 : state.dailyGoal,
      };
    case 'RESET_DAY':
      return {
        ...state,
        currentCalories: state.dailyGoal,
        foodEntries: [],
        lastUpdated: new Date(),
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

// Context
const CalorieContext = createContext<{
  state: CalorieState;
  dispatch: React.Dispatch<CalorieAction>;
  addFoodEntry: (calories: number, reason: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetDay: () => void;
  getCalorieZone: () => 'green' | 'yellow' | 'red';
} | undefined>(undefined);

// Provider
export const CalorieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(calorieReducer, initialState);

  // Load state from storage on mount
  useEffect(() => {
    loadState();
  }, []);

  // Save state to storage whenever it changes
  useEffect(() => {
    saveState();
  }, [state]);

  // Update calories based on BMR every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hoursSinceLastUpdate = (now.getTime() - state.lastUpdated.getTime()) / (1000 * 60 * 60);
      const caloriesBurned = hoursSinceLastUpdate * (state.settings.bmr / 24);
      
      if (caloriesBurned > 0) {
        dispatch({
          type: 'UPDATE_CALORIES',
          payload: Math.max(0, state.currentCalories - caloriesBurned),
        });
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [state.currentCalories, state.lastUpdated, state.settings.bmr]);

  // Check eating window
  useEffect(() => {
    const checkEatingWindow = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      const isWithin = currentTime >= state.settings.eatingWindowStart && 
                      currentTime <= state.settings.eatingWindowEnd;
      
      if (isWithin !== state.isWithinEatingWindow) {
        dispatch({
          type: 'UPDATE_SETTINGS',
          payload: { isWithinEatingWindow: isWithin },
        });
      }
    };

    checkEatingWindow();
    const interval = setInterval(checkEatingWindow, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state.settings.eatingWindowStart, state.settings.eatingWindowEnd]);

  const loadState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('calorieState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Convert string dates back to Date objects
        parsedState.lastUpdated = new Date(parsedState.lastUpdated);
        parsedState.foodEntries = parsedState.foodEntries.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
  };

  const saveState = async () => {
    try {
      await AsyncStorage.setItem('calorieState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  const addFoodEntry = (calories: number, reason: string) => {
    const entry: FoodEntry = {
      id: Date.now().toString(),
      calories,
      timestamp: new Date(),
      reason,
    };
    dispatch({ type: 'ADD_FOOD', payload: entry });
  };

  const updateSettings = (settings: Partial<UserSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const resetDay = () => {
    dispatch({ type: 'RESET_DAY' });
  };

  const getCalorieZone = (): 'green' | 'yellow' | 'red' => {
    const netCalories = state.currentCalories;
    if (netCalories <= state.dailyGoal * 0.8) return 'green';
    if (netCalories <= state.dailyGoal) return 'yellow';
    return 'red';
  };

  return (
    <CalorieContext.Provider
      value={{
        state,
        dispatch,
        addFoodEntry,
        updateSettings,
        resetDay,
        getCalorieZone,
      }}
    >
      {children}
    </CalorieContext.Provider>
  );
};

// Hook
export const useCalorie = () => {
  const context = useContext(CalorieContext);
  if (context === undefined) {
    throw new Error('useCalorie must be used within a CalorieProvider');
  }
  return context;
}; 