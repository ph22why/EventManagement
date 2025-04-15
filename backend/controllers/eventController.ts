import { Request, Response } from 'express';
import EventModel from '../models/Event';
import SampleEventModel from '../models/SampleEvent';

// Get all sample events
export const getSampleEvents = async (req: Request, res: Response) => {
  try {
    const sampleEvents = await SampleEventModel.findAll();
    res.json(sampleEvents);
  } catch (error) {
    console.error('Error fetching sample events:', error);
    res.status(500).json({ message: 'Error fetching sample events' });
  }
};

// Create a new event from sample event
export const createEventFromSample = async (req: Request, res: Response) => {
  try {
    const { sampleEventId, ...eventData } = req.body;
    
    // Get the sample event
    const sampleEvent = await SampleEventModel.findByPk(sampleEventId);
    if (!sampleEvent) {
      return res.status(404).json({ message: 'Sample event not found' });
    }

    // Create new event using sample event data and provided updates
    const newEvent = await EventModel.create({
      event_Name: eventData.event_Name || sampleEvent.event_Name,
      event_Location: eventData.event_Location || sampleEvent.event_Location,
      event_Year: eventData.event_Year || sampleEvent.event_Year,
      event_Date: eventData.event_Date || sampleEvent.event_Date,
      event_Open_Available: eventData.event_Open_Available || sampleEvent.event_Open_Available,
      event_Place: eventData.event_Place || sampleEvent.event_Place,
      event_Month: eventData.event_Month || sampleEvent.event_Month,
      event_Description: eventData.event_Description,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
};

// Get all events
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await EventModel.findAll({
      order: [['event_Date', 'ASC']],
    });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

// Update an event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventData = req.body;

    const event = await EventModel.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.update(eventData);
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await EventModel.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
}; 