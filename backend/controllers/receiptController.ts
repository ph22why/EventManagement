import { Request, Response } from 'express';
import { EventModel, ChurchModel, ManagerModel, EventChurchModel, EventChurchMemberModel } from '../models';
import { Op } from 'sequelize';
import PDFDocument from 'pdfkit';
import { EventChurchMemberAttributes, EventChurchMemberCreationAttributes } from '../models/EventChurchMember';
import { EventChurchAttributes } from '../models/EventChurch';
import { ChurchAttributes } from '../models/Church';
import { EventAttributes } from '../models/Event';

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
    event_Date: Date;
    event_Location: string;
  };
  Church?: {
    church_Name: string;
    church_reg_ID: string;
    church_Location: string;
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
    const receipts = await EventChurchMemberModel.findAll({
      include: [
        {
          model: EventChurchModel,
          include: [
            {
              model: EventModel
            },
            {
              model: ChurchModel
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
    const receipt = await EventChurchMemberModel.findByPk(id, {
      include: [
        {
          model: EventChurchModel,
          include: [
            {
              model: EventModel
            },
            {
              model: ChurchModel
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
export const create = async (req: Request, res: Response) => {
  try {
    const { event_ID, church_reg_ID, member_Name, member_Phone, member_Type, member_Status } = req.body;

    // Find the church by registration ID
    const church = await ChurchModel.findOne({
      where: { church_reg_ID }
    });

    if (!church) {
      return res.status(404).json({ error: 'Church not found' });
    }

    // Find the event church record
    const eventChurch = await EventChurchModel.findOne({
      where: {
        event_ID,
        church_ID: church.getDataValue('church_ID')
      }
    });

    if (!eventChurch) {
      return res.status(404).json({ error: 'Event church record not found' });
    }

    // Create the member
    const member = await EventChurchMemberModel.create({
      event_church_id: eventChurch.getDataValue('event_church_id'),
      member_Name,
      member_Phone,
      member_Type,
      member_Status
    });

    res.status(201).json(member);
  } catch (error) {
    console.error('Error creating receipt:', error);
    res.status(500).json({ error: 'Failed to create receipt' });
  }
};

// 영수증 업데이트
export const updateReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { member_Name, member_Phone, member_Type, member_Status } = req.body;
    
    const receipt = await EventChurchMemberModel.findByPk(id);
    
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

export const findByEventId = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const members = await EventChurchMemberModel.findAll({
      include: [{
        model: EventChurchModel,
        where: { event_ID: parseInt(eventId) },
        required: true
      }]
    });
    
    res.json(members);
  } catch (error) {
    console.error('Error finding receipts by event ID:', error);
    res.status(500).json({ error: 'Failed to find receipts' });
  }
};

export const findByChurchId = async (req: Request, res: Response) => {
  try {
    const { churchId } = req.params;
    const members = await EventChurchMemberModel.findAll({
      include: [{
        model: EventChurchModel,
        where: { church_ID: parseInt(churchId) },
        required: true
      }]
    });
    
    res.json(members);
  } catch (error) {
    console.error('Error finding receipts by church ID:', error);
    res.status(500).json({ error: 'Failed to find receipts' });
  }
};

export const updateReceiptStatus = async (req: Request, res: Response) => {
  try {
    const { eventId, churchId, memberPhone } = req.params;
    const { status } = req.body;

    const eventChurch = await EventChurchModel.findOne({
      where: {
        event_ID: parseInt(eventId),
        church_ID: parseInt(churchId)
      }
    });

    if (!eventChurch) {
      return res.status(404).json({ error: 'Event church record not found' });
    }

    const member = await EventChurchMemberModel.findOne({
      where: {
        event_church_id: eventChurch.getDataValue('event_church_id'),
        member_Phone: memberPhone
      }
    });

    if (!member) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    await member.update({ member_Status: status });
    res.json(member);
  } catch (error) {
    console.error('Error updating receipt status:', error);
    res.status(500).json({ error: 'Failed to update receipt status' });
  }
};

// 영수증 삭제
export const deleteReceipt = async (req: Request, res: Response) => {
  try {
    const { eventId, churchId, memberPhone } = req.params;

    const eventChurch = await EventChurchModel.findOne({
      where: {
        event_ID: parseInt(eventId),
        church_ID: parseInt(churchId)
      }
    });

    if (!eventChurch) {
      return res.status(404).json({ error: 'Event church record not found' });
    }

    const member = await EventChurchMemberModel.findOne({
      where: {
        event_church_id: eventChurch.getDataValue('event_church_id'),
        member_Phone: memberPhone
      }
    });

    if (!member) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    await member.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting receipt:', error);
    res.status(500).json({ error: 'Failed to delete receipt' });
  }
};

export const generateReceipt = async (req: Request, res: Response) => {
  try {
    const { eventId, churchId } = req.params;

    // Find the event church record with all necessary associations
    const eventChurch = await EventChurchModel.findOne({
      where: {
        event_ID: parseInt(eventId),
        church_ID: parseInt(churchId)
      },
      include: [
        {
          model: EventModel,
          as: 'Event'
        },
        {
          model: ChurchModel,
          as: 'Church'
        }
      ]
    });

    if (!eventChurch) {
      return res.status(404).json({ error: 'Event church record not found' });
    }

    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${eventId}-${churchId}.pdf`);

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add content to the PDF
    // Header
    doc.fontSize(20)
       .text('AWANA Event Receipt', { align: 'center' })
       .moveDown();

    // Event Details
    doc.fontSize(12)
       .text('Event Details:', { underline: true })
       .moveDown(0.5);

    const eventData = (eventChurch as any).Event;
    doc.fontSize(10)
       .text(`Event Name: ${eventData?.event_Name}`)
       .text(`Date: ${eventData?.event_Date}`)
       .text(`Location: ${eventData?.event_Location}`)
       .moveDown();

    // Church Details
    doc.fontSize(12)
       .text('Church Information:', { underline: true })
       .moveDown(0.5);

    const churchData = (eventChurch as any).Church;
    doc.fontSize(10)
       .text(`Church Name: ${churchData?.church_Name}`)
       .text(`Registration ID: ${churchData?.church_reg_ID}`)
       .text(`Location: ${churchData?.church_Location}`)
       .moveDown();

    // Footer
    doc.fontSize(10)
       .text('Thank you for participating in AWANA Events!', { align: 'center' })
       .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({ error: 'Failed to generate receipt' });
  }
}; 