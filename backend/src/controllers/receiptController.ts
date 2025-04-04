import { Request, Response } from 'express';
import EventChurch from '../models/EventChurch';
import Event from '../models/Event';
import Church from '../models/Church';

interface EventChurchData {
  id: number;
  event_ID: number;
  church_ID: number;
  manager_ID: number;
  part_total: number;
  part_student: number;
  part_teacher: number;
  part_ym: number;
  costs: number;
  Event?: {
    event_Name: string;
  };
  Church?: {
    church_Name: string;
    church_reg_ID: string;
  };
}

// 모든 영수증 조회
export const getAllReceipts = async (req: Request, res: Response) => {
  try {
    const receipts = await EventChurch.findAll({
      include: [
        { model: Event, attributes: ['event_Name'] },
        { model: Church, attributes: ['church_Name', 'church_reg_ID'] }
      ],
      order: [['id', 'DESC']]
    });

    const formattedReceipts = receipts.map((receipt: EventChurchData) => ({
      id: receipt.id,
      eventId: receipt.event_ID,
      eventName: receipt.Event?.event_Name,
      churchId: receipt.church_ID,
      churchName: receipt.Church?.church_Name,
      registrationNumber: receipt.Church?.church_reg_ID,
      partTotal: receipt.part_total,
      partStudent: receipt.part_student,
      partTeacher: receipt.part_teacher,
      partYm: receipt.part_ym,
      costs: receipt.costs,
      createdAt: new Date().toISOString()
    }));

    res.json(formattedReceipts);
  } catch (error) {
    console.error('Error fetching receipts:', error);
    res.status(500).json({ message: '영수증 목록을 가져오는데 실패했습니다.' });
  }
};

// 특정 영수증 조회
export const getReceiptById = async (req: Request, res: Response) => {
  try {
    const receipt = await EventChurch.findByPk(req.params.id, {
      include: [
        { model: Event, attributes: ['event_Name'] },
        { model: Church, attributes: ['church_Name', 'church_reg_ID'] }
      ]
    });

    if (!receipt) {
      return res.status(404).json({ message: '영수증을 찾을 수 없습니다.' });
    }

    const formattedReceipt = {
      id: receipt.id,
      eventId: receipt.event_ID,
      eventName: receipt.Event?.event_Name,
      churchId: receipt.church_ID,
      churchName: receipt.Church?.church_Name,
      registrationNumber: receipt.Church?.church_reg_ID,
      partTotal: receipt.part_total,
      partStudent: receipt.part_student,
      partTeacher: receipt.part_teacher,
      partYm: receipt.part_ym,
      costs: receipt.costs,
      createdAt: new Date().toISOString()
    };

    res.json(formattedReceipt);
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({ message: '영수증을 가져오는데 실패했습니다.' });
  }
};

// 영수증 업데이트
export const updateReceipt = async (req: Request, res: Response) => {
  try {
    const receipt = await EventChurch.findByPk(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: '영수증을 찾을 수 없습니다.' });
    }

    const {
      part_total,
      part_student,
      part_teacher,
      part_ym,
      costs
    } = req.body;

    await receipt.update({
      part_total,
      part_student,
      part_teacher,
      part_ym,
      costs
    });

    res.json({ message: '영수증이 업데이트되었습니다.' });
  } catch (error) {
    console.error('Error updating receipt:', error);
    res.status(500).json({ message: '영수증 업데이트에 실패했습니다.' });
  }
}; 