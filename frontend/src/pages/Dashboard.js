import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductStockChart from "../components/productStockChart";
import PurchaseTrendChart from "../components/purchaseTrendChart";
import SalesTrendChart from "../components/salesTrendChart";
import DashboardService from "../services/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_customers: 0,
    total_products: 0,
    total_orders: 0,
    total_orders_today: 0,
    total_purchases: 0,
    total_purchases_today: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await DashboardService.index();
        setStats(res);
      } catch (err) {}
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="container px-6 mx-auto grid">
        <h2 className="my-6 text-2xl font-semibold text-gray-700">Dashboard</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container px-6 mx-auto grid">
      <h2 className="my-6 text-2xl font-semibold text-gray-700">Dashboard</h2>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {/* Total Clients */}
        <Link
          to="/customers"
          className="flex items-center p-4 bg-blue-100 rounded-lg shadow-xs hover:bg-blue-200 transition"
        >
          <div className="p-3 mr-4 text-orange-500 bg-orange-200 rounded-full">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
            </svg>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Total customers
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {stats.total_customers}
            </p>
          </div>
        </Link>
        {/* Total Products */}
        <Link
          to="/products"
          className="flex items-center p-4 bg-blue-100 rounded-lg shadow-xs hover:bg-blue-200 transition"
        >
          <div className="p-3 mr-4 text-green-500 bg-green-200 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m7.875 14.25 1.214 1.942a2.25 2.25 0 0 0 1.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 0 1 1.872 1.002l.164.246a2.25 2.25 0 0 0 1.872 1.002h2.092a2.25 2.25 0 0 0 1.872-1.002l.164-.246A2.25 2.25 0 0 1 16.954 9h4.636M2.41 9a2.25 2.25 0 0 0-.16.832V12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 0 1 .382-.632l3.285-3.832a2.25 2.25 0 0 1 1.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0 0 21.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Total products
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {stats.total_products}
            </p>
          </div>
        </Link>
        {/* Total Orders */}
        <Link
          to="/orders"
          className="flex flex-col justify-between p-4 bg-blue-100 rounded-lg shadow-xs hover:bg-blue-200 transition"
        >
          <div className="flex items-center">
            <div className="p-3 mr-4 text-blue-500 bg-blue-200 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                />
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Total Orders
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {stats.total_orders}
              </p>
            </div>
          </div>
          <div className="mt-2 border-t pt-2 flex justify-between text-sm text-gray-600">
            <span>Today</span>
            <span>{stats.total_orders_today}</span>
          </div>
        </Link>
        {/* All Purchases and Today */}
        <Link
          to="/purchases"
          className="flex flex-col justify-between p-4 bg-blue-100 rounded-lg shadow-xs hover:bg-blue-200 transition"
        >
          <div className="flex items-center">
            <div className="p-3 mr-4 text-teal-500 bg-teal-200 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Total Purchases
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {stats.total_purchases}
              </p>
            </div>
          </div>
          <div className="mt-2 border-t pt-2 flex justify-between text-sm text-gray-600">
            <span>Today</span>
            <span>{stats.total_purchases_today}</span>
          </div>
        </Link>
      </div>

      <ProductStockChart />
      <PurchaseTrendChart />
      <SalesTrendChart />
    </div>
  );
};

export default Dashboard;
