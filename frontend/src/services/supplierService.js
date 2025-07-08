import httpAxios from "./httpAxios";

const SupplierService = {
  index: async () => {
    return await httpAxios.get("supplier");
  },
  show: async (id) => {
    return await httpAxios.get(`supplier/${id}`);
  },
  store: async (data) => {
    return await httpAxios.post("supplier", data);
  },
  update: async (id, data) => {
    return await httpAxios.post(`supplier/${id}`, data);
  },
  destroy: async (id) => {
    return await httpAxios.delete(`supplier/${id}`);
  },
};

export default SupplierService;
