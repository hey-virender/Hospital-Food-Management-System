import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';

interface UIState {
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: UIState = {
  loading: false,
  error: null,
  message: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setMessage(state, action: PayloadAction<string | null>) {
      state.message = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { setLoading, setError, setMessage, clearError } = uiSlice.actions;

export default uiSlice.reducer;

// Thunks for setting error and message with timeout
export const setErrorWithTimeout = (errorMessage: string) => async (dispatch: AppDispatch) => {
  dispatch(setError(errorMessage));
  setTimeout(() => {
    dispatch(setError(null)); // Reset error after 3 seconds
  }, 3000);
};

export const setMessageWithTimeout = (message: string) => async (dispatch: AppDispatch) => {
  dispatch(setMessage(message));
  setTimeout(() => {
    dispatch(setMessage(null)); // Reset message after 3 seconds
  }, 3000);
};
