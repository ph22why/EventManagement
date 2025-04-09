import express from 'express';
import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const router = express.Router();

// 모든 이벤트 조회
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM EventDB');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: '이벤트 목록을 불러오는데 실패했습니다.' });
  }
});

// 특정 이벤트 조회
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM EventDB WHERE event_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: '이벤트를 찾을 수 없습니다.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: '이벤트 정보를 불러오는데 실패했습니다.' });
  }
});

// 새 이벤트 생성
router.post('/', async (req, res) => {
  try {
    const { event_Name, event_Description, event_Period, event_Region, event_Place, event_Participants, event_Open_Available } = req.body;
    
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO EventDB (event_Name, event_Description, event_Period, event_Region, event_Place, event_Participants, event_Open_Available) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [event_Name, event_Description, event_Period, event_Region, event_Place, event_Participants, event_Open_Available]
    );

    const newEvent = {
      event_ID: result.insertId,
      event_Name,
      event_Description,
      event_Period,
      event_Region,
      event_Place,
      event_Participants,
      event_Open_Available
    };

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: '이벤트 생성에 실패했습니다.' });
  }
});

// 이벤트 수정
router.put('/:id', async (req, res) => {
  try {
    const { event_Name, event_Description, event_Period, event_Region, event_Place, event_Participants, event_Open_Available } = req.body;
    
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE EventDB SET event_Name = ?, event_Description = ?, event_Period = ?, event_Region = ?, event_Place = ?, event_Participants = ?, event_Open_Available = ? WHERE event_ID = ?',
      [event_Name, event_Description, event_Period, event_Region, event_Place, event_Participants, event_Open_Available, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '이벤트를 찾을 수 없습니다.' });
    }

    res.json({ message: '이벤트가 성공적으로 수정되었습니다.' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: '이벤트 수정에 실패했습니다.' });
  }
});

// 이벤트 삭제
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM EventDB WHERE event_ID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '이벤트를 찾을 수 없습니다.' });
    }

    res.json({ message: '이벤트가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: '이벤트 삭제에 실패했습니다.' });
  }
});

export default router; 