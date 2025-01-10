import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { dbConnection } from './config/db';
import userRoutes from './routes/user.routes';
import patientRoutes from './routes/patient.routes';
import mealPlanRoutes from './routes/meal-plan.routes';
import mealPreparationRoutes from './routes/meal-preparation.routes';
import mealDeliveryRoutes from './routes/meal-delivery.routes';
import analyticsRoutes from './routes/analytics.routes'
import cookieParser from "cookie-parser"

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

const app = express();
const port = 3000;
dbConnection();

// Middleware to parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Configure CORS
app.use(cors({
  origin: 'https://hospital-food-management-system.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials:true
}));

app.use("/api", userRoutes);
app.use("/api", patientRoutes);
app.use("/api", mealPlanRoutes);
app.use("/api", mealDeliveryRoutes);
app.use("/api", mealPreparationRoutes);
app.use("/api",analyticsRoutes)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
