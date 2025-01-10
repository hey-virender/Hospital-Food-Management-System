// src/store/mealDeliverySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MealDelivery {
  patientId: string;
  mealId: string;
  status: 'pending' | 'delivered' | 'in-progress';
}

interface MealDeliveryState {
  deliveries: MealDelivery[];
}

const initialState: MealDeliveryState = {
  deliveries: [],
};

const mealDeliverySlice = createSlice({
  name: 'mealDelivery',
  initialState,
  reducers: {
    addMealDelivery: (state, action: PayloadAction<MealDelivery>) => {
      state.deliveries.push(action.payload);
    },
    updateMealDeliveryStatus: (
      state,
      action: PayloadAction<{ mealId: string; status: 'pending' | 'delivered' | 'in-progress' }>
    ) => {
      const delivery = state.deliveries.find((d) => d.mealId === action.payload.mealId);
      if (delivery) {
        delivery.status = action.payload.status;
      }
    },
  },
});

export const { addMealDelivery, updateMealDeliveryStatus } = mealDeliverySlice.actions;
export default mealDeliverySlice.reducer;
