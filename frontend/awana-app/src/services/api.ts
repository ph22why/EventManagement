import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const eventApi = {
  getAllEvents: () => axios.get(`${BASE_URL}/events`),
  getSampleEvents: () => axios.get(`${BASE_URL}/events/sampleEvents`),
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

export interface Receipt {
  receipt_ID: number;
  event_ID: number;
  church_ID: string;
  receipt_Date: string;
  receipt_Amount: number;
  receipt_Of: string;
  receipt_Participants: string;
}

export interface CreateReceiptData {
  church_ID: string;
  event_ID: number;
  receipt_Amount: number;
  receipt_Date: string;
  receipt_Of: string;
  receipt_Participants: string;
}

export const receiptApi = {
  getAllReceipts: () => axios.get<Receipt[]>(`${BASE_URL}/receipts`),
  getReceiptById: (id: number) => axios.get<Receipt>(`${BASE_URL}/receipts/${id}`),
  createReceipt: (receiptData: CreateReceiptData) => axios.post<Receipt>(`${BASE_URL}/receipts`, receiptData),
  updateReceipt: (id: number, receiptData: Partial<CreateReceiptData>) => axios.put<Receipt>(`${BASE_URL}/receipts/${id}`, receiptData),
  deleteReceipt: (id: number) => axios.delete(`${BASE_URL}/receipts/${id}`)
}; 