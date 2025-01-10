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
exports.getAnalytics = void 0;
const meal_preparation_model_1 = __importDefault(require("./../models/meal-preparation.model")); // Your meal preparation model
const patient_model_1 = __importDefault(require("./../models/patient.model")); // Your patient model
// Analytics Controller
const getAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        // Fetch total patients
        const totalPatients = yield patient_model_1.default.countDocuments();
        // Fetch meals served today (you can adjust the date range if needed)
        const mealsServedToday = yield meal_preparation_model_1.default.countDocuments({
            timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }, // From midnight today
        });
        // Fetch the meal status distribution
        const mealStatus = yield meal_preparation_model_1.default.aggregate([
            {
                $group: {
                    _id: "$preparationStatus",
                    count: { $sum: 1 },
                },
            },
        ]);
        // Fetch meals served by time of day
        const mealsByTime = yield meal_preparation_model_1.default.aggregate([
            {
                $group: {
                    _id: "$mealTime", // Assuming you have a `mealTime` field (morning, afternoon, night)
                    count: { $sum: 1 },
                },
            },
        ]);
        // Prepare response data
        const response = {
            totalPatients,
            mealsServedToday,
            mealStatus: {
                pending: ((_a = mealStatus.find((status) => status._id === 'pending')) === null || _a === void 0 ? void 0 : _a.count) || 0,
                inProgress: ((_b = mealStatus.find((status) => status._id === 'in progress')) === null || _b === void 0 ? void 0 : _b.count) || 0,
                readyForDelivery: ((_c = mealStatus.find((status) => status._id === 'ready for delivery')) === null || _c === void 0 ? void 0 : _c.count) || 0,
                delivered: ((_d = mealStatus.find((status) => status._id === 'delivered')) === null || _d === void 0 ? void 0 : _d.count) || 0,
            },
            mealsByTime: {
                morning: ((_e = mealsByTime.find((item) => item._id === 'morning')) === null || _e === void 0 ? void 0 : _e.count) || 0,
                afternoon: ((_f = mealsByTime.find((item) => item._id === 'afternoon')) === null || _f === void 0 ? void 0 : _f.count) || 0,
                night: ((_g = mealsByTime.find((item) => item._id === 'night')) === null || _g === void 0 ? void 0 : _g.count) || 0,
            },
        };
        // Send response
        res.json(response);
    }
    catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({ message: 'Error fetching analytics data' });
    }
});
exports.getAnalytics = getAnalytics;
