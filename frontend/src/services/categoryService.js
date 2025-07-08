import httpAxios from "./httpAxios";

const CategoryService = {
  index: async () => {
    return await httpAxios.get("category");
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
};

export default CategoryService;
