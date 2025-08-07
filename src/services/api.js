import axios from "axios";

const API_URL = "https://finance-dashboard-backend-7r50.onrender.com/api";

export const getTransactions = () => axios.get(`${API_URL}/transactions`);

export const getMonthlySummary = () => axios.get(`${API_URL}/summary/monthly`);

export const getCategorySummary = () =>
  axios.get(`${API_URL}/summary/categories`);

export const addTransaction = (data) =>
  axios.post(`${API_URL}/transactions`, data);

export const deleteTransaction = (id) =>
  axios.delete(`${API_URL}/transactions/${id}`);

export const importTransactions = (formData) =>
  axios.post(`${API_URL}/transactions/import`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const exportTransactions = () =>
  axios.get(`${API_URL}/transactions/export`, { responseType: "blob" });
