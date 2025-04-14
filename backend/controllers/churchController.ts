import { Request, Response } from 'express';
import { ChurchModel, ChurchAttributes, ChurchCreationAttributes } from '../models';
import { ManagerModel, ManagerAttributes } from '../models';
import { EventChurchModel } from '../models';
import { Op } from 'sequelize';

// 타입 정의 추가
interface ChurchManager extends ManagerAttributes {
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
    const churches = await ChurchModel.findAll();
    res.json(churches);
  } catch (error) {
    console.error('Error fetching churches:', error);
    res.status(500).json({ error: 'Failed to fetch churches' });
  }
};

// 특정 교회 조회
export const getChurchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const church = await ChurchModel.findByPk(id);
    if (!church) {
      return res.status(404).json({ error: 'Church not found' });
    }
    res.json(church);
  } catch (error) {
    console.error('Error fetching church:', error);
    res.status(500).json({ error: 'Failed to fetch church' });
  }
};

// 등록번호로 교회 조회
export const getChurchByRegId = async (req: Request, res: Response) => {
  try {
    const { regId } = req.params;
    const church = await ChurchModel.findOne({
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
    const manager = await ManagerModel.findOne({
      where: { manager_Phone },
      include: [{
        model: ChurchModel,
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

    // 중복 등록번호 확인
    const existingChurch = await ChurchModel.findOne({
      where: { church_reg_ID }
    });

    if (existingChurch) {
      return res.status(400).json({ error: 'Church registration number already exists' });
    }

    const church = await ChurchModel.create({
      church_reg_ID,
      church_sub_ID,
      church_Name,
      church_Location,
      church_Phone
    });

    res.status(201).json(church);
  } catch (error) {
    console.error('Error creating church:', error);
    res.status(500).json({ error: 'Failed to create church' });
  }
};

// 교회 업데이트
export const updateChurch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { church_sub_ID, church_Name, church_Location, church_Phone } = req.body;

    const church = await ChurchModel.findByPk(id);
    if (!church) {
      return res.status(404).json({ error: 'Church not found' });
    }

    await church.update({
      church_sub_ID,
      church_Name,
      church_Location,
      church_Phone
    });

    res.json(church);
  } catch (error) {
    console.error('Error updating church:', error);
    res.status(500).json({ error: 'Failed to update church' });
  }
};

// 교회 삭제
export const deleteChurch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const church = await ChurchModel.findByPk(id);
    if (!church) {
      return res.status(404).json({ error: 'Church not found' });
    }

    await church.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting church:', error);
    res.status(500).json({ error: 'Failed to delete church' });
  }
}; 