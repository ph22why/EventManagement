import express from 'express';
import pool from '../db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Request, Response } from 'express';

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM eventdb');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get sample events
router.get('/sampleEvents', async (req, res) => {
  try {
    // console.log('Fetching sample events...');
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM sampleeventdb');
    // console.log('Sample events fetched:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching sample events:', error);
    res.status(500).json({ error: 'Failed to fetch sample events' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM eventdb WHERE event_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create new event
router.post('/', async (req, res) => {
  try {
    const { event_Name, event_Location, event_Year, event_Start_Date, event_End_Date, event_Registration_Start_Date, event_Registration_End_Date, event_Open_Available, event_Place, event_Month, event_Description } = req.body;
    
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO eventdb (event_Name, event_Location, event_Year, event_Start_Date, event_End_Date, event_Registration_Start_Date, event_Registration_End_Date, event_Open_Available, event_Place, event_Month, event_Description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [event_Name, event_Location, event_Year, event_Start_Date, event_End_Date, event_Registration_Start_Date, event_Registration_End_Date, event_Open_Available, event_Place, event_Month, event_Description]
    );
    
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const { event_Name, event_Location, event_Year, event_Start_Date, event_End_Date, event_Registration_Start_Date, event_Registration_End_Date, event_Open_Available, event_Place, event_Month, event_Description } = req.body;
    
    await pool.query<ResultSetHeader>(
      'UPDATE eventdb SET event_Name = ?, event_Location = ?, event_Year = ?, event_Start_Date = ?, event_End_Date = ?, event_Registration_Start_Date = ?, event_Registration_End_Date = ?, event_Open_Available = ?, event_Place = ?, event_Month = ?, event_Description = ? WHERE event_ID = ?',
      [event_Name, event_Location, event_Year, event_Start_Date, event_End_Date, event_Registration_Start_Date, event_Registration_End_Date, event_Open_Available, event_Place, event_Month, event_Description, req.params.id]
    );
    
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    await pool.query<ResultSetHeader>('DELETE FROM eventdb WHERE event_ID = ?', [req.params.id]);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router; 