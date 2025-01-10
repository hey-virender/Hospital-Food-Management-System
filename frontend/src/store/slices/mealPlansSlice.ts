import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MealPlan {
  morning: string;
  evening: string;
  night: string;
}

interface MealPlansState {
  mealPlans: MealPlan[];
}

const initialState: MealPlansState = {
  mealPlans: [],
};

const mealPlansSlice = createSlice({
  name: 'mealPlans',
  initialState,
  reducers: {
    setMealPlans(state, action: PayloadAction<MealPlan[]>) {
      state.mealPlans = action.payload;
    },
    updateMealPlans(state, action: PayloadAction<{ index: number; mealPlan: MealPlan }>) {
      const { index, mealPlan } = action.payload;
      if (index >= 0 && index < state.mealPlans.length) {
        state.mealPlans[index] = mealPlan;
      }
    },
    clearMealPlans(state) {
      state.mealPlans = [];
    },
  },
});

export const {
  setMealPlans,
  updateMealPlans,
  clearMealPlans,
} = mealPlansSlice.actions;

export default mealPlansSlice.reducer;
