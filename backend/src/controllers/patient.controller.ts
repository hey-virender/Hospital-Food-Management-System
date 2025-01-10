import { Request, Response } from 'express';
import PatientModel from "../models/patient.model";

// Create a new patient
export const createPatient = async (req: Request, res: Response) : Promise<any> => {
  try {
    const patient = new PatientModel(req.body);
    await patient.save();
    return res.status(201).json(patient);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// Get all patients
export const getPatients = async (req: Request, res: Response) : Promise<any> => {
  try {
    const patients = await PatientModel.find();
    return res.status(200).json(patients);
  } catch (error: any) {
   return res.status(500).json({ message: error.message });
  }
};

// Get a single patient by ID
export const getPatientById = async (req: Request, res: Response)  : Promise<any>=> {
  try {
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    return res.status(200).json(patient);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a patient by ID
export const updatePatient = async (req: Request, res: Response)  : Promise<any>=> {
  try {
    const patient = await PatientModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    return res.status(200).json(patient);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// Delete a patient by ID
export const deletePatient = async (req: Request, res: Response)  : Promise<any>=> {
  try {
    const patient = await PatientModel.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    return res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};