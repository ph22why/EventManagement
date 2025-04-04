import express, { Router } from 'express';
import {
  getAllChurches,
  getChurchById,
  getChurchByRegId,
  getChurchByPhone,
  createChurch,
  updateChurch,
  deleteChurch
} from '../controllers/churchController';

const router: Router = express.Router();

// 모든 교회 조회
router.get('/', getAllChurches);

// 특정 교회 조회
router.get('/:id', getChurchById);

// 등록번호로 교회 조회
router.get('/reg/:regId', getChurchByRegId);

// 전화번호로 교회 조회
router.get('/phone/:phone', getChurchByPhone);

// 새 교회 생성
router.post('/', createChurch);

// 교회 업데이트
router.put('/:id', updateChurch);

// 교회 삭제
router.delete('/:id', deleteChurch);

export default router; 