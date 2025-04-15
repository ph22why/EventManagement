import { Model } from 'sequelize';
import { EventChurchMemberAttributes } from '../models/EventChurchMember';
import { EventChurchAttributes } from '../models/EventChurch';

// Define the Church model type
export interface ChurchModel extends Model {
  church_ID: number;
  church_reg_ID: string;
  church_sub_ID: string;
  church_Name: string;
  church_Location: string;
  church_Phone: string;
}

// Define the Event model type
export interface EventModel extends Model {
  event_ID: number;
  event_Name: string;
  event_Date: Date;
  event_Location: string;
  event_Place: string;
  event_Month: string;
  event_Year: string;
  event_Open_Available: string;
  event_Description?: string;
}

// Define the EventChurch model type with relationships
export interface EventChurchModel extends Model<EventChurchAttributes> {
  event_church_id: number;
  event_ID: number;
  church_ID: number;
  manager_ID: number;
  Event?: EventModel;
  Church?: ChurchModel;
}

// Define the EventChurchMember model type with relationships
export interface EventChurchMemberModel extends Model<EventChurchMemberAttributes> {
  member_ID: number;
  event_church_id: number;
  member_Name: string;
  member_Phone: string;
  member_Type: string;
  member_Status: string;
  EventChurch?: EventChurchModel;
} 