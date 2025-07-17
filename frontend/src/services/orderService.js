import httpAxios from "./httpAxios";

const OrderService = {
  index: async (page = 1) => {
    return await httpAxios.get(`order?page=${page}`);
  },
  show: async (id) => {
    return await httpAxios.get(`order/${id}`);
  },
  complete: async (id) => {
    return await httpAxios.put(`order/complete/${id}`);
  },
  cancel: async (id) => {
    return await httpAxios.put(`order/cancel/${id}`);
  },
  return: async (id) => {
    return await httpAxios.put(`order/return/${id}`);
  },
  store: async (data) => {
    return await httpAxios.post(`order/`, data);
  },
  update: async (id, data) => {
    return await httpAxios.post(`order/${id}`, data);
  },
  destroy: async (id) => {
    return await httpAxios.delete(`order/${id}`);
  },
  search: async (q, page = 1) => {
    return await httpAxios.get(
      `order/search?q=${encodeURIComponent(q)}&page=${page}`
    );
  },
  pendingOrders: async (page = 1) => {
    return await httpAxios.get(`order/pendingOrders?page=${page}`);
  },
  completeOrders: async (page = 1) => {
    return await httpAxios.get(`order/completeOrders?page=${page}`);
  },
  returnOrders: async (page = 1) => {
    return await httpAxios.get(`order/returnOrders?page=${page}`);
  },
};

export default OrderService;
