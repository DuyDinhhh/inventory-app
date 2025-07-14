import httpAxios from "./httpAxios";
import axios from "axios";

const ProductService = {
  index: async (page = 1) => {
    return await httpAxios.get(`product?page=${page}`);
  },
  list: async () => {
    return await httpAxios.get("product/list");
  },
  show: async (id) => {
    return await httpAxios.get(`product/${id}`);
  },
  store: async (data) => {
    return await httpAxios.post(`product`, data);
  },
  update: async (id, data) => {
    return await httpAxios.post(`product/${id} `, data);
  },
  destroy: async (id) => {
    return await httpAxios.delete(`product/${id}`);
  },

  importPreview: async (data) => {
    return await httpAxios.post(`product/import/preview`, data);
  },
  importConfirm: async (data) => {
    return await httpAxios.post(`product/import/confirm`, data);
  },
  search: async (q, page = 1) => {
    return await httpAxios.get(
      `product/search?q=${encodeURIComponent(q)}&page=${page}`
    );
  },
};
export default ProductService;

export const exportProducts = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://127.0.0.1:8000/api/product/export", {
    responseType: "blob",
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  return response;
};
