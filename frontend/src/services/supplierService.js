import httpAxios from "./httpAxios";

const SupplierService = {
  // index: async () => {
  //   return await httpAxios.get("supplier");
  // },
  index: async (page = 1) => {
    return await httpAxios.get(`supplier?page=${page}`);
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
  search: async (q, page = 1) => {
    return await httpAxios.get(
      `supplier/search?q=${encodeURIComponent(q)}&page=${page}`
    );
  },
};

export default SupplierService;
