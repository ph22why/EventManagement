import express, { Router } from 'express';
import {
  getAllReceipts,
  getReceiptById,
  updateReceipt
} from '../controllers/receiptController';

const router: Router = express.Router();

// 모든 영수증 조회
router.get('/', getAllReceipts);

// 특정 영수증 조회
router.get('/:id', getReceiptById);

// 영수증 업데이트
router.put('/:id', updateReceipt);

export default router; 