import express from 'express';
import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const router = express.Router();

// 교회 목록 조회
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM ChurchDB');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching churches:', error);
    res.status(500).json({ error: '교회 목록을 불러오는데 실패했습니다.' });
  }
});

// 교회 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM ChurchDB WHERE church_reg_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: '교회를 찾을 수 없습니다.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching church:', error);
    res.status(500).json({ error: '교회 정보를 불러오는데 실패했습니다.' });
  }
});

// 교회 생성
router.post('/', async (req, res) => {
  try {
    const { church_reg_ID, church_sub_ID, church_Name, church_Location } = req.body;
    
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO ChurchDB (church_reg_ID, church_sub_ID, church_Name, church_Location) VALUES (?, ?, ?, ?)',
      [church_reg_ID, church_sub_ID, church_Name, church_Location]
    );

    const newChurch = {
      church_reg_ID,
      church_sub_ID,
      church_Name,
      church_Location
    };

    res.status(201).json(newChurch);
  } catch (error) {
    console.error('Error creating church:', error);
    res.status(500).json({ error: '교회 생성에 실패했습니다.' });
  }
});

// 교회 수정
router.put('/:id', async (req, res) => {
  try {
    const { church_sub_ID, church_Name, church_Location } = req.body;
    
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE ChurchDB SET church_sub_ID = ?, church_Name = ?, church_Location = ? WHERE church_reg_ID = ?',
      [church_sub_ID, church_Name, church_Location, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '교회를 찾을 수 없습니다.' });
    }

    res.json({ message: '교회가 성공적으로 수정되었습니다.' });
  } catch (error) {
    console.error('Error updating church:', error);
    res.status(500).json({ error: '교회 수정에 실패했습니다.' });
  }
});

// 교회 삭제
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM ChurchDB WHERE church_reg_ID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '교회를 찾을 수 없습니다.' });
    }

    res.json({ message: '교회가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('Error deleting church:', error);
    res.status(500).json({ error: '교회 삭제에 실패했습니다.' });
  }
});

// 전화번호로 교회 검색
router.get('/phone/:phone', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM ChurchDB WHERE church_Phone = ?', [req.params.phone]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching church by phone:', error);
    res.status(500).json({ error: '교회 검색에 실패했습니다.' });
  }
});

// 등록번호로 교회 검색
router.get('/reg/:regId', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM ChurchDB WHERE church_reg_ID = ?', [req.params.regId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching church by regId:', error);
    res.status(500).json({ error: '교회 검색에 실패했습니다.' });
  }
});

export default router; 