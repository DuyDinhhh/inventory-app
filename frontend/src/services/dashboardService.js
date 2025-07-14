import httpAxios from "./httpAxios";

const DashboardService = {
  index: async () => {
    return await httpAxios.get("dashboard");
  },
  barchart: async () => {
    return await httpAxios.get("dashboard/barchart");
  },
  getPurchaseData: async () => {
    return await httpAxios.get("dashboard/purchaseTrendOverTime");
  },
  getSalesData: async () => {
    return await httpAxios.get("dashboard/saleTrendOverTime");
  },
};
export default DashboardService;
