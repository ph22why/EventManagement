import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/gradient-background.png';

interface MenuItem {
  title: string;
  items: {
    name: string;
    path: string;
  }[];
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      title: '이벤트 관리',
      items: [
        { name: '이벤트 생성', path: '/admin/events/create' },
        { name: '이벤트 관리', path: '/admin/events/manage' },
        { name: '엑셀 다운로드', path: '/admin/events/download' },
      ],
    },
    {
      title: '영수증 관리',
      items: [
        { name: '영수증 데이터 조회', path: '/admin/receipts/view' },
        { name: '데이터 추가', path: '/admin/receipts/add' },
      ],
    },
  ];

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
            <h1 className="text-4xl font-bold text-gray-900 text-center">관리자 대시보드</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((section) => (
              <div key={section.title} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => navigate(item.path)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 text-left"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 