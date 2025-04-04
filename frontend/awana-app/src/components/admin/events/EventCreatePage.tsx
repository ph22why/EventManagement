import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../../assets/gradient-background.png';
import { eventApi } from '../../../services/api';

interface RegionSet {
  id: number;
  regions: string[];
}

interface EventFormData {
  event_Name: string;
  event_Date: string;
  event_Location: string;
  event_Place: string;
  event_Year: number;
  regionSets: RegionSet[];
  maxParticipants: number | null;
  registrationFee: number | null;
  isPublic: boolean;
}

interface Event {
  id: number;
  event_Name: string;
  event_Date: string;
  event_Location: string;
  event_Place: string;
  event_Year: number;
  regionSets: RegionSet[];
  maxParticipants: number | null;
  registrationFee: number | null;
  isPublic: boolean;
}

const EventCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState<EventFormData>({
    event_Name: '',
    event_Date: '',
    event_Location: '',
    event_Place: '',
    event_Year: new Date().getFullYear(),
    regionSets: [{ id: 1, regions: [] }],
    maxParticipants: null,
    registrationFee: null,
    isPublic: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCopyModal, setShowCopyModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventApi.getAllEvents();
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
               type === 'number' ? (value === '' ? null : Number(value)) : value
    }));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>, setId: number, index: number) => {
    const newValue = e.target.value;
    setFormData(prev => {
      const updatedRegionSets = prev.regionSets.map(set => {
        if (set.id === setId) {
          const newRegions = [...set.regions];
          newRegions[index] = newValue;
          return { ...set, regions: newRegions };
        }
        return set;
      });

      // 모든 지역 세트의 지역들을 조합하여 event_Location 설정
      const allRegions = updatedRegionSets
        .map(set => set.regions.filter(region => region.trim() !== ''))
        .flat()
        .join(', ');

      return {
        ...prev,
        regionSets: updatedRegionSets,
        event_Location: allRegions
      };
    });
  };

  const addRegionInput = (setId: number) => {
    setFormData(prev => {
      const updatedRegionSets = prev.regionSets.map(set => 
        set.id === setId ? { ...set, regions: [...set.regions, ''] } : set
      );

      // 모든 지역 세트의 지역들을 조합하여 event_Location 설정
      const allRegions = updatedRegionSets
        .map(set => set.regions.filter(region => region.trim() !== ''))
        .flat()
        .join(', ');

      return {
        ...prev,
        regionSets: updatedRegionSets,
        event_Location: allRegions
      };
    });
  };

  const removeRegionInput = (setId: number, index: number) => {
    setFormData(prev => {
      const updatedRegionSets = prev.regionSets.map(set => 
        set.id === setId ? { 
          ...set, 
          regions: set.regions.filter((_, i) => i !== index)
        } : set
      );

      // 모든 지역 세트의 지역들을 조합하여 event_Location 설정
      const allRegions = updatedRegionSets
        .map(set => set.regions.filter(region => region.trim() !== ''))
        .flat()
        .join(', ');

      return {
        ...prev,
        regionSets: updatedRegionSets,
        event_Location: allRegions
      };
    });
  };

  const addRegionSet = () => {
    setFormData(prev => {
      const updatedRegionSets = [
        ...prev.regionSets,
        { id: Math.max(...prev.regionSets.map(set => set.id)) + 1, regions: [''] }
      ];

      // 모든 지역 세트의 지역들을 조합하여 event_Location 설정
      const allRegions = updatedRegionSets
        .map(set => set.regions.filter(region => region.trim() !== ''))
        .flat()
        .join(', ');

      return {
        ...prev,
        regionSets: updatedRegionSets,
        event_Location: allRegions
      };
    });
  };

  const removeRegionSet = (setId: number) => {
    setFormData(prev => {
      const updatedRegionSets = prev.regionSets.filter(set => set.id !== setId);

      // 모든 지역 세트의 지역들을 조합하여 event_Location 설정
      const allRegions = updatedRegionSets
        .map(set => set.regions.filter(region => region.trim() !== ''))
        .flat()
        .join(', ');

      return {
        ...prev,
        regionSets: updatedRegionSets,
        event_Location: allRegions
      };
    });
  };

  const handleCopyEvent = (event: Event) => {
    const currentYear = new Date().getFullYear();
    const eventDate = new Date(event.event_Date);
    eventDate.setFullYear(currentYear);

    setFormData({
      event_Name: `${event.event_Name} ${currentYear}`,
      event_Date: eventDate.toISOString().split('T')[0],
      event_Location: event.event_Location,
      event_Place: event.event_Place,
      event_Year: currentYear,
      regionSets: event.regionSets.map(set => ({
        ...set,
        id: Math.random() // 새로운 ID 생성
      })),
      maxParticipants: event.maxParticipants,
      registrationFee: event.registrationFee,
      isPublic: event.isPublic,
    });
    setShowCopyModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      await eventApi.createEvent(formData);
      setSuccess('이벤트가 성공적으로 생성되었습니다.');
      setFormData({
        event_Name: '',
        event_Date: '',
        event_Location: '',
        event_Place: '',
        event_Year: new Date().getFullYear(),
        regionSets: [{ id: 1, regions: [] }],
        maxParticipants: null,
        registrationFee: null,
        isPublic: true,
      });
    } catch (err) {
      console.error('Error creating event:', err);
      setError('이벤트 생성 중 오류가 발생했습니다.');
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900">이벤트 생성</h1>
              <div className="space-x-4">
                <button
                  onClick={() => setShowCopyModal(true)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
                >
                  기존 이벤트 복사
                </button>
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
                >
                  뒤로 가기
                </button>
              </div>
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
                <label htmlFor="event_Name" className="block text-sm font-medium text-gray-700 mb-2">
                  이벤트명
                </label>
                <input
                  type="text"
                  id="event_Name"
                  name="event_Name"
                  value={formData.event_Name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="event_Date" className="block text-sm font-medium text-gray-700 mb-2">
                  이벤트 날짜
                </label>
                <input
                  type="date"
                  id="event_Date"
                  name="event_Date"
                  value={formData.event_Date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="event_Place" className="block text-sm font-medium text-gray-700 mb-2">
                  장소
                </label>
                <input
                  type="text"
                  id="event_Place"
                  name="event_Place"
                  value={formData.event_Place}
                  onChange={handleInputChange}
                  placeholder="장소를 입력하세요"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">지역 세트</h3>
                  <button
                    type="button"
                    onClick={addRegionSet}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
                  >
                    + 지역 세트 추가
                  </button>
                </div>
                
                {formData.regionSets.map((set, setIndex) => (
                  <div key={set.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-md font-medium text-gray-700">지역 세트 {setIndex + 1}</h4>
                      {formData.regionSets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRegionSet(set.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          삭제
                        </button>
                      )}
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
                이벤트 생성
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 기존 이벤트 복사 모달 */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">기존 이벤트 복사</h2>
              <button
                onClick={() => setShowCopyModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleCopyEvent(event)}
                >
                  <div className="font-medium text-gray-900">{event.event_Name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(event.event_Date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCreatePage; 