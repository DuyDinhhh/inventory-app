import httpAxios from "./httpAxios";

const DashboardService = {
  index: async () => {
    return await httpAxios.get("dashboard");
  },
};
export default DashboardService;
