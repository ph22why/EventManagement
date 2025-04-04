import { Request, Response } from 'express';
import { Church, Manager, EventChurch } from '../models';
import { Op } from 'sequelize';

// 모든 교회 조회
export const getAllChurches = async (req: Request, res: Response) => {
  try {
    const churches = await Church.findAll();
    return res.status(200).json(churches);
  } catch (error) {
    console.error('교회 조회 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 특정 교회 조회
export const getChurchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const church = await Church.findByPk(id);
    
    if (!church) {
      return res.status(404).json({ message: '교회를 찾을 수 없습니다.' });
    }
    
    return res.status(200).json(church);
  } catch (error) {
    console.error('교회 조회 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 등록번호로 교회 조회
export const getChurchByRegId = async (req: Request, res: Response) => {
  try {
    const { regId } = req.params;
    const churches = await Church.findAll({
      where: {
        church_reg_ID: regId
      }
    });
    
    if (churches.length === 0) {
      return res.status(404).json({ message: '해당 등록번호의 교회를 찾을 수 없습니다.' });
    }
    
    return res.status(200).json(churches);
  } catch (error) {
    console.error('교회 조회 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 전화번호로 교회 조회 (관리자 전화번호)
export const getChurchByPhone = async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;
    
    // Manager 모델에서 전화번호로 관리자 조회
    const managers = await Manager.findAll({
      where: {
        manager_Phone: {
          [Op.like]: `%${phone}%` // 부분 일치 검색
        }
      }
    });
    
    if (managers.length === 0) {
      return res.status(404).json({ message: '해당 전화번호의 관리자를 찾을 수 없습니다.' });
    }
    
    // 관리자 ID 목록 추출
    const managerIds = managers.map(manager => manager.manager_ID);
    
    // EventChurch 모델을 통해 교회 조회
    const eventChurches = await EventChurch.findAll({
      where: {
        manager_ID: {
          [Op.in]: managerIds
        }
      },
      include: [
        {
          model: Church,
          attributes: ['church_ID', 'church_reg_ID', 'church_sub_ID', 'church_Name', 'church_Location']
        }
      ]
    });
    
    if (eventChurches.length === 0) {
      return res.status(404).json({ message: '해당 전화번호의 교회를 찾을 수 없습니다.' });
    }
    
    // 중복 제거를 위해 Set 사용
    const uniqueChurches = new Set();
    const churches = eventChurches
      .map(ec => {
        // @ts-ignore - Sequelize가 생성한 속성에 접근
        return ec.Church;
      })
      .filter(church => {
        if (!church) return false;
        if (uniqueChurches.has(church.church_ID)) {
          return false;
        }
        uniqueChurches.add(church.church_ID);
        return true;
      });
    
    return res.status(200).json(churches);
  } catch (error) {
    console.error('교회 조회 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 새 교회 생성
export const createChurch = async (req: Request, res: Response) => {
  try {
    const { church_reg_ID, church_sub_ID, church_Name, church_Location } = req.body;
    
    // 등록번호 중복 확인
    const existingChurches = await Church.findAll({
      where: {
        church_reg_ID
      }
    });
    
    // 중복된 등록번호가 있고 sub_ID가 지정되지 않은 경우
    if (existingChurches.length > 0 && !church_sub_ID) {
      // 마지막 sub_ID의 다음 문자를 생성
      const lastSubId = existingChurches[existingChurches.length - 1].church_sub_ID;
      const nextSubId = String.fromCharCode(lastSubId.charCodeAt(0) + 1);
      
      const newChurch = await Church.create({
        church_reg_ID,
        church_sub_ID: nextSubId,
        church_Name,
        church_Location
      });
      
      return res.status(201).json(newChurch);
    }
    
    // 중복이 없거나 sub_ID가 지정된 경우
    const newChurch = await Church.create({
      church_reg_ID,
      church_sub_ID: church_sub_ID || 'a',
      church_Name,
      church_Location
    });
    
    return res.status(201).json(newChurch);
  } catch (error) {
    console.error('교회 생성 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 교회 업데이트
export const updateChurch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { church_reg_ID, church_sub_ID, church_Name, church_Location } = req.body;
    
    const church = await Church.findByPk(id);
    
    if (!church) {
      return res.status(404).json({ message: '교회를 찾을 수 없습니다.' });
    }
    
    await church.update({
      church_reg_ID,
      church_sub_ID,
      church_Name,
      church_Location
    });
    
    return res.status(200).json(church);
  } catch (error) {
    console.error('교회 업데이트 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 교회 삭제
export const deleteChurch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const church = await Church.findByPk(id);
    
    if (!church) {
      return res.status(404).json({ message: '교회를 찾을 수 없습니다.' });
    }
    
    await church.destroy();
    
    return res.status(200).json({ message: '교회가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('교회 삭제 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}; 