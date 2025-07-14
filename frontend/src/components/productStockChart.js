import React, { useEffect, useState } from "react";
import ReactFrappeChart from "react-frappe-charts";
import DashboardService from "../services/dashboardService";

const groupBy = (arr, keyFn) => {
  const map = new Map();
  arr.forEach((item) => {
    const key = keyFn(item);
    map.set(key, (map.get(key) || 0) + item.quantity);
  });
  return Array.from(map.entries()); // [[key, quantity], ...]
};

const ProductStockChart = () => {
  const [categoryChart, setCategoryChart] = useState({
    labels: [],
    datasets: [{ name: "Stock by Category", values: [] }],
  });

  const [unitChart, setUnitChart] = useState({
    labels: [],
    datasets: [{ name: "Stock by Unit", values: [] }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await DashboardService.barchart();

        // Group and prepare chart for categories
        const categoryData = groupBy(
          products,
          (p) => p.category?.name || "Uncategorized"
        );
        const categoryLabels = categoryData.map(([name]) => name);
        const categoryValues = categoryData.map(([_, quantity]) => quantity);

        setCategoryChart({
          labels: categoryLabels,
          datasets: [{ name: "Stock by Category", values: categoryValues }],
        });

        // Group and prepare chart for units
        const unitData = groupBy(
          products,
          (p) => p.unit?.name || "Unknown Unit"
        );
        const unitLabels = unitData.map(([name]) => name);
        const unitValues = unitData.map(([_, quantity]) => quantity);

        setUnitChart({
          labels: unitLabels,
          datasets: [{ name: "Stock by Unit", values: unitValues }],
        });
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Stock by Category</h2>
        <ReactFrappeChart
          type="bar"
          colors={["#4caf50"]}
          axisOptions={{ xAxisMode: "tick", yAxisMode: "tick", xIsSeries: 1 }}
          height={250}
          data={categoryChart}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Stock by Unit</h2>
        <ReactFrappeChart
          type="bar"
          colors={["#2196f3"]}
          axisOptions={{ xAxisMode: "tick", yAxisMode: "tick", xIsSeries: 1 }}
          height={250}
          data={unitChart}
        />
      </div>
    </div>
  );
};

export default ProductStockChart;
