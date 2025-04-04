import React, { useState, useEffect } from 'react';
import { receiptApi } from '../services/api';

interface Receipt {
  id: number;
  eventId: number;
  eventName: string;
  churchId: number;
  churchName: string;
  registrationNumber: string;
  partTotal: number;
  partStudent: number;
  partTeacher: number;
  partYm: number;
  costs: number;
  createdAt: string;
}

const AdminPage: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 영수증 목록 불러오기
  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await receiptApi.getAllReceipts();
        setReceipts(response.data);
      } catch (err) {
        setError('영수증 목록을 불러오는데 실패했습니다.');
        console.error('Error fetching receipts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  // 영수증 업데이트
  const handleUpdateReceipt = async (receiptId: number, updatedData: Partial<Receipt>) => {
    try {
      await receiptApi.updateReceipt(receiptId, updatedData);
      
      // 영수증 목록 새로고침
      const response = await receiptApi.getAllReceipts();
      setReceipts(response.data);
    } catch (err) {
      console.error('Error updating receipt:', err);
    }
  };

  // 필터링된 영수증 목록
  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = 
      receipt.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.churchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.registrationNumber.includes(searchTerm);
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">영수증 관리</h1>
        
        {/* 검색 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="검색어를 입력하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 영수증 목록 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                  총 인원
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  학생
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  교사
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  YM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  비용
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  생성일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReceipts.map((receipt) => (
                <tr key={receipt.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{receipt.eventName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{receipt.churchName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{receipt.registrationNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{receipt.partTotal}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{receipt.partStudent}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{receipt.partTeacher}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{receipt.partYm}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{receipt.costs.toLocaleString()}원</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{receipt.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleUpdateReceipt(receipt.id, {
                        partTotal: receipt.partTotal + 1
                      })}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      수정
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 