import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, DatePicker, InputNumber, Switch, Button, message, Row, Col } from 'antd';
import { eventApi } from '../../../services/api';
import type { Event } from '../../../types/event';
import moment from 'moment';

interface EventFormData {
  event_Name: string;
  event_Description: string;
  event_Location: string;
  event_Year: number;
  event_Start_Date: string;
  event_End_Date: string;
  event_Registration_Start_Date: string;
  event_Registration_End_Date: string;
  event_Open_Available: boolean;
  event_Place: string;
  event_Month: number;
}

const EventEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEventData(parseInt(id));
    }
  }, [id, form]);

  const fetchEventData = async (eventId: number) => {
    try {
      setLoading(true);
      const response = await eventApi.getEventById(eventId);
      const eventData = response.data;
      
      form.setFieldsValue({
        ...eventData,
        event_Start_Date: moment(eventData.event_Start_Date),
        event_End_Date: moment(eventData.event_End_Date),
        event_Registration_Start_Date: moment(eventData.event_Registration_Start_Date),
        event_Registration_End_Date: moment(eventData.event_Registration_End_Date),
        event_Open_Available: eventData.event_Open_Available || false
      });
    } catch (error) {
      console.error('Error fetching event data:', error);
      message.error('이벤트 정보를 불러오는데 실패했습니다.');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: EventFormData) => {
    try {
      setLoading(true);
      await eventApi.updateEvent(parseInt(id!), {
        ...values,
        event_Start_Date: moment(values.event_Start_Date).format('YYYY-MM-DD'),
        event_End_Date: moment(values.event_End_Date).format('YYYY-MM-DD'),
        event_Registration_Start_Date: moment(values.event_Registration_Start_Date).format('YYYY-MM-DD'),
        event_Registration_End_Date: moment(values.event_Registration_End_Date).format('YYYY-MM-DD'),
        event_Open_Available: values.event_Open_Available || false
      });
      message.success('이벤트가 성공적으로 수정되었습니다.');
      navigate('/admin');
    } catch (error) {
      console.error('Error updating event:', error);
      message.error('이벤트 수정에 실패했습니다.');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">이벤트 수정</h1>
            <Button onClick={() => navigate('/admin')}>
              뒤로 가기
            </Button>
            </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="event_Name"
              label="이벤트명"
            >
              <Input disabled />
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
              name="event_Is_Public"
              label="공개 여부"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                이벤트 수정
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EventEditPage; 