import React, { useEffect, useState } from "react";
import ReactFrappeChart from "react-frappe-charts";
import DashboardService from "../services/dashboardService"; // Assuming DashboardService handles API calls

const SalesTrendChart = () => {
  const [salesChart, setSalesChart] = useState({
    labels: [],
    datasets: [{ name: "Sales", values: [] }],
  });

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [granularity, setGranularity] = useState("day"); // "day" or "hour"
  const [selectedDay, setSelectedDay] = useState(""); // for hour granularity

  const generateMonths = () => [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1, currentYear - 2]; // Last 3 years for example
  };

  const getDaysInMonth = (year, month) => {
    const days = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order data
        const orders = await DashboardService.getSalesData();

        // Filter orders based on selected month and year
        let filteredOrders = orders.filter((order) => {
          const orderDate = new Date(order.order_date);
          const orderMonth = orderDate.getMonth(); // 0-11 (January to December)
          const orderYear = orderDate.getFullYear();
          return orderMonth === selectedMonth && orderYear === selectedYear;
        });

        if (granularity === "hour" && selectedDay) {
          // Keep orders only for the selected day
          filteredOrders = filteredOrders.filter((order) => {
            const orderDate = new Date(order.order_date);
            const dayStr = orderDate.toISOString().split("T")[0];
            return dayStr === selectedDay;
          });
        }

        let salesData;

        if (granularity === "hour" && selectedDay) {
          // Group sales by hour for selectedDay
          salesData = filteredOrders.reduce(
            (acc, order) => {
              const orderDate = new Date(order.order_date);
              const hour = orderDate.getHours().toString().padStart(2, "0");
              if (!acc.sales[hour]) {
                acc.sales[hour] = 0;
              }
              acc.sales[hour] += order.total;
              if (!acc.labels.includes(hour)) {
                acc.labels.push(hour);
              }
              return acc;
            },
            { labels: [], sales: {} }
          );

          // Sort hours numerically (00, 01, ..., 23)
          const sortedLabels = salesData.labels.sort();
          setSalesChart({
            labels: sortedLabels,
            datasets: [
              {
                name: "Sales",
                values: sortedLabels.map((label) => salesData.sales[label]),
              },
            ],
          });
        } else {
          // Group sales by day (date)
          salesData = filteredOrders.reduce(
            (acc, order) => {
              const orderDate = new Date(order.order_date).toLocaleDateString(
                "en-GB"
              ); // Format as dd/mm/yy
              if (!acc.sales[orderDate]) {
                acc.sales[orderDate] = 0;
              }
              acc.sales[orderDate] += order.total;
              if (!acc.labels.includes(orderDate)) {
                acc.labels.push(orderDate);
              }
              return acc;
            },
            { labels: [], sales: {} }
          );

          // Ensure labels are in ascending order (from left to right)
          const sortedLabels = salesData.labels.sort((a, b) => {
            const [aD, aM, aY] = a.split("/").map(Number);
            const [bD, bM, bY] = b.split("/").map(Number);
            return new Date(aY, aM - 1, aD) - new Date(bY, bM - 1, bD);
          });

          setSalesChart({
            labels: sortedLabels,
            datasets: [
              {
                name: "Sales",
                values: sortedLabels.map((label) => salesData.sales[label]),
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, granularity, selectedDay]); // Re-fetch data when filters change

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

  return (
    <div className="bg-white rounded-lg shadow p-4 my-5">
      <h2 className="text-lg font-semibold mb-4">Sales Trends Over Time</h2>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="mr-2">Select Month: </label>
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(parseInt(e.target.value));
              setSelectedDay(""); // Reset day when month changes
            }}
          >
            {generateMonths().map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2">Select Year: </label>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(parseInt(e.target.value));
              setSelectedDay(""); // Reset day when year changes
            }}
          >
            {generateYears().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2">Granularity:</label>
          <select
            value={granularity}
            onChange={(e) => {
              setGranularity(e.target.value);
              setSelectedDay(""); // Reset when granularity changes
            }}
          >
            <option value="day">By Day</option>
            <option value="hour">By Hour</option>
          </select>
        </div>

        {granularity === "hour" && (
          <div>
            <label className="mr-2">Select Day: </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="">-- Select --</option>
              {daysInMonth.map((dateObj) => {
                const dateStr = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
                const display = dateObj.toLocaleDateString("en-GB");
                return (
                  <option key={dateStr} value={dateStr}>
                    {display}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      <ReactFrappeChart
        type="line"
        colors={["#4caf50"]}
        axisOptions={{
          xAxisMode: "tick",
          yAxisMode: "tick",
          xIsSeries: 1,
        }}
        height={250}
        data={salesChart}
      />
    </div>
  );
};

export default SalesTrendChart;
