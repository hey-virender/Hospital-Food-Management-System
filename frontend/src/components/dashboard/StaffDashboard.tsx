import React from "react";
import { Container} from "@mui/material";
import Header from "../common/Header";
import TodayMeals from "../mealPlans/TodayMeals";
import { useSelector } from "react-redux";
import DeliveryMeals from "../mealPlans/DeliveryMeals";

const StaffDashboard: React.FC = () => {
  const { role } = useSelector((state: any) => state.auth.user);
  return (
    <Container maxWidth="xl" className="py-6">
      <Header />
      {role == "PantryStaff" ? <TodayMeals /> : <DeliveryMeals />}
    </Container>
  );
};

export default StaffDashboard;
