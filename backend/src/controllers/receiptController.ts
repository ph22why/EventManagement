import { Request, Response } from 'express';
import { Event, Church, Manager, EventChurch, EventChurchMember } from '../models';
import { Op } from 'sequelize';

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

interface ReceiptInput {
  event_ID: number;
  church_reg_ID: string;
  member_Name: string;
  member_Phone: string;
  member_Type: string;
  member_Status: string;
}

// 모든 영수증 조회
export const getAllReceipts = async (req: Request, res: Response) => {
  try {
    const receipts = await EventChurchMember.findAll({
      include: [
        {
          model: EventChurch,
          include: [
            {
              model: Event
            },
            {
              model: Church
            },
            {
              model: Manager
            }
          ]
        }
      ]
    });
    return res.status(200).json(receipts);
  } catch (error) {
    console.error('영수증 조회 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 특정 영수증 조회
export const getReceiptById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const receipt = await EventChurchMember.findByPk(id, {
      include: [
        {
          model: EventChurch,
          include: [
            {
              model: Event
            },
            {
              model: Church
            },
            {
              model: Manager
            }
          ]
        }
      ]
    });
    
    if (!receipt) {
      return res.status(404).json({ message: '영수증을 찾을 수 없습니다.' });
    }
    
    return res.status(200).json(receipt);
  } catch (error) {
    console.error('영수증 조회 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 새 영수증 생성
export const createReceipt = async (req: Request, res: Response) => {
  try {
    const receiptData: ReceiptInput = req.body;
    
    // 이벤트-교회 관계 확인
    const eventChurch = await EventChurch.findOne({
      where: {
        event_ID: receiptData.event_ID,
        '$church.church_reg_ID$': receiptData.church_reg_ID
      },
      include: [{
        model: Church,
        as: 'church'
      }]
    });

    if (!eventChurch) {
      return res.status(404).json({ message: 'Event-Church relationship not found' });
    }

    // 영수증 생성
    const receipt = await EventChurchMember.create({
      event_church_id: (eventChurch as any).event_church_id,
      member_Name: receiptData.member_Name,
      member_Phone: receiptData.member_Phone,
      member_Type: receiptData.member_Type,
      member_Status: receiptData.member_Status
    } as any);

    res.status(201).json(receipt);
  } catch (error) {
    console.error('Error creating receipt:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 영수증 업데이트
export const updateReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { member_Name, member_Phone, member_Type, member_Status } = req.body;
    
    const receipt = await EventChurchMember.findByPk(id);
    
    if (!receipt) {
      return res.status(404).json({ message: '영수증을 찾을 수 없습니다.' });
    }
    
    await receipt.update({
      member_Name,
      member_Phone,
      member_Type,
      member_Status
    });
    
    return res.status(200).json(receipt);
  } catch (error) {
    console.error('영수증 업데이트 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const getReceiptsByEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const receipts = await EventChurchMember.findAll({
      include: [{
        model: EventChurch,
        where: { event_ID: eventId },
        include: [{
          model: Church,
          as: 'church'
        }]
      }]
    });
    res.json(receipts);
  } catch (error) {
    console.error('Error getting receipts by event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getReceiptsByChurch = async (req: Request, res: Response) => {
  try {
    const { churchId } = req.params;
    const receipts = await EventChurchMember.findAll({
      include: [{
        model: EventChurch,
        where: { '$church.church_reg_ID$': churchId },
        include: [{
          model: Church,
          as: 'church'
        }]
      }]
    });
    res.json(receipts);
  } catch (error) {
    console.error('Error getting receipts by church:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateReceiptStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const receipt = await EventChurchMember.findByPk(id);
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    await receipt.update({ member_Status: status });
    res.json(receipt);
  } catch (error) {
    console.error('Error updating receipt status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 영수증 삭제
export const deleteReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const receipt = await EventChurchMember.findByPk(id);
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    await receipt.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting receipt:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 