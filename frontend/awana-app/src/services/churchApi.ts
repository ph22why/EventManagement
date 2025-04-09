import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const churchApi = {
  getAllChurches: () => axios.get(`${API_URL}/churches`),
  getChurchById: (id: string) => axios.get(`${API_URL}/churches/${id}`),
  createChurch: (churchData: any) => axios.post(`${API_URL}/churches`, churchData),
  updateChurch: (id: string, churchData: any) => axios.put(`${API_URL}/churches/${id}`, churchData),
  deleteChurch: (id: string) => axios.delete(`${API_URL}/churches/${id}`),
  getChurchByPhone: (phone: string) => axios.get(`${API_URL}/churches/phone/${phone}`),
  getChurchByRegId: (regId: string) => axios.get(`${API_URL}/churches/reg/${regId}`)
};

export default churchApi; 