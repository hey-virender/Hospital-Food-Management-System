import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from "./slices/authSlice";
import mealDeliveryReducer from "./slices/mealDeliverySlice";
import mealPlansReducer from "./slices/mealPlansSlice";
import patientsReducer from "./slices/patientsSlice";
import uiReducer from "./slices/uiSlice";
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistStore, persistReducer } from 'redux-persist';

// Persist configuration for auth state
const authPersistConfig = {
  key: 'auth',
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  mealDelivery: mealDeliveryReducer,
  mealPlans: mealPlansReducer,
  patients: patientsReducer,
  ui: uiReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;

export const persistor = persistStore(store);

export default store;