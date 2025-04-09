import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const eventApi = {
  getAllEvents: () => axios.get(`${BASE_URL}/events`),
  getEventById: (id: number) => axios.get(`${BASE_URL}/events/${id}`),
  createEvent: (eventData: any) => axios.post(`${BASE_URL}/events`, eventData),
  updateEvent: (id: number, eventData: any) => axios.put(`${BASE_URL}/events/${id}`, eventData),
  deleteEvent: (id: number) => axios.delete(`${BASE_URL}/events/${id}`)
};

export const churchApi = {
  getAllChurches: () => axios.get(`${BASE_URL}/churches`),
  getChurchById: (id: string) => axios.get(`${BASE_URL}/churches/${id}`),
  createChurch: (churchData: any) => axios.post(`${BASE_URL}/churches`, churchData),
  updateChurch: (id: string, churchData: any) => axios.put(`${BASE_URL}/churches/${id}`, churchData),
  deleteChurch: (id: string) => axios.delete(`${BASE_URL}/churches/${id}`)
};

export const receiptApi = {
  getAllReceipts: () => axios.get(`${BASE_URL}/receipts`),
  getReceiptById: (id: number) => axios.get(`${BASE_URL}/receipts/${id}`),
  createReceipt: (receiptData: any) => axios.post(`${BASE_URL}/receipts`, receiptData),
  updateReceipt: (id: number, receiptData: any) => axios.put(`${BASE_URL}/receipts/${id}`, receiptData),
  deleteReceipt: (id: number) => axios.delete(`${BASE_URL}/receipts/${id}`)
}; 