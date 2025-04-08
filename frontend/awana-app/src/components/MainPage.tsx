import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '../services/api';
import backgroundImage from '../assets/gradient-background.png';

interface Event {
  event_ID: number;
  event_Name: string;
  event_Location: string;
  event_Year: number;
  event_Date: Date;
  event_Open_Available: boolean;
  event_Place: string;
}

const allEvents = [
  { name: '영성수련회', description: 'AWANA 지도자들의 영성 훈련 캠프' },
  { name: '성경퀴즈대회 설명회', description: '성경퀴즈대회 참가를 위한 설명회' },
  { name: '성경퀴즈대회', description: 'AWANA 성경퀴즈대회' },
  { name: 'YM Summit', description: '청년 지도자들을 위한 컨퍼런스' },
  { name: '컨퍼런스', description: 'AWANA 연차 컨퍼런스' },
  { name: '상반기 비티', description: '상반기 비티 훈련' },
  { name: '하반기 비티', description: '하반기 비티 훈련' },
  { name: '수시 비티', description: '수시 비티 훈련' },
  { name: '올림픽 설명회', description: 'AWANA 올림픽 참가를 위한 설명회' },
  { name: '올림픽', description: 'AWANA 올림픽 대회' },
  { name: '티앤티 캠프', description: 'T&T 캠프' },
  { name: '감독관학교 101', description: '감독관 기본 교육' },
  { name: '조정관학교 101', description: '조정관 기본 교육' },
  { name: '조정관학교 201', description: '조정관 심화 교육' },
  { name: '비전캠프', description: 'AWANA 비전캠프' },
  { name: '장학캠프', description: 'AWANA 장학캠프' },
  { name: 'MIT', description: 'Missionary In Training' }
];

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventApi.getAllEvents();
        setEvents(response.data);
      } catch (err) {
        setError('이벤트 목록을 불러오는데 실패했습니다.');
        console.error('Error fetching events:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (eventId: number) => {
    navigate(`/receipt/${eventId}`);
  };

  const getRandomMonth = () => {
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    return months[Math.floor(Math.random() * months.length)];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  const registeredEvents = events.map(event => event.event_Name);
  const allEventsWithStatus = allEvents.map(event => {
    const isRegistered = registeredEvents.includes(event.name);
    return {
      ...event,
      isRegistered,
      month: getRandomMonth()
    };
  });

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-4xl font-bold text-gray-900 text-center">AWANA KOREA</h1>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <div className="overflow-y-auto max-h-[600px] pr-4">
              <div className="space-y-4">
                {/* 영수증 발급 버튼 */}
                <div
                  onClick={() => navigate('/receipt')}
                  className="bg-blue-50/90 backdrop-blur-sm rounded-lg p-4 transform transition-all duration-300 hover:scale-[1.02] hover:bg-blue-100/90 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-semibold text-blue-900">영수증 발급</h2>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100/90 text-blue-800">
                          바로가기
                        </span>
                      </div>
                      <p className="text-blue-600">이벤트 참가 영수증을 발급받으세요</p>
                    </div>
                  </div>
                </div>

                {/* 이벤트 목록 */}
                {allEventsWithStatus.map((event, index) => {
                  const registeredEvent = events.find(e => e.event_Name === event.name);
                  
                  return (
                    <div
                      key={index}
                      onClick={() => registeredEvent && handleEventClick(registeredEvent.event_ID)}
                      className={`bg-gray-50/90 backdrop-blur-sm rounded-lg p-4 transform transition-all duration-300 hover:scale-[1.02] hover:bg-gray-100/90 ${
                        registeredEvent ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-semibold text-gray-900">{event.name}</h2>
                            {registeredEvent ? (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium
                                ${registeredEvent.event_Open_Available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {registeredEvent.event_Open_Available ? '신청 가능' : '마감'}
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Coming soon in {event.month}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-3">{event.description}</p>
                          
                          {registeredEvent && (
                            <div className="flex items-center space-x-6 text-gray-600">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{new Date(registeredEvent.event_Date).toLocaleDateString()}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{registeredEvent.event_Location}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage; 