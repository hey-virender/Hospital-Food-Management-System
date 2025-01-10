"use strict";
// src/models/patient.model.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Create the Patient Schema
const PatientSchema = new mongoose_1.Schema({
    patientName: { type: String, required: true },
    diseases: { type: [String], required: true },
    allergies: { type: [String], required: true },
    roomNumber: { type: Number, required: true },
    bedNumber: { type: Number, required: true, unique: true },
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
    mealPlans: {
        morning: [{
                type: mongoose_1.Types.ObjectId,
                ref: 'MealPlan'
            }
        ],
        evening: [{
                type: mongoose_1.Types.ObjectId,
                ref: 'MealPlan'
            }
        ],
        night: [{
                type: mongoose_1.Types.ObjectId,
                ref: 'MealPlan',
            }
        ]
    }
}, { timestamps: true } // This will automatically add createdAt and updatedAt timestamps
);
// Create the Patient model
const PatientModel = mongoose_1.default.model('Patient', PatientSchema);
exports.default = PatientModel;
