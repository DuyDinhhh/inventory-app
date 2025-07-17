import httpAxios from "./httpAxios";

const UserService = {
  index: async (page = 1) => {
    return await httpAxios.get(`user?page=${page}`);
  },
  login: async (data) => {
    return await httpAxios.post("/login", data);
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
  search: async (q, page = 1) => {
    return await httpAxios.get(
      `user/search?q=${encodeURIComponent(q)}&page=${page}`
    );
  },
  log: async (page = 1) => {
    return await httpAxios.get(`log?page=${page}`);
  },
  searchLogs: async (q, page = 1) => {
    return await httpAxios.get(
      `log/search?q=${encodeURIComponent(q)}&page=${page}`
    );
  },
};

export default UserService;
