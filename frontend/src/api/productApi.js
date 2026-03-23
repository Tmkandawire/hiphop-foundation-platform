import axiosInstance from "./axiosInstance";

/*
 GET ALL PRODUCTS
*/
export const getProducts = () => {
  return axiosInstance.get("/products");
};

/*
 GET SINGLE PRODUCT
*/
export const getProduct = (id) => {
  return axiosInstance.get(`/products/${id}`);
};

/*
 CREATE PRODUCT
*/
export const createProduct = (data) => {
  return axiosInstance.post("/products", data);
};
