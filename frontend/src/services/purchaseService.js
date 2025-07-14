import httpAxios from "./httpAxios";

const PurchaseService = {
  index: async (page = 1) => {
    return await httpAxios.get(`purchase?page=${page}`);
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
  search: async (q, page = 1) => {
    return await httpAxios.get(
      `purchase/search?q=${encodeURIComponent(q)}&page=${page}`
    );
  },
  pendingPurchases: async (page = 1) => {
    return await httpAxios.get(`purchase/pendingPurchases?page=${page}`);
  },
  approvePurchases: async (page = 1) => {
    return await httpAxios.get(`purchase/approvePurchases?page=${page}`);
  },
};

export default PurchaseService;
