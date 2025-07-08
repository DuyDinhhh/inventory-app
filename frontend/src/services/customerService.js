import httpAxios from "./httpAxios";

const CustomerService = {
  index: async () => {
    return await httpAxios.get("customer");
  },
  store: async (data) => {
    return await httpAxios.post("customer", data);
  },
  show: async (id) => {
    return await httpAxios.get(`customer/${id}`);
  },
  update: async (id, data) => {
    return await httpAxios.post(`customer/${id}`, data);
  },
  destroy: async (id) => {
    return await httpAxios.delete(`customer/${id}`);
  },
};

export default CustomerService;
