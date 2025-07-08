import httpAxios from "./httpAxios";

const OrderService = {
  index: async () => {
    return await httpAxios.get(`order`);
  },
  show: async (id) => {
    return await httpAxios.get(`order/${id}`);
  },
  complete: async (id) => {
    return await httpAxios.put(`order/complete/${id}`);
  },
  store: async (data) => {
    return await httpAxios.post(`order/`, data);
  },
  update: async (id, data) => {
    return await httpAxios.post(`order/${id}`, data);
  },
  delete: async (id) => {
    return await httpAxios.delete(`order/${id}`);
  },
};

export default OrderService;
