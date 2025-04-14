import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Input, Select, Table, Space, Button, message, Menu, Row, Col, Statistic, Form, Input as AntInput, Upload, DatePicker } from 'antd';
import { eventApi, receiptApi } from '../../services/api';
import type { Event } from '../../types/event';
import { 
  DashboardOutlined, 
  CalendarOutlined, 
  FileTextOutlined,
  LogoutOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { utils, read, writeFile } from 'xlsx';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

interface Receipt {
  receipt_ID: number;
  event_ID: number;
  church_ID: string;
  receipt_Date: string;
  receipt_Amount: number;
  receipt_Of: string;
  receipt_Participants: string;
}

interface ExcelRow {
  '교회 등록번호': string;
  '이벤트 ID': string | number;
  '금액': string | number;
  '영수증 지정인': string;
  '참가자': string;
}

interface CreateReceiptData {
  church_ID: string;
  event_ID: number;
  receipt_Amount: number;
  receipt_Date: string;
  receipt_Of: string;
  receipt_Participants: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'receipts'>('dashboard');
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchEvents();
    fetchReceipts();
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

  const fetchReceipts = async () => {
    try {
      const response = await receiptApi.getAllReceipts();
      if (response.data) {
        setReceipts(response.data);
      } else {
        throw new Error('영수증 데이터가 없습니다.');
      }
    } catch (error) {
      console.error('영수증 목록을 불러오는데 실패했습니다:', error);
      message.error('영수증 목록을 불러오는데 실패했습니다. 서버 연결을 확인해주세요.');
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

  const renderDashboard = () => {
    // 현재 년도의 이벤트만 필터링
    const currentYearEvents = events.filter(event => 
      event.event_Year === new Date().getFullYear()
    );

    return (
      <div className="space-y-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <Statistic
                title="올해 총 이벤트"
                value={currentYearEvents.length}
                prefix={<CalendarOutlined />}
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

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <Title level={4} className="mb-4">최근 이벤트</Title>
          <Table
            dataSource={events.slice(0, 5)}
            columns={[
              {
                title: '이벤트명',
                dataIndex: 'event_Name',
                key: 'event_Name',
              },
              {
                title: '년도',
                dataIndex: 'event_Year',
                key: 'event_Year',
                render: (year: number) => `${year}년`
              },
              {
                title: '장소',
                dataIndex: 'event_Place',
                key: 'event_Place',
              },
              {
                title: '관리',
                key: 'action',
                render: (_, record) => (
                  <Space>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => navigate(`/admin/events/edit/${record.event_ID}`)}
                    >
                      수정
                    </Button>
                  </Space>
                ),
              },
            ]}
          />
        </Card>
      </div>
    );
  };

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
            {Array.from(new Set(events.map(event => event.event_Year)))
              .sort((a, b) => b - a)
              .map(year => (
                <Select.Option key={year} value={year.toString()}>
                  {year}년
                </Select.Option>
              ))
            }
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
          dataSource={filteredEvents}
          columns={[
            {
              title: '이벤트명',
              dataIndex: 'event_Name',
              key: 'event_Name',
              sorter: (a, b) => a.event_Name.localeCompare(b.event_Name),
            },
            {
              title: '년도',
              dataIndex: 'event_Year',
              key: 'event_Year',
              render: (year: number) => `${year}년`,
              sorter: (a, b) => a.event_Year - b.event_Year,
            },
            {
              title: '장소',
              dataIndex: 'event_Place',
              key: 'event_Place',
            },
            {
              title: '관리',
              key: 'action',
              render: (_, record) => (
                <Space>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/admin/events/edit/${record.event_ID}`)}
                  >
                    수정
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record)}
                  >
                    삭제
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );

  const handleReceiptCreate = async (values: any) => {
    try {
      const receiptData: CreateReceiptData = {
        church_ID: values.church_ID,
        event_ID: values.event_ID,
        receipt_Amount: values.receipt_Amount,
        receipt_Date: moment(values.receipt_Date).format('YYYY-MM-DD'),
        receipt_Of: values.receipt_Of,
        receipt_Participants: values.receipt_Participants || ''
      };

      const response = await receiptApi.createReceipt(receiptData);
      if (response) {
        message.success('영수증이 성공적으로 발급되었습니다.');
        form.resetFields();
        fetchReceipts();
      }
    } catch (error) {
      console.error('Error creating receipt:', error);
      message.error('영수증 발급 중 오류가 발생했습니다.');
    }
  };

  const renderReceipts = () => (
    <div className="space-y-6">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Title level={4} className="text-xl font-semibold">영수증 발급</Title>
            <Space>
              <Button 
                icon={<DownloadOutlined />}
                onClick={handleDownloadSample}
              >
                샘플 엑셀 다운로드
              </Button>
              <Upload
                accept=".xlsx,.xls"
                showUploadList={false}
                beforeUpload={handleExcelUpload}
              >
                <Button icon={<UploadOutlined />}>엑셀 파일 업로드</Button>
              </Upload>
            </Space>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleReceiptCreate}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Form.Item 
                  name="church_ID" 
                  label="교회 등록번호"
                  rules={[{ required: true, message: '교회 등록번호를 입력해주세요' }]}
                >
                  <AntInput placeholder="교회 등록번호를 입력하세요" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item 
                  name="event_ID" 
                  label="이벤트 선택"
                  rules={[{ required: true, message: '이벤트를 선택해주세요' }]}
                >
                  <Select placeholder="이벤트를 선택하세요">
                    {events
                      .sort((a, b) => {
                        const yearA = moment(a.event_Date).year();
                        const yearB = moment(b.event_Date).year();
                        if (yearA !== yearB) return yearB - yearA;
                        return b.event_ID - a.event_ID;
                      })
                      .map(event => (
                        <Select.Option key={event.event_ID} value={event.event_ID}>
                          {`[${moment(event.event_Date).format('YYYY')}] ${event.event_Name}`}
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item 
                  name="receipt_Amount" 
                  label="금액"
                  rules={[{ required: true, message: '금액을 입력해주세요' }]}
                >
                  <AntInput type="number" placeholder="금액을 입력하세요" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Form.Item 
                  name="receipt_Of" 
                  label="영수증 지정인"
                  rules={[{ required: true, message: '영수증 지정인을 입력해주세요' }]}
                >
                  <AntInput placeholder="영수증 지정인을 입력하세요" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item 
                  name="receipt_Participants" 
                  label="참가자"
                >
                  <AntInput.TextArea placeholder="참가자 정보를 입력하세요" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item 
                  name="receipt_Date" 
                  label="영수증 발급일"
                  initialValue={moment()}
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Button type="primary" htmlType="submit">
              영수증 발급
            </Button>
          </Form>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <Title level={4} className="text-xl font-semibold">발급된 영수증 목록</Title>
            <Button 
              icon={<DownloadOutlined />}
              onClick={handleDownloadReceipts}
            >
              영수증 목록 다운로드
            </Button>
          </div>

          <Table
            columns={[
              {
                title: '영수증 번호',
                dataIndex: 'receipt_ID',
                key: 'receipt_ID',
              },
              {
                title: '교회 등록번호',
                dataIndex: 'church_ID',
                key: 'church_ID',
              },
              {
                title: '이벤트명',
                dataIndex: 'event_ID',
                key: 'event_ID',
                render: (event_ID) => {
                  const event = events.find(e => e.event_ID === event_ID);
                  return event ? event.event_Name : event_ID;
                }
              },
              {
                title: '금액',
                dataIndex: 'receipt_Amount',
                key: 'receipt_Amount',
                render: (amount: number) => `${amount.toLocaleString()}원`
              },
              {
                title: '영수증 지정인',
                dataIndex: 'receipt_Of',
                key: 'receipt_Of',
              },
              {
                title: '참가자',
                dataIndex: 'receipt_Participants',
                key: 'receipt_Participants',
              },
              {
                title: '발급일',
                dataIndex: 'receipt_Date',
                key: 'receipt_Date',
                render: (date: string) => moment(date).format('YYYY-MM-DD')
              }
            ]}
            dataSource={receipts}
            rowKey="receipt_ID"
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

  const handleExcelUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target?.result;
      const workbook = read(data, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet) as ExcelRow[];

      const receipts: CreateReceiptData[] = jsonData.map((row) => ({
        church_ID: row['교회 등록번호'],
        event_ID: Number(row['이벤트 ID']),
        receipt_Amount: Number(row['금액']),
        receipt_Date: moment().format('YYYY-MM-DD'),
        receipt_Of: row['영수증 지정인'],
        receipt_Participants: row['참가자'] || ''
      }));

      try {
        for (const receipt of receipts) {
          await receiptApi.createReceipt(receipt);
        }
        message.success('영수증이 성공적으로 업로드되었습니다.');
        fetchReceipts();
      } catch (error) {
        console.error('Error uploading receipts:', error);
        message.error('영수증 업로드 중 오류가 발생했습니다.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleDownloadSample = () => {
    const ws = utils.json_to_sheet([
      {
        '교회 등록번호': '12345',
        '이벤트 ID': '1',
        '금액': '50000',
        '영수증 지정인': '홍길동',
        '참가자': '참가자1, 참가자2'
      }
    ]);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sample');
    writeFile(wb, 'receipt_sample.xlsx');
  };

  const handleDownloadReceipts = () => {
    const data = receipts.map(receipt => ({
      '영수증 번호': receipt.receipt_ID,
      '교회 등록번호': receipt.church_ID,
      '이벤트명': events.find(e => e.event_ID === receipt.event_ID)?.event_Name || receipt.event_ID,
      '금액': receipt.receipt_Amount,
      '영수증 지정인': receipt.receipt_Of,
      '참가자': receipt.receipt_Participants,
      '발급일': moment(receipt.receipt_Date).format('YYYY-MM-DD')
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Receipts');
    writeFile(wb, `receipts_${moment().format('YYYY-MM-DD')}.xlsx`);
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