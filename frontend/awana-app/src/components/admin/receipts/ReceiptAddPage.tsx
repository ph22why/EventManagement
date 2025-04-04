import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../../assets/gradient-background.png';
import { receiptApi } from '../../../services/api';

interface ReceiptFormData {
  eventId: number;
  churchId: number;
  registrationNumber: string;
  phoneNumber: string;
  amount: number;
  issueDate: string;
}

const ReceiptAddPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ReceiptFormData>({
    eventId: 0,
    churchId: 0,
    registrationNumber: '',
    phoneNumber: '',
    amount: 0,
    issueDate: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError('');
      setSuccess('');

      // TODO: 엑셀 파일 업로드 및 처리 로직 구현
      console.log('Uploading file:', file);
      
      setSuccess('파일이 성공적으로 업로드되었습니다.');
    } catch (err) {
      setError('파일 업로드 중 오류가 발생했습니다.');
      console.error('Error uploading file:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      // TODO: 개별 데이터 추가 API 호출 구현
      console.log('Submitting form data:', formData);
      setSuccess('데이터가 성공적으로 추가되었습니다.');
      setFormData({
        eventId: 0,
        churchId: 0,
        registrationNumber: '',
        phoneNumber: '',
        amount: 0,
        issueDate: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setError('데이터 추가 중 오류가 발생했습니다.');
      console.error('Error submitting form:', err);
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
              <h1 className="text-3xl font-bold text-gray-900">영수증 데이터 추가</h1>
              <button
                onClick={() => navigate('/admin/dashboard')}
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

            {/* 엑셀 파일 업로드 섹션 */}
            <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">엑셀 파일 업로드</h2>
              <div className="flex items-center justify-center">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
                  <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1z" />
                  </svg>
                  <span className="mt-2 text-base">엑셀 파일 선택</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            {/* 개별 데이터 입력 폼 */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-2">
                  이벤트
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
                  {/* TODO: 이벤트 목록 추가 */}
                </select>
              </div>

              <div>
                <label htmlFor="churchId" className="block text-sm font-medium text-gray-700 mb-2">
                  교회
                </label>
                <select
                  id="churchId"
                  name="churchId"
                  value={formData.churchId}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">교회 선택</option>
                  {/* TODO: 교회 목록 추가 */}
                </select>
              </div>

              <div>
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  등록번호
                </label>
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  금액
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  발급일
                </label>
                <input
                  type="date"
                  id="issueDate"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
              >
                데이터 추가
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptAddPage; 