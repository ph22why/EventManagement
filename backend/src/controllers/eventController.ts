import { Request, Response } from 'express';
import { Event } from '../models';
import { EventChurch } from '../models';
import { Manager } from '../models';
import { Op } from 'sequelize';

interface EventInput {
  event_Name: string;
  event_Date: Date;
  event_Location: string;
  event_Description?: string;
}

interface ManagerInput {
  manager_Name: string;
  manager_Phone: string;
  manager_Email: string;
  manager_Password: string;
}

interface EventChurchInput {
  event_ID: number;
  church_ID: number;
  manager_ID: number;
}

// 모든 이벤트 조회
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: EventChurch,
          include: [
            {
              model: Manager,
              attributes: ['manager_Name', 'manager_Phone', 'manager_Email']
            }
          ]
        }
      ]
    });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 특정 이벤트 조회
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id, {
      include: [
        {
          model: EventChurch,
          include: [
            {
              model: Manager,
              attributes: ['manager_Name', 'manager_Phone', 'manager_Email']
            }
          ]
        }
      ]
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 새 이벤트 생성
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { event_Name, event_Date, event_Location, event_Description } = req.body;

    const event = await Event.create({
      event_Name,
      event_Date,
      event_Location,
      event_Description
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 이벤트 업데이트
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { event_Name, event_Date, event_Location, event_Description } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.update({
      event_Name,
      event_Date,
      event_Location,
      event_Description
    });

    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 이벤트 삭제
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await event.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 이벤트에 관리자 추가
export const addManagerToEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const managerData: ManagerInput = req.body;

    // 관리자 생성 또는 조회
    let manager = await Manager.findOne({
      where: { manager_Phone: managerData.manager_Phone }
    });

    if (!manager) {
      manager = await Manager.create(managerData as any);
    }

    // 이벤트-교회 관계 생성
    const eventChurch = await EventChurch.create({
      event_ID: parseInt(eventId),
      church_ID: req.body.church_ID,
      manager_ID: (manager as any).manager_ID
    });

    res.status(201).json(eventChurch);
  } catch (error) {
    console.error('Error adding manager to event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 