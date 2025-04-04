import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// 이벤트 관련 API
export const eventApi = {
  getAllEvents: () => axios.get(`${API_BASE_URL}/events`),
  getEventById: (id: number) => axios.get(`${API_BASE_URL}/events/${id}`),
  createEvent: (data: any) => axios.post(`${API_BASE_URL}/events`, data),
  updateEvent: (id: number, data: any) => axios.put(`${API_BASE_URL}/events/${id}`, data),
  deleteEvent: (id: number) => axios.delete(`${API_BASE_URL}/events/${id}`),
};

// 교회 관련 API
export const churchApi = {
  getAllChurches: () => axios.get(`${API_BASE_URL}/churches`),
  getChurchById: (id: number) => axios.get(`${API_BASE_URL}/churches/${id}`),
  getChurchByRegId: (regId: string) => axios.get(`${API_BASE_URL}/churches/reg/${regId}`),
  getChurchByPhone: (phone: string) => axios.get(`${API_BASE_URL}/churches/phone/${phone}`),
  createChurch: (data: any) => axios.post(`${API_BASE_URL}/churches`, data),
  updateChurch: (id: number, data: any) => axios.put(`${API_BASE_URL}/churches/${id}`, data),
  deleteChurch: (id: number) => axios.delete(`${API_BASE_URL}/churches/${id}`),
}; 

// 영수증 관련 API
export const receiptApi = {
  getAllReceipts: () => axios.get(`${API_BASE_URL}/receipts`),
  getReceiptById: (id: number) => axios.get(`${API_BASE_URL}/receipts/${id}`),
  updateReceipt: (id: number, data: any) => axios.put(`${API_BASE_URL}/receipts/${id}`, data),
}; 