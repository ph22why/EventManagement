import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Input, Select, Table, Space, Button, message, Menu, Row, Col, Statistic, Form, Input as AntInput } from 'antd';
import { eventApi } from '../../services/api';
import type { Event } from '../../types/event';
import { 
  DashboardOutlined, 
  CalendarOutlined, 
  FileTextOutlined,
  LogoutOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'receipts'>('dashboard');
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventApi.getAllEvents();
      if (response.data) {
        setEvents(response.data);
        setFilteredEvents(response.data);
      } else {
        throw new Error('이벤트 데이터가 없습니다.');
      }
    } catch (error) {
      console.error('이벤트 목록을 불러오는데 실패했습니다:', error);
      message.error('이벤트 목록을 불러오는데 실패했습니다. 서버 연결을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
    message.success('로그아웃되었습니다.');
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '대시보드',
    },
    {
      key: 'events',
      icon: <CalendarOutlined />,
      label: '이벤트 관리',
    },
    {
      key: 'receipts',
      icon: <FileTextOutlined />,
      label: '영수증 관리',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '로그아웃',
      danger: true,
    },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title={<Text className="text-lg font-semibold">전체 이벤트 수</Text>}
              value={events.length}
              valueStyle={{ color: '#3f8600', fontSize: '24px' }}
              prefix={<CalendarOutlined className="text-2xl" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title={<Text className="text-lg font-semibold">최근 30일 이벤트</Text>}
              value={events.filter(event => {
                const eventDate = new Date(event.event_Date);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return eventDate >= thirtyDaysAgo;
              }).length}
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
              prefix={<CalendarOutlined className="text-2xl" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title={<Text className="text-lg font-semibold">예정된 이벤트</Text>}
              value={events.filter(event => {
                const eventDate = new Date(event.event_Date);
                return eventDate >= new Date();
              }).length}
              valueStyle={{ color: '#cf1322', fontSize: '24px' }}
              prefix={<CalendarOutlined className="text-2xl" />}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title={<Text className="text-xl font-semibold">최근 이벤트</Text>}
        className="hover:shadow-lg transition-shadow duration-300"
      >
        <Table
          columns={[
            {
              title: '이벤트 이름',
              dataIndex: 'event_Name',
              key: 'event_Name',
              render: (text: string) => <Text strong>{text}</Text>,
            },
            {
              title: '날짜',
              dataIndex: 'event_Date',
              key: 'event_Date',
              render: (date: string) => (
                <Text className="text-gray-600">
                  {new Date(date).toLocaleDateString('ko-KR')}
                </Text>
              ),
            },
            {
              title: '장소',
              dataIndex: 'event_Location',
              key: 'event_Location',
              render: (text: string) => <Text className="text-gray-600">{text}</Text>,
            },
          ]}
          dataSource={events.slice(0, 5)}
          rowKey="event_ID"
          pagination={false}
          className="custom-table"
        />
      </Card>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          <Select
            style={{ width: 200 }}
            placeholder="년도 선택"
            value={selectedYear}
            onChange={setSelectedYear}
            allowClear
            className="w-full md:w-auto"
          >
            {Array.from(new Set(events.map(event => 
              new Date(event.event_Date).getFullYear().toString()
            ))).sort((a, b) => b.localeCompare(a)).map(year => (
              <Select.Option key={year} value={year}>
                {year}년
              </Select.Option>
            ))}
          </Select>
          <Search
            placeholder="이벤트 이름 검색"
            allowClear
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
            className="w-full md:w-auto"
            prefix={<SearchOutlined />}
          />
          <Button 
            type="primary" 
            onClick={() => navigate('/admin/events/create')}
            icon={<PlusOutlined />}
            className="w-full md:w-auto"
          >
            새 이벤트 추가
          </Button>
        </div>
        <Table
          columns={[
            {
              title: '이벤트 ID',
              dataIndex: 'event_ID',
              key: 'event_ID',
              render: (text: number) => <Text className="text-gray-600">{text}</Text>,
            },
            {
              title: '이벤트 이름',
              dataIndex: 'event_Name',
              key: 'event_Name',
              render: (text: string) => <Text strong>{text}</Text>,
            },
            {
              title: '이벤트 날짜',
              dataIndex: 'event_Date',
              key: 'event_Date',
              render: (date: string) => (
                <Text className="text-gray-600">
                  {new Date(date).toLocaleDateString('ko-KR')}
                </Text>
              ),
            },
            {
              title: '이벤트 장소',
              dataIndex: 'event_Location',
              key: 'event_Location',
              render: (text: string) => <Text className="text-gray-600">{text}</Text>,
            },
            {
              title: '작업',
              key: 'action',
              render: (_: any, record: Event) => (
                <Space size="middle">
                  <Button 
                    type="link" 
                    onClick={() => navigate(`/admin/events/edit/${record.event_ID}`)}
                    icon={<EditOutlined />}
                  >
                    수정
                  </Button>
                  <Button 
                    type="link" 
                    danger 
                    onClick={() => handleDelete(record)}
                    icon={<DeleteOutlined />}
                  >
                    삭제
                  </Button>
                </Space>
              ),
            },
          ]}
          dataSource={filteredEvents}
          rowKey="event_ID"
          loading={loading}
          className="custom-table"
        />
      </Card>
    </div>
  );

  const renderReceipts = () => (
    <div className="space-y-6">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <div className="mb-6">
          <Title level={4} className="text-xl font-semibold">영수증 발급</Title>
          <Form layout="vertical">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Form.Item label={<Text className="font-medium">교회 등록번호</Text>}>
                  <AntInput 
                    placeholder="교회 등록번호를 입력하세요" 
                    className="w-full"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label={<Text className="font-medium">이벤트 선택</Text>}>
                  <Select 
                    placeholder="이벤트를 선택하세요"
                    className="w-full"
                  >
                    {events.map(event => (
                      <Select.Option key={event.event_ID} value={event.event_ID}>
                        {event.event_Name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label={<Text className="font-medium">참가자 수</Text>}>
                  <AntInput 
                    type="number" 
                    placeholder="참가자 수를 입력하세요"
                    className="w-full"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Button type="primary" size="large" className="mt-4">
              영수증 발급
            </Button>
          </Form>
        </div>

        <div className="mt-6">
          <Title level={4} className="text-xl font-semibold">발급된 영수증 목록</Title>
          <Table
            columns={[
              {
                title: '영수증 번호',
                dataIndex: 'receipt_ID',
                key: 'receipt_ID',
                render: (text: string) => <Text className="text-gray-600">{text}</Text>,
              },
              {
                title: '교회명',
                dataIndex: 'church_Name',
                key: 'church_Name',
                render: (text: string) => <Text strong>{text}</Text>,
              },
              {
                title: '이벤트명',
                dataIndex: 'event_Name',
                key: 'event_Name',
                render: (text: string) => <Text className="text-gray-600">{text}</Text>,
              },
              {
                title: '참가자 수',
                dataIndex: 'participants',
                key: 'participants',
                render: (text: number) => <Text className="text-gray-600">{text}</Text>,
              },
              {
                title: '발급일',
                dataIndex: 'issue_Date',
                key: 'issue_Date',
                render: (date: string) => (
                  <Text className="text-gray-600">
                    {new Date(date).toLocaleDateString('ko-KR')}
                  </Text>
                ),
              },
            ]}
            dataSource={[]}
            rowKey="receipt_ID"
            className="custom-table"
          />
        </div>
      </Card>
    </div>
  );

  const handleDelete = async (event: Event) => {
    try {
      await eventApi.deleteEvent(event.event_ID);
      message.success('이벤트가 삭제되었습니다.');
      fetchEvents();
    } catch (error) {
      message.error('이벤트 삭제에 실패했습니다.');
      console.error('Error deleting event:', error);
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      handleLogout();
    } else {
      setActiveTab(key as 'dashboard' | 'events' | 'receipts');
    }
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Title level={3} className="mb-0 text-blue-600">AWANA 관리자</Title>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="bg-white shadow-sm">
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            items={menuItems}
            onClick={handleMenuClick}
            className="border-r-0"
          />
        </Sider>
        <Content className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'events' && renderEvents()}
            {activeTab === 'receipts' && renderReceipts()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard; 