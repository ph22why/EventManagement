import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface Event {
  event_ID: number;
  event_Name: string;
  event_Location: string;
  event_Year: number;
  event_Date: Date;
  event_Open_Available: boolean;
  event_Place: string;
}

type CreateEventData = Omit<Event, 'event_ID'>;
type UpdateEventData = Partial<Event>;

// 이벤트 관련 API
export const eventApi = {
  // 모든 이벤트 조회
  getAllEvents: () => {
    return axios.get<Event[]>(`${API_BASE_URL}/api/events`);
  },

  // 샘플 이벤트 조회
  getSampleEvents: () => {
    return axios.get<Event[]>(`${API_BASE_URL}/api/events/sampleEvents`);
  },

  // 특정 년도의 이벤트 조회
  getEventsByYear: (year: number) => {
    return axios.get<Event[]>(`${API_BASE_URL}/api/events/year/${year}`);
  },

  // 공개된 최신 이벤트만 조회
  getLatestEvents: () => {
    return axios.get<Event[]>(`${API_BASE_URL}/api/events/latest`);
  },

  // 새 이벤트 생성
  createEvent: (eventData: CreateEventData) => {
    return axios.post<Event>(`${API_BASE_URL}/api/events`, eventData);
  },

  // 이벤트 수정
  updateEvent: (id: number, eventData: UpdateEventData) => {
    return axios.put<Event>(`${API_BASE_URL}/api/events/${id}`, eventData);
  },

  // 이벤트 삭제
  deleteEvent: (id: number) => {
    return axios.delete(`${API_BASE_URL}/api/events/${id}`);
  },

  // 이벤트 공개/비공개 설정
  toggleEventAvailability: (id: number) => {
    return axios.patch<Event>(`${API_BASE_URL}/api/events/${id}/toggle-availability`);
  }
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

export default eventApi; 