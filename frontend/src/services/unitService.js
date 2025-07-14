import httpAxios from "./httpAxios";

const UnitService = {
  index: async (page = 1) => {
    return await httpAxios.get(`unit?page=${page}`);
  },
  store: async (data) => {
    return await httpAxios.post("unit", data);
  },
  update: async (id, data) => {
    return await httpAxios.post(`unit/${id}`, data);
  },
  show: async (id) => {
    return await httpAxios.get(`unit/${id}`);
  },
  destroy: async (id) => {
    return await httpAxios.delete(`unit/${id}`);
  },
  search: async (q, page = 1) => {
    return await httpAxios.get(
      `unit/search?q=${encodeURIComponent(q)}&page=${page}`
    );
  },
};

export default UnitService;
