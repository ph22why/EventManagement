import express from 'express';
import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const router = express.Router();

// 영수증 목록 조회
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM ReceiptDB');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching receipts:', error);
    res.status(500).json({ error: '영수증 목록을 불러오는데 실패했습니다.' });
  }
});

// 영수증 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM ReceiptDB WHERE receipt_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: '영수증을 찾을 수 없습니다.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({ error: '영수증 정보를 불러오는데 실패했습니다.' });
  }
});

// 영수증 생성
router.post('/', async (req, res) => {
  try {
    const { receipt_ID, event_ID, church_reg_ID, receipt_Amount, receipt_Date } = req.body;
    
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO ReceiptDB (receipt_ID, event_ID, church_reg_ID, receipt_Amount, receipt_Date) VALUES (?, ?, ?, ?, ?)',
      [receipt_ID, event_ID, church_reg_ID, receipt_Amount, receipt_Date]
    );

    const newReceipt = {
      receipt_ID,
      event_ID,
      church_reg_ID,
      receipt_Amount,
      receipt_Date
    };

    res.status(201).json(newReceipt);
  } catch (error) {
    console.error('Error creating receipt:', error);
    res.status(500).json({ error: '영수증 생성에 실패했습니다.' });
  }
});

// 영수증 수정
router.put('/:id', async (req, res) => {
  try {
    const { event_ID, church_reg_ID, receipt_Amount, receipt_Date } = req.body;
    
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE ReceiptDB SET event_ID = ?, church_reg_ID = ?, receipt_Amount = ?, receipt_Date = ? WHERE receipt_ID = ?',
      [event_ID, church_reg_ID, receipt_Amount, receipt_Date, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '영수증을 찾을 수 없습니다.' });
    }

    res.json({ message: '영수증이 성공적으로 수정되었습니다.' });
  } catch (error) {
    console.error('Error updating receipt:', error);
    res.status(500).json({ error: '영수증 수정에 실패했습니다.' });
  }
});

// 영수증 삭제
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM ReceiptDB WHERE receipt_ID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '영수증을 찾을 수 없습니다.' });
    }

    res.json({ message: '영수증이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('Error deleting receipt:', error);
    res.status(500).json({ error: '영수증 삭제에 실패했습니다.' });
  }
});

export default router; 