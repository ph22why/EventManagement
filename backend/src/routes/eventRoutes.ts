import express, { Router } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController';

const router: Router = express.Router();

// 모든 이벤트 조회
router.get('/', getAllEvents);

// 특정 이벤트 조회
router.get('/:id', getEventById);

// 새 이벤트 생성
router.post('/', createEvent);

// 이벤트 업데이트
router.put('/:id', updateEvent);

// 이벤트 삭제
router.delete('/:id', deleteEvent);

export default router; 