import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi, churchApi } from '../services/api';
import backgroundImage from '../assets/gradient-background.png';
import type { Church } from '../types/church';
import type { Event } from '../types/event';

const ReceiptPage: React.FC = () => {
  // 상태 관리
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [churches, setChurches] = useState<Church[]>([]);
  const [selectedChurch, setSelectedChurch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showNoChurchMessage, setShowNoChurchMessage] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 이벤트 목록 불러오기
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventApi.getAllEvents();
        console.log('Fetched events:', response.data); // 디버깅용 로그
        setEvents(response.data);
      } catch (err) {
        setError('이벤트 목록을 불러오는데 실패했습니다.');
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  // 선택된 이벤트 정보 가져오기
  const selectedEventInfo = events.find(event => event.event_ID.toString() === selectedEvent);

  // 년도별 이벤트 필터링
  const filteredEvents = events.filter(event => {
    if (!event.event_Date) return false;
    
    try {
      // 날짜 문자열이 ISO 형식인지 확인
      const dateStr = event.event_Date.includes('T') 
        ? event.event_Date 
        : `${event.event_Date}T00:00:00`;
      
      const eventDate = new Date(dateStr);
      if (isNaN(eventDate.getTime())) {
        console.error('Invalid date:', event.event_Date);
        return false;
      }
      
      const eventYear = eventDate.getFullYear().toString();
      const matches = eventYear === selectedYear;
      console.log(`Event ${event.event_Name}: ${event.event_Date} -> ${eventYear}, matches ${selectedYear}: ${matches}`);
      return matches;
    } catch (error) {
      console.error('Error parsing date:', event.event_Date, error);
      return false;
    }
  });

  // 사용 가능한 년도 목록 생성
  const availableYears = Array.from(
    new Set(
      events
        .filter(event => event.event_Date)
        .map(event => {
          try {
            const dateStr = event.event_Date.includes('T') 
              ? event.event_Date 
              : `${event.event_Date}T00:00:00`;
            const year = new Date(dateStr).getFullYear();
            return isNaN(year) ? null : year;
          } catch (error) {
            console.error('Error parsing date for year:', event.event_Date, error);
            return null;
          }
        })
        .filter((year): year is number => year !== null)
    )
  ).sort((a, b) => b - a);

  console.log('Selected year:', selectedYear); // 디버깅용 로그
  console.log('Filtered events:', filteredEvents); // 디버깅용 로그
  console.log('Available years:', availableYears); // 디버깅용 로그

  // 이벤트 년도가 변경될 때 선택된 이벤트 초기화
  useEffect(() => {
    setSelectedEvent('');
  }, [selectedYear]);

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  // 전화번호 입력 핸들러
  const handlePhoneNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted.length <= 13) { // 최대 길이 제한 (010-1234-5678)
      setPhoneNumber(formatted);
      // 전화번호가 완전히 입력되었을 때만 메시지 표시
      setShowNoChurchMessage(formatted.length === 13);
      if (formatted.length === 13) {
        setIsLoading(true);
        try {
          const response = await churchApi.getAllChurches();
          const churches = response.data.filter((church: any) => 
            church.church_Phone?.includes(formatted.replace(/-/g, ''))
          );
          setChurches(churches);
        } catch (err) {
          console.error('Error fetching church by phone:', err);
          setChurches([]);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  // 등록번호 입력 핸들러
  const handleRegistrationNumber = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 4) {
      setRegistrationNumber(value);
      if (value.length === 4) {
        setIsLoading(true);
        try {
          const response = await churchApi.getAllChurches();
          const churches = response.data.filter((church: any) => 
            church.church_reg_ID?.includes(value)
          );
          setChurches(churches);
        } catch (err) {
          console.error('Error fetching church by regId:', err);
          setChurches([]);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
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
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-4xl font-bold text-gray-900 text-center">영수증 발급</h1>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <div className="space-y-6">
              {/* 년도와 이벤트 선택 (가로 배치) */}
              <div className="grid grid-cols-2 gap-4">
                {/* 년도 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    년도 선택
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="년도 선택"
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}년
                      </option>
                    ))}
                  </select>
                </div>

                {/* 이벤트 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이벤트 선택
                  </label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="이벤트 선택"
                  >
                    <option value="">이벤트 선택</option>
                    {filteredEvents.map((event) => (
                      <option key={event.event_ID} value={event.event_ID.toString()}>
                        {event.event_Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 등록번호와 전화번호 입력 (가로 배치) */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    등록번호
                  </label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={handleRegistrationNumber}
                    placeholder="등록번호 (4자리)"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={4}
                    aria-label="등록번호"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전화번호
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="전화번호 (010-0000-0000)"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="전화번호"
                  />
                </div>
              </div>

              {/* 교회 선택 (전화번호 조회 결과) */}
              <div>
                {isLoading ? (
                  <div className="text-sm text-gray-500">교회 정보를 조회중입니다...</div>
                ) : churches.length > 0 ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      교회 선택
                    </label>
                    <select
                      value={selectedChurch}
                      onChange={(e) => setSelectedChurch(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="교회 선택"
                    >
                      <option value="">교회를 선택하세요</option>
                      {churches.map((church) => (
                        <option key={church.church_reg_ID} value={church.church_reg_ID}>
                          {church.church_Name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : showNoChurchMessage && (
                  <div className="text-sm text-red-500">
                    해당 전화번호로 등록된 교회 정보가 없습니다.
                  </div>
                )}
              </div>

              {/* 버튼 */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => window.history.back()}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
                >
                  뒤로
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
                >
                  발급하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage; 