import httpAxios from "./httpAxios";

const CustomerService = {
  index: async (page = 1) => {
    return await httpAxios.get(`customer?page=${page}`);
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
  search: async (q, page = 1) => {
    return await httpAxios.get(
      `customer/search?q=${encodeURIComponent(q)}&page=${page}`
    );
  },
};

export default CustomerService;
