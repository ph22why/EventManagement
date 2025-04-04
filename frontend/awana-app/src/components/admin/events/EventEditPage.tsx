import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import backgroundImage from '../../../assets/gradient-background.png';
import { eventApi } from '../../../services/api';

interface EventFormData {
  eventId: number;
  description: string;
  startDate: string;
  endDate: string;
  regionSets: {
    id: number;
    regions: string[];
  }[];
  location: string | null;
  maxParticipants: number | null;
  registrationFee: number | null;
  isPublic: boolean;
}

interface Event {
  id: number;
  name: string;
}

const EventEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState<EventFormData>({
    eventId: 0,
    description: '',
    startDate: '',
    endDate: '',
    regionSets: [{ id: 1, regions: [] }],
    location: null,
    maxParticipants: null,
    registrationFee: null,
    isPublic: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    if (id) {
      fetchEventData(parseInt(id));
    }
  }, [id]);

  const fetchEvents = async () => {
    try {
      const response = await eventApi.getAllEvents();
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const fetchEventData = async (eventId: number) => {
    try {
      setLoading(true);
      const response = await eventApi.getEventById(eventId);
      const eventData = response.data;
      setFormData({
        eventId: eventData.id,
        description: eventData.description,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        regionSets: eventData.regionSets,
        location: eventData.location,
        maxParticipants: eventData.maxParticipants,
        registrationFee: eventData.registrationFee,
        isPublic: eventData.isPublic,
      });
    } catch (err) {
      console.error('Error fetching event data:', err);
      setError('이벤트 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'location') {
      setFormData(prev => ({
        ...prev,
        location: value || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                 type === 'number' ? (value === '' ? null : Number(value)) : value
      }));
    }
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>, setId: number, index: number) => {
    const newValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      regionSets: prev.regionSets.map(set => {
        if (set.id === setId) {
          const newRegions = [...set.regions];
          newRegions[index] = newValue;
          return { ...set, regions: newRegions };
        }
        return set;
      })
    }));
  };

  const addRegionInput = (setId: number) => {
    setFormData(prev => ({
      ...prev,
      regionSets: prev.regionSets.map(set => 
        set.id === setId ? { ...set, regions: [...set.regions, ''] } : set
      )
    }));
  };

  const removeRegionInput = (setId: number, index: number) => {
    setFormData(prev => ({
      ...prev,
      regionSets: prev.regionSets.map(set => 
        set.id === setId ? { 
          ...set, 
          regions: set.regions.filter((_, i) => i !== index)
        } : set
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      await eventApi.updateEvent(parseInt(id!), formData);
      setSuccess('이벤트가 성공적으로 수정되었습니다.');
    } catch (err) {
      console.error('Error updating event:', err);
      setError('이벤트 수정 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* 배경 이미지 */}
      <div 
        className="fixed inset-0 z-0" 
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.9
        }}
      />
      
      {/* 컨텐츠 */}
      <div className="relative z-10 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">이벤트 수정</h1>
              <button
                onClick={() => navigate('/admin/events/manage')}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
              >
                뒤로 가기
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-2">
                  이벤트명
                </label>
                <select
                  id="eventId"
                  name="eventId"
                  value={formData.eventId}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">이벤트 선택</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  사용자 화면에 나타낼 문구
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    시작일
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                    종료일
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">지역 세트</h3>
                
                {formData.regionSets.map((set, setIndex) => (
                  <div key={set.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-md font-medium text-gray-700">지역 세트 {setIndex + 1}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {set.regions.map((region, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={region}
                              onChange={(e) => handleRegionChange(e, set.id, index)}
                              placeholder="지역을 입력하세요"
                              className="w-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                            {set.regions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeRegionInput(set.id, index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addRegionInput(set.id)}
                          className="w-32 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition duration-200 ease-in-out flex items-center justify-center"
                        >
                          + 지역 추가
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  장소
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  placeholder="미정"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                    최대 참가자 수
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    name="maxParticipants"
                    value={formData.maxParticipants || ''}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="미정"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="registrationFee" className="block text-sm font-medium text-gray-700 mb-2">
                    등록비
                  </label>
                  <input
                    type="number"
                    id="registrationFee"
                    name="registrationFee"
                    value={formData.registrationFee || ''}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="미정"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="isPublic" className="text-lg font-medium text-gray-900 cursor-pointer">
                    공개 여부
                  </label>
                  <p className="text-sm text-gray-500">
                    체크 시 사용자 화면에 이벤트가 표시됩니다.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
              >
                이벤트 수정
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventEditPage; 