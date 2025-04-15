import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, DatePicker, InputNumber, Switch, Button, message, Row, Col, Select } from 'antd';
import { eventApi } from '../../../services/api';
import type { Event } from '../../../types/event';
import moment from 'moment';
import axios from 'axios';

const { Option } = Select;

interface SampleEvent {
  sampleEvent_ID: number;
  sampleEvent_Name: string;
  sampleEvent_Location: string;
  sampleEvent_Year: string;
  sampleEvent_Start_Date: string | null;
  sampleEvent_End_Date: string | null;
  sampleEvent_Registration_Start_Date: string | null;
  sampleEvent_Registration_End_Date: string | null;
  sampleEvent_Open_Available: string;
  sampleEvent_Place: string;
  sampleEvent_Month: string;
  sampleEvent_Description: string | null;
}

interface EventFormData {
  event_Name: string;
  event_Description: string;
  event_Location: string;
  event_Year: number;
  event_Start_Date: string;
  event_End_Date: string;
  event_Registration_Start_Date: string;
  event_Registration_End_Date: string;
  event_Open_Available: string;
  event_Place: string;
  event_Month: number;
}

const EventCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [sampleEvents, setSampleEvents] = useState<SampleEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSampleEvents();
  }, []);

  const fetchSampleEvents = async () => {
    try {
      console.log('Fetching sample events...');
      const response = await eventApi.getSampleEvents();
      console.log('Sample events response:', response);
      setSampleEvents(response.data);
    } catch (err) {
      console.error('Error fetching sample events:', err);
      message.error('이벤트 목록을 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleEventNameSelect = (eventId: number) => {
    const selectedEvent = sampleEvents.find(event => event.sampleEvent_ID === eventId);
    if (selectedEvent) {
      const currentYear = new Date().getFullYear();
      form.setFieldsValue({
        event_Name: `${selectedEvent.sampleEvent_Name} ${currentYear}`,
        event_Place: selectedEvent.sampleEvent_Place,
        event_Location: selectedEvent.sampleEvent_Location,
        event_Open_Available: selectedEvent.sampleEvent_Open_Available
      });
    }
  };

  const handleDateChange = (date: moment.Moment | null, dateType: string) => {
    if (date && dateType === 'event_Start_Date') {
      form.setFieldsValue({
        event_Year: date.year(),
        event_Month: date.month() + 1
      });
    }
  };

  const onFinish = async (values: EventFormData) => {
    try {
      setLoading(true);
      await eventApi.createEvent({
        ...values,
        event_Start_Date: moment(values.event_Start_Date).format('YYYY-MM-DD'),
        event_End_Date: moment(values.event_End_Date).format('YYYY-MM-DD'),
        event_Registration_Start_Date: moment(values.event_Registration_Start_Date).format('YYYY-MM-DD'),
        event_Registration_End_Date: moment(values.event_Registration_End_Date).format('YYYY-MM-DD'),
        event_Open_Available: values.event_Open_Available || '비공개'
      });
      message.success('이벤트가 성공적으로 생성되었습니다.');
      navigate('/admin');
    } catch (error) {
      console.error('Error creating event:', error);
      message.error('이벤트 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">이벤트 생성</h1>
            <Button onClick={() => navigate('/admin')}>
              뒤로 가기
            </Button>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              event_Open_Available: '비공개'
            }}
          >
            <Form.Item
              name="event_Name"
              label="이벤트명"
              rules={[{ required: true, message: '이벤트명을 선택해주세요' }]}
            >
              <Select
                placeholder="이벤트명을 선택하세요"
                onChange={handleEventNameSelect}
                allowClear
              >
                {sampleEvents.map(event => (
                  <Option key={`event-${event.sampleEvent_ID}`} value={event.sampleEvent_ID}>
                    {event.sampleEvent_Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="event_Year"
                  label="년도"
                >
                  <InputNumber style={{ width: '100%' }} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="event_Month"
                  label="월"
                >
                  <InputNumber style={{ width: '100%' }} disabled min={1} max={12} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="event_Place"
                  label="장소"
                  rules={[{ required: true, message: '장소를 입력해주세요' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="event_Location"
                  label="상세 위치"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="event_Start_Date"
                  label="이벤트 시작일"
                  rules={[{ required: true, message: '이벤트 시작일을 선택해주세요' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    onChange={(date) => handleDateChange(date, 'event_Start_Date')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="event_End_Date"
                  label="이벤트 종료일"
                  rules={[{ required: true, message: '이벤트 종료일을 선택해주세요' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="event_Registration_Start_Date"
                  label="등록 시작일"
                  rules={[{ required: true, message: '등록 시작일을 선택해주세요' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="event_Registration_End_Date"
                  label="등록 종료일"
                  rules={[{ required: true, message: '등록 종료일을 선택해주세요' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="event_Open_Available"
              label="공개 여부"
            >
              <Select>
                <Option value="공개">공개</Option>
                <Option value="비공개">비공개</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                이벤트 생성
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EventCreatePage; 