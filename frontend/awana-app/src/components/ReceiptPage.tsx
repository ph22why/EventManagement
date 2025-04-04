import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi, churchApi } from '../services/api';
import backgroundImage from '../assets/gradient-background.png';

interface Church {
  id: number;
  name: string;
}

interface Event {
  id: number;
  title: string;
}

const ReceiptPage: React.FC = () => {
  // 상태 관리
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [churches, setChurches] = useState<Church[]>([]);
  const [selectedChurch, setSelectedChurch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showNoChurchMessage, setShowNoChurchMessage] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 이벤트 목록 불러오기
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventApi.getAllEvents();
        setEvents(response.data);
      } catch (err) {
        setError('이벤트 목록을 불러오는데 실패했습니다.');
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

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
          const response = await churchApi.getChurchByPhone(formatted);
          setChurches(response.data);
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
    if (value.length <= 3) {
      setRegistrationNumber(value);
      if (value.length === 3) {
        setIsLoading(true);
        try {
          const response = await churchApi.getChurchByRegId(value);
          setChurches(response.data);
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
              {/* 이벤트 선택 */}
              <div>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="이벤트 선택"
                >
                  <option value="">이벤트 선택</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* 등록번호와 전화번호 입력 (가로 배치) */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={handleRegistrationNumber}
                    placeholder="등록번호 (3자리)"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={3}
                    aria-label="등록번호"
                  />
                </div>
                <div className="col-span-2">
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
                  <select
                    value={selectedChurch}
                    onChange={(e) => setSelectedChurch(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="교회 선택"
                  >
                    <option value="">교회를 선택하세요</option>
                    {churches.map((church) => (
                      <option key={church.id} value={church.id}>
                        {church.name}
                      </option>
                    ))}
                  </select>
                ) : showNoChurchMessage && (
                  <div className="text-sm text-red-500">
                    해당 전화번호로 등록된 교회 정보가 없습니다.
                  </div>
                )}
              </div>

              {/* 홈으로 버튼 */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => window.history.back()}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
                >
                  홈으로
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