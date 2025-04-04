import { Request, Response } from 'express';
import { Event } from '../models';

// 모든 이벤트 조회
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.findAll();
    return res.status(200).json(events);
  } catch (error) {
    console.error('이벤트 조회 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 특정 이벤트 조회
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    
    if (!event) {
      return res.status(404).json({ message: '이벤트를 찾을 수 없습니다.' });
    }
    
    return res.status(200).json(event);
  } catch (error) {
    console.error('이벤트 조회 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 새 이벤트 생성
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { event_Name, event_Location, event_Year, event_Date, event_Open_Available, event_Place } = req.body;
    
    const newEvent = await Event.create({
      event_Name,
      event_Location,
      event_Year,
      event_Date,
      event_Open_Available,
      event_Place
    });
    
    return res.status(201).json(newEvent);
  } catch (error) {
    console.error('이벤트 생성 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 이벤트 업데이트
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { event_Name, event_Location, event_Year, event_Date, event_Open_Available, event_Place } = req.body;
    
    const event = await Event.findByPk(id);
    
    if (!event) {
      return res.status(404).json({ message: '이벤트를 찾을 수 없습니다.' });
    }
    
    await event.update({
      event_Name,
      event_Location,
      event_Year,
      event_Date,
      event_Open_Available,
      event_Place
    });
    
    return res.status(200).json(event);
  } catch (error) {
    console.error('이벤트 업데이트 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 이벤트 삭제
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findByPk(id);
    
    if (!event) {
      return res.status(404).json({ message: '이벤트를 찾을 수 없습니다.' });
    }
    
    await event.destroy();
    
    return res.status(200).json({ message: '이벤트가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('이벤트 삭제 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}; 