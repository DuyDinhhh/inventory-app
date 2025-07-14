import httpAxios from "./httpAxios";

const CategoryService = {
  index: async (page = 1) => {
    return await httpAxios.get(`category?page=${page}`);
  },
  store: async (data) => {
    return await httpAxios.post("category", data);
  },
  show: async (id) => {
    return await httpAxios.get(`category/${id}`);
  },
  update: async (id, data) => {
    return await httpAxios.post(`category/${id}`, data);
  },
  destroy: async (id) => {
    return await httpAxios.delete(`category/${id}`);
  },
  search: async (q, page = 1) => {
    return await httpAxios.get(
      `category/search?q=${encodeURIComponent(q)}&page=${page}`
    );
  },
};

export default CategoryService;
