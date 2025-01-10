import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface ContactInfo {
  phone: string;
  email: string;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

interface MealPlans {
  morning: string[];
  evening: string[];
  night: string[];
}

interface Patient {
  _id: string;
  patientName: string;
  diseases: string[];
  allergies: string[];
  roomNumber: number;
  bedNumber: number;
  floorNumber: number;
  age: number;
  gender: string;
  contactInformation: ContactInfo;
  emergencyContact: EmergencyContact;
  mealPlans: MealPlans;
}

interface PatientsState {
  patients: Patient[];
}

const initialState: PatientsState = {
  patients: [],
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setPatients(state, action: PayloadAction<Patient[]>) {
      state.patients = action.payload;
    },
    updatePatient(state, action: PayloadAction<Patient>) {
      const index = state.patients.findIndex(patient => patient._id === action.payload._id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    },
    clearPatients(state) {
      state.patients = [];
    },
  },
});

export const { setPatients, updatePatient, clearPatients } = patientsSlice.actions;

export default patientsSlice.reducer;