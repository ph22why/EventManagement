import express from 'express';
import pool from '../db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const router = express.Router();

// Get all churches
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM churchdb');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching churches:', error);
    res.status(500).json({ error: 'Failed to fetch churches' });
  }
});

// Get church by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM churchdb WHERE church_reg_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Church not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching church:', error);
    res.status(500).json({ error: 'Failed to fetch church' });
  }
});

// Create new church
router.post('/', async (req, res) => {
  try {
    const { church_reg_ID, church_sub_ID, church_Name, church_Location } = req.body;
    
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO churchdb (church_reg_ID, church_sub_ID, church_Name, church_Location) VALUES (?, ?, ?, ?)',
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
    res.status(500).json({ error: 'Failed to create church' });
  }
});

// Update church
router.put('/:id', async (req, res) => {
  try {
    const { church_sub_ID, church_Name, church_Location } = req.body;
    
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE churchdb SET church_sub_ID = ?, church_Name = ?, church_Location = ? WHERE church_reg_ID = ?',
      [church_sub_ID, church_Name, church_Location, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Church not found' });
    }

    res.json({ message: 'Church updated successfully' });
  } catch (error) {
    console.error('Error updating church:', error);
    res.status(500).json({ error: 'Failed to update church' });
  }
});

// Delete church
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM churchdb WHERE church_reg_ID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Church not found' });
    }

    res.json({ message: 'Church deleted successfully' });
  } catch (error) {
    console.error('Error deleting church:', error);
    res.status(500).json({ error: 'Failed to delete church' });
  }
});

// Search church by phone
router.get('/phone/:phone', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM churchdb WHERE church_Phone = ?', [req.params.phone]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching church by phone:', error);
    res.status(500).json({ error: 'Failed to search church' });
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