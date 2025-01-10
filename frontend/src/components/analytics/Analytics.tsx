import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { Line, Pie, Bar } from "react-chartjs-2";
import useAxios from "../../hooks/useAxios"; // Axios hook for fetching data

// Registering chart types in Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import Header from "../common/Header";

// Registering chart types in Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement, // Register point for line charts
  LineElement   // Register line element for line charts
);

const Analytics: React.FC = () => {
  const axios = useAxios();
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get("/analytics");
        setAnalyticsData(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [axios]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  // Data for the Pie Chart (Meal Status Distribution)
  const mealStatusData = {
    labels: ["Pending", "In Progress", "Ready for Delivery", "Delivered"],
    datasets: [
      {
        data: [
          analyticsData?.mealStatus?.pending || 0,
          analyticsData?.mealStatus?.inProgress || 0,
          analyticsData?.mealStatus?.readyForDelivery || 0,
          analyticsData?.mealStatus?.delivered || 0,
        ],
        backgroundColor: ["#FF5733", "#FFC300", "#28a745", "#007bff"],
      },
    ],
  };

  // Data for the Bar Chart (Meals by Time of Day)
  const mealsByTimeData = {
    labels: ["Morning", "Afternoon", "Night"],
    datasets: [
      {
        label: "Meals Served",
        data: [
          analyticsData?.mealsByTime?.morning || 0,
          analyticsData?.mealsByTime?.afternoon || 0,
          analyticsData?.mealsByTime?.night || 0,
        ],
        backgroundColor: "#4e73df",
      },
    ],
  };

  // Data for the Line Chart (Meals Served Over Days)
  const mealsServedData = {
    labels: analyticsData?.mealsServedPerDay?.length
      ? analyticsData.mealsServedPerDay.map((index: number) => `Day ${index + 1}`)
      : [],
    datasets: [
      {
        label: "Meals Served",
        data: analyticsData?.mealsServedPerDay || [],
        borderColor: "#1cc88a",
        tension: 0.1,
        fill: false,
      },
    ],
  };

  return (
    <div className="w-full h-screen bg-gray-100 p-6">
      <Header />
      <Grid container spacing={3}>
        {/* Total Patients Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className="shadow-xl p-4">
            <CardContent>
              <Typography variant="h6">Total Patients</Typography>
              <Typography variant="h5" color="textPrimary">
                {analyticsData?.totalPatients || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Meals Served Today Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className="shadow-xl p-4">
            <CardContent>
              <Typography variant="h6">Meals Served Today</Typography>
              <Typography variant="h5" color="textPrimary">
                {analyticsData?.mealsServedToday || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart: Meal Status Distribution */}
        <Grid item xs={12} sm={6} md={6}>
          <Card className="shadow-xl p-4">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Meal Status Distribution
              </Typography>
              <Pie data={mealStatusData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart: Meals Served by Time */}
        <Grid item xs={12} sm={6} md={6}>
          <Card className="shadow-xl p-4">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Meals Served by Time of Day
              </Typography>
              <Bar data={mealsByTimeData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Line Chart: Meals Served Over Days */}
        <Grid item xs={12}>
          <Card className="shadow-xl p-4">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Meals Served Per Day
              </Typography>
              <Line data={mealsServedData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Analytics;
