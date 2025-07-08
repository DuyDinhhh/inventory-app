import httpAxios from "./httpAxios";

const PurchaseService = {
  index: async () => {
    return await httpAxios.get("purchase");
  },
  store: async (data) => {
    return await httpAxios.post("purchase", data);
  },
  approve: async (id) => {
    return await httpAxios.put(`purchase/approve/${id}`);
  },
  show: async (id) => {
    return await httpAxios.get(`purchase/${id}`);
  },
  update: async (id, data) => {
    return await httpAxios.post(`purchase/${id}`, data);
  },
  destroy: async (id) => {
    return await httpAxios.delete(`purchase/${id}`);
  },
};

export default PurchaseService;
