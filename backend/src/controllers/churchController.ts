import { Request, Response } from 'express';
import { Church, Manager, EventChurch } from '../models';
import { Op } from 'sequelize';

// 타입 정의 추가
interface ChurchManager {
  manager_Name: string;
  manager_Phone: string;
  manager_Email: string;
  church_reg_ID: string;
}

interface EventChurchData {
  event_ID: number;
  church_ID: number;
  manager_ID: number;
}

// 모든 교회 조회
export const getAllChurches = async (req: Request, res: Response) => {
  try {
    const churches = await Church.findAll({
      include: [{
        model: EventChurch,
        include: [{
          model: Manager,
          attributes: ['manager_Name', 'manager_Phone', 'manager_Email']
        }]
      }]
    });
    res.json(churches);
  } catch (error) {
    console.error('Error fetching churches:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 특정 교회 조회
export const getChurchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const church = await Church.findByPk(id, {
      include: [{
        model: EventChurch,
        include: [{
          model: Manager,
          attributes: ['manager_Name', 'manager_Phone', 'manager_Email']
        }]
      }]
    });
    if (!church) {
      return res.status(404).json({ message: 'Church not found' });
    }
    res.json(church);
  } catch (error) {
    console.error('Error fetching church:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 등록번호로 교회 조회
export const getChurchByRegId = async (req: Request, res: Response) => {
  try {
    const { regId } = req.params;
    const church = await Church.findOne({
      where: { church_reg_ID: regId }
    });
    if (!church) {
      return res.status(404).json({ error: 'Church not found' });
    }
    res.json(church);
  } catch (error) {
    console.error('Error fetching church:', error);
    res.status(500).json({ error: 'Failed to fetch church' });
  }
};

// 전화번호로 교회 조회 (관리자 전화번호)
export const getChurchByPhone = async (req: Request, res: Response) => {
  try {
    const { manager_Phone } = req.params;
    const manager = await Manager.findOne({
      where: { manager_Phone },
      include: [{
        model: Church,
        as: 'church',
        required: true
      }]
    });

    if (!manager) {
      return res.status(404).json({ message: 'Church not found' });
    }

    const church = (manager as any).church;
    res.json(church);
  } catch (error) {
    console.error('Error getting church by phone:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 새 교회 생성
export const createChurch = async (req: Request, res: Response) => {
  try {
    const { church_reg_ID, church_sub_ID, church_Name, church_Location, church_Phone } = req.body;
    const church = await Church.create({
      church_reg_ID,
      church_sub_ID,
      church_Name,
      church_Location,
      church_Phone
    });
    res.status(201).json(church);
  } catch (error) {
    console.error('Error creating church:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 교회 업데이트
export const updateChurch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { church_reg_ID, church_sub_ID, church_Name, church_Location, church_Phone } = req.body;
    const church = await Church.findByPk(id);
    if (!church) {
      return res.status(404).json({ message: 'Church not found' });
    }
    await church.update({
      church_reg_ID,
      church_sub_ID,
      church_Name,
      church_Location,
      church_Phone
    });
    res.json(church);
  } catch (error) {
    console.error('Error updating church:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 교회 삭제
export const deleteChurch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const church = await Church.findByPk(id);
    if (!church) {
      return res.status(404).json({ message: 'Church not found' });
    }
    await church.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting church:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 