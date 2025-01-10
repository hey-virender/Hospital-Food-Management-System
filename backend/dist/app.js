"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = require("./config/db");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const patient_routes_1 = __importDefault(require("./routes/patient.routes"));
const meal_plan_routes_1 = __importDefault(require("./routes/meal-plan.routes"));
const meal_preparation_routes_1 = __importDefault(require("./routes/meal-preparation.routes"));
const meal_delivery_routes_1 = __importDefault(require("./routes/meal-delivery.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const port = 3000;
(0, db_1.dbConnection)();
// Middleware to parse JSON body
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Configure CORS
app.use((0, cors_1.default)({
    origin: ['https://hospital-food-management-system.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use("/api", user_routes_1.default);
app.use("/api", patient_routes_1.default);
app.use("/api", meal_plan_routes_1.default);
app.use("/api", meal_delivery_routes_1.default);
app.use("/api", meal_preparation_routes_1.default);
app.use("/api", analytics_routes_1.default);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(process.env.JWT_SECRET);
});
