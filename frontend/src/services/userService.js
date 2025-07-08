import httpAxios from "./httpAxios";

const UserService = {
  login: async (data) => {
    return await httpAxios.post("/login", data);
  },
  index: async () => {
    return await httpAxios.get("user");
  },
  store: async (data) => {
    return await httpAxios.post("user", data);
  },
  update: async (id, data) => {
    return await httpAxios.post(`user/${id}`, data);
  },
  show: async (id) => {
    return await httpAxios.get(`user/${id}`);
  },
  destroy: async (id) => {
    return await httpAxios.delete(`user/${id}`);
  },
  roles: async () => {
    return await httpAxios.get("roles");
  },
};

export default UserService;
