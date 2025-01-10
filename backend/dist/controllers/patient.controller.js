"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatient = exports.updatePatient = exports.getPatientById = exports.getPatients = exports.createPatient = void 0;
const patient_model_1 = __importDefault(require("../models/patient.model"));
// Create a new patient
const createPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patient = new patient_model_1.default(req.body);
        yield patient.save();
        return res.status(201).json(patient);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.createPatient = createPatient;
// Get all patients
const getPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield patient_model_1.default.find();
        return res.status(200).json(patients);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getPatients = getPatients;
// Get a single patient by ID
const getPatientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patient = yield patient_model_1.default.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        return res.status(200).json(patient);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getPatientById = getPatientById;
// Update a patient by ID
const updatePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patient = yield patient_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        return res.status(200).json(patient);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.updatePatient = updatePatient;
// Delete a patient by ID
const deletePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patient = yield patient_model_1.default.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        return res.status(200).json({ message: 'Patient deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.deletePatient = deletePatient;
