import express from 'express';
import {
  getSampleEvents,
  createEventFromSample,
  getEvents,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController';

const router = express.Router();

// Sample events routes
router.get('/sample', getSampleEvents);

// Event routes
router.post('/', createEventFromSample);
router.get('/', getEvents);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router; 