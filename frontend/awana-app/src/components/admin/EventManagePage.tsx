import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/gradient-background.png';
import { eventApi } from '../../services/api';

interface Event {
  event_ID: number;
  event_Name: string;
  event_Description: string;
  event_Period: string;
  event_Region: string;
  event_Place: string;
  event_Participants: string;
  event_Open_Available: boolean;
}

interface ApiResponse {
  data: Event[];
}

const defaultEvents = [
  '영성수련회',
  '성경퀴즈대회 설명회',
  '성경퀴즈대회',
  'YM Summit',
  '컨퍼런스',
  '상반기 비티',
  '하반기 비티',
  '수시 비티',
  '올림픽 설명회',
  '올림픽',
  '티앤티 캠프',
  '감독관학교 101',
  '조정관학교 101',
  '조정관학교 201',
  '비전캠프',
  '장학캠프',
  'MIT'
];

const EventManagePage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [selectedEventName, setSelectedEventName] = useState('');
  const [newEventData, setNewEventData] = useState<Partial<Event>>({
    event_Description: '',
    event_Period: '',
    event_Region: '',
    event_Place: '',
    event_Participants: '',
    event_Open_Available: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventApi.getAllEvents();
      const eventData = Array.isArray(response.data) ? response.data : response.data.data;
      setEvents(eventData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('이벤트 목록을 불러오는데 실패했습니다.');
      setIsLoading(false);
    }
  };

  const handleAddEvent = async () => {
    try {
      const eventData = {
        event_Name: selectedEventName,
        ...newEventData
      };
      
      await eventApi.createEvent(eventData);
      setShowAddEventModal(false);
      setSelectedEventName('');
      setNewEventData({
        event_Description: '',
        event_Period: '',
        event_Region: '',
        event_Place: '',
        event_Participants: '',
        event_Open_Available: true
      });
      fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);
      setError('이벤트 생성에 실패했습니다.');
    }
  };

  const handleToggleAvailability = async (event: Event) => {
    try {
      await eventApi.updateEvent(event.event_ID, {
        ...event,
        event_Open_Available: !event.event_Open_Available
      });
      fetchEvents();
    } catch (err) {
      console.error('Error toggling event availability:', err);
      setError('이벤트 상태 변경에 실패했습니다.');
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm('정말로 이 이벤트를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await eventApi.deleteEvent(eventId);
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('이벤트 삭제에 실패했습니다.');
    }
  };

  const getAvailableEventNames = () => {
    const existingEvents = events.map(event => event.event_Name);
    return defaultEvents.filter(name => !existingEvents.includes(name));
  };

  if (isLoading) {
    return <div className="p-4">로딩 중...</div>;
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">이벤트 관리</h1>
              <div className="space-x-4">
                <button
                  onClick={() => setShowAddEventModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
                >
                  이벤트 생성
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

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      이벤트명
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      설명
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      기간
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      지역
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      장소
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      참가자/비용
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={`event-${event.event_ID}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{event.event_Name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{event.event_Description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{event.event_Period}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{event.event_Region}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{event.event_Place}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{event.event_Participants}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          event.event_Open_Available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {event.event_Open_Available ? '공개' : '비공개'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleToggleAvailability(event)}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label={`${event.event_Name} 상태 변경`}
                        >
                          상태 변경
                        </button>
                        <button
                          onClick={() => navigate(`/admin/events/edit/${event.event_ID}`)}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label={`${event.event_Name} 수정`}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.event_ID)}
                          className="text-red-600 hover:text-red-900"
                          aria-label={`${event.event_Name} 삭제`}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showAddEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">새 이벤트 추가</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">이벤트</label>
                <select
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  value={selectedEventName}
                  onChange={(e) => setSelectedEventName(e.target.value)}
                  aria-label="이벤트 선택"
                >
                  <option value="">이벤트 선택</option>
                  {getAvailableEventNames().map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="event-description" className="block text-sm font-medium text-gray-700">설명</label>
                <textarea
                  id="event-description"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  value={newEventData.event_Description}
                  onChange={(e) => setNewEventData({...newEventData, event_Description: e.target.value})}
                  placeholder="이벤트 설명을 입력하세요"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="event-period" className="block text-sm font-medium text-gray-700">기간</label>
                <input
                  id="event-period"
                  type="text"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  value={newEventData.event_Period}
                  onChange={(e) => setNewEventData({...newEventData, event_Period: e.target.value})}
                  placeholder="이벤트 기간을 입력하세요"
                />
              </div>
              <div>
                <label htmlFor="event-region" className="block text-sm font-medium text-gray-700">지역</label>
                <input
                  id="event-region"
                  type="text"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  value={newEventData.event_Region}
                  onChange={(e) => setNewEventData({...newEventData, event_Region: e.target.value})}
                  placeholder="지역을 입력하세요"
                />
              </div>
              <div>
                <label htmlFor="event-place" className="block text-sm font-medium text-gray-700">장소</label>
                <input
                  id="event-place"
                  type="text"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  value={newEventData.event_Place}
                  onChange={(e) => setNewEventData({...newEventData, event_Place: e.target.value})}
                  placeholder="장소를 입력하세요"
                />
              </div>
              <div>
                <label htmlFor="event-participants" className="block text-sm font-medium text-gray-700">참가자/비용</label>
                <input
                  id="event-participants"
                  type="text"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  value={newEventData.event_Participants}
                  onChange={(e) => setNewEventData({...newEventData, event_Participants: e.target.value})}
                  placeholder="참가자 정보 또는 비용을 입력하세요"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="event-available"
                  type="checkbox"
                  className="mr-2"
                  checked={newEventData.event_Open_Available}
                  onChange={(e) => setNewEventData({...newEventData, event_Open_Available: e.target.checked})}
                />
                <label htmlFor="event-available" className="text-sm font-medium text-gray-700">공개</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddEventModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                취소
              </button>
              <button
                onClick={handleAddEvent}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={!selectedEventName}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagePage; 