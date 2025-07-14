import React, { useEffect, useState } from "react";
import ReactFrappeChart from "react-frappe-charts";
import DashboardService from "../services/dashboardService";

const PurchaseTrendChart = () => {
  const [purchaseChart, setPurchaseChart] = useState({
    labels: [],
    datasets: [{ name: "Purchases", values: [] }],
  });

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
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
    return [currentYear, currentYear - 1, currentYear - 2];
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
        const purchases = await DashboardService.getPurchaseData();

        // Filter purchases for month/year first
        let filteredPurchases = purchases.filter((purchase) => {
          const purchaseDate = new Date(purchase.date);
          const purchaseMonth = purchaseDate.getMonth();
          const purchaseYear = purchaseDate.getFullYear();
          return (
            purchaseMonth === selectedMonth && purchaseYear === selectedYear
          );
        });

        if (granularity === "hour" && selectedDay) {
          // Only keep purchases for the selected day
          filteredPurchases = filteredPurchases.filter((purchase) => {
            const purchaseDate = new Date(purchase.date);
            // const d = purchaseDate.getDate();
            // selectedDay in format 'YYYY-MM-DD'
            const dayStr = purchaseDate.toISOString().split("T")[0];
            return dayStr === selectedDay;
          });
        }

        let purchaseData;

        if (granularity === "hour" && selectedDay) {
          // Group by hour for selectedDay
          purchaseData = filteredPurchases.reduce(
            (acc, purchase) => {
              const purchaseDate = new Date(purchase.date);
              const hour = purchaseDate.getHours().toString().padStart(2, "0");
              if (!acc.purchases[hour]) {
                acc.purchases[hour] = 0;
              }
              acc.purchases[hour] += purchase.total_amount;
              if (!acc.labels.includes(hour)) {
                acc.labels.push(hour);
              }
              return acc;
            },
            { labels: [], purchases: {} }
          );

          // Sort hours numerically (00, 01, ..., 23)
          const sortedLabels = purchaseData.labels.sort();
          setPurchaseChart({
            labels: sortedLabels,
            datasets: [
              {
                name: "Purchases",
                values: sortedLabels.map(
                  (label) => purchaseData.purchases[label]
                ),
              },
            ],
          });
        } else {
          // Default: group by day (date)
          purchaseData = filteredPurchases.reduce(
            (acc, purchase) => {
              const purchaseDate = new Date(purchase.date).toLocaleDateString(
                "en-GB"
              );
              if (!acc.purchases[purchaseDate]) {
                acc.purchases[purchaseDate] = 0;
              }
              acc.purchases[purchaseDate] += purchase.total_amount;
              if (!acc.labels.includes(purchaseDate)) {
                acc.labels.push(purchaseDate);
              }
              return acc;
            },
            { labels: [], purchases: {} }
          );

          const sortedLabels = purchaseData.labels.sort((a, b) => {
            const [aD, aM, aY] = a.split("/").map(Number);
            const [bD, bM, bY] = b.split("/").map(Number);
            return new Date(aY, aM - 1, aD) - new Date(bY, bM - 1, bD);
          });

          setPurchaseChart({
            labels: sortedLabels,
            datasets: [
              {
                name: "Purchases",
                values: sortedLabels.map(
                  (label) => purchaseData.purchases[label]
                ),
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching purchase data:", error);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, granularity, selectedDay]);

  // Days in month for day selector
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

  return (
    <div className="bg-white rounded-lg shadow p-4 my-5">
      <h2 className="text-lg font-semibold mb-4">Purchase Trends Over Time</h2>

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
        colors={["#2196f3"]}
        axisOptions={{
          xAxisMode: "tick",
          yAxisMode: "tick",
          xIsSeries: 1,
        }}
        height={250}
        data={purchaseChart}
      />
    </div>
  );
};

export default PurchaseTrendChart;
