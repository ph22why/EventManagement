import express from 'express';
import pool from '../db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const router = express.Router();

// Get all receipts
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM receiptdb');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching receipts:', error);
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
});

// Get receipt by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM receiptdb WHERE receipt_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({ error: 'Failed to fetch receipt' });
  }
});

// Create new receipt
router.post('/', async (req, res) => {
  try {
    const { event_ID, church_ID, receipt_Date, receipt_Amount, receipt_Of, receipt_Participants } = req.body;
    
    // Validate church_ID exists
    const [churchRows] = await pool.query<RowDataPacket[]>('SELECT church_reg_ID FROM churchdb WHERE church_reg_ID = ?', [church_ID]);
    if (churchRows.length === 0) {
      return res.status(400).json({ error: 'Invalid church registration number' });
    }
    
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO receiptdb (event_ID, church_ID, receipt_Date, receipt_Amount, receipt_Of, receipt_Participants) VALUES (?, ?, ?, ?, ?, ?)',
      [event_ID, church_ID, receipt_Date, receipt_Amount, receipt_Of, receipt_Participants]
    );
    
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating receipt:', error);
    res.status(500).json({ error: 'Failed to create receipt' });
  }
});

// Update receipt
router.put('/:id', async (req, res) => {
  try {
    const { event_ID, church_ID, receipt_Date, receipt_Amount, receipt_Of, receipt_Participants } = req.body;
    
    await pool.query<ResultSetHeader>(
      'UPDATE receiptdb SET event_ID = ?, church_ID = ?, receipt_Date = ?, receipt_Amount = ?, receipt_Of = ?, receipt_Participants = ? WHERE receipt_ID = ?',
      [event_ID, church_ID, receipt_Date, receipt_Amount, receipt_Of, receipt_Participants, req.params.id]
    );
    
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating receipt:', error);
    res.status(500).json({ error: 'Failed to update receipt' });
  }
});

// Delete receipt
router.delete('/:id', async (req, res) => {
  try {
    await pool.query<ResultSetHeader>('DELETE FROM receiptdb WHERE receipt_ID = ?', [req.params.id]);
    res.json({ message: 'Receipt deleted successfully' });
  } catch (error) {
    console.error('Error deleting receipt:', error);
    res.status(500).json({ error: 'Failed to delete receipt' });
  }
});

export default router; 