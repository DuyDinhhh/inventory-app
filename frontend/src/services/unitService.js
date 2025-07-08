import httpAxios from "./httpAxios";

const UnitService = {
  index: async () => {
    return await httpAxios.get("unit");
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
};

export default UnitService;
