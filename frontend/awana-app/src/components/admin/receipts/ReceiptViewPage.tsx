import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../../assets/gradient-background.png';
import { receiptApi } from '../../../services/api';

interface Receipt {
  id: number;
  eventName: string;
  churchName: string;
  registrationNumber: string;
  phoneNumber: string;
  amount: number;
  issueDate: string;
  status: string;
}

const ReceiptViewPage: React.FC = () => {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [selectedEvent, setSelectedEvent] = useState('all');

  useEffect(() => {
    fetchReceipts();
  }, [year, selectedEvent]);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const response = await receiptApi.getAllReceipts();
      setReceipts(response.data);
    } catch (err) {
      setError('영수증 데이터를 불러오는데 실패했습니다.');
      console.error('Error fetching receipts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      // TODO: 엑셀 다운로드 기능 구현
      console.log('Downloading receipts...');
    } catch (err) {
      setError('엑셀 다운로드에 실패했습니다.');
      console.error('Error downloading receipts:', err);
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">영수증 데이터 조회</h1>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
              >
                뒤로 가기
              </button>
            </div>

            {/* 필터 섹션 */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-2">
                  연도
                </label>
                <select
                  id="year-select"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <option key={y} value={y.toString()}>{y}년</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-2">
                  이벤트
                </label>
                <select
                  id="event-select"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">전체</option>
                  {/* TODO: 이벤트 목록 추가 */}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
                >
                  엑셀 다운로드
                </button>
              </div>
            </div>

            {/* 데이터 테이블 */}
            {loading ? (
              <div className="text-center py-8">로딩 중...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        이벤트
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        교회
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        등록번호
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        전화번호
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        금액
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        발급일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {receipts.map((receipt) => (
                      <tr key={receipt.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {receipt.eventName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {receipt.churchName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {receipt.registrationNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {receipt.phoneNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {receipt.amount.toLocaleString()}원
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(receipt.issueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            receipt.status === 'approved' ? 'bg-green-100 text-green-800' :
                            receipt.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {receipt.status === 'approved' ? '승인' :
                             receipt.status === 'rejected' ? '거절' : '대기'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptViewPage; 