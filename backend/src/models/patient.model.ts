// src/models/patient.model.ts

import mongoose, { Document, Schema, Types } from 'mongoose';


// Define the Contact Information interface
interface ContactInfo {
  phone: string;
  email: string;
}

// Define the Emergency Contact interface
interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}
export interface MealPlans {
  morning: Types.ObjectId[] ;
  evening: Types.ObjectId[] ;
  night: Types.ObjectId[] ;
}

// Define the Patient interface extending mongoose Document
export interface Patient extends Document {
  _id: Types.ObjectId;
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
  mealPlans:MealPlans,
}

// Create the Patient Schema
const PatientSchema: Schema = new Schema(
  {
    patientName: { type: String, required: true },
    diseases: { type: [String], required: true },
    allergies: { type: [String], required: true },
    roomNumber: { type: Number, required: true },
    bedNumber: { type: Number, required: true ,unique:true },
    floorNumber: { type: Number, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    contactInformation: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relationship: { type: String, required: true },
    },
    mealPlans:{
      morning:[{
        type:Types.ObjectId,
        ref:'MealPlan'
      }
      ],
      evening:[{

      
        type: Types.ObjectId,
        ref:'MealPlan'
      }
      ],
      night:[{
        type: Types.ObjectId,
        ref:'MealPlan',}
      ]
    }
  },
  { timestamps: true } // This will automatically add createdAt and updatedAt timestamps
);

// Create the Patient model
const PatientModel = mongoose.model<Patient>('Patient', PatientSchema);

export default PatientModel;
