import { Model, ModelStatic, FindOptions, WhereOptions } from 'sequelize';
import { EventChurchMemberAttributes } from '../models/EventChurchMember';
import { EventChurchAttributes } from '../models/EventChurch';

// Define the Church model type
export interface ChurchAttributes {
  church_ID: number;
  church_reg_ID: string;
  church_sub_ID: string;
  church_Name: string;
  church_Location: string;
  church_Phone: string;
}

export interface ChurchCreationAttributes extends Partial<ChurchAttributes> {}

export interface ChurchInstance extends Model<ChurchAttributes, ChurchCreationAttributes>, ChurchAttributes {}

export interface ChurchModelStatic extends ModelStatic<ChurchInstance> {
  findOne(options?: FindOptions<ChurchAttributes>): Promise<ChurchInstance | null>;
  findAll(options?: FindOptions<ChurchAttributes>): Promise<ChurchInstance[]>;
}

// Define the Event model type
export interface EventAttributes {
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

export interface EventCreationAttributes extends Partial<EventAttributes> {}

export interface EventInstance extends Model<EventAttributes, EventCreationAttributes>, EventAttributes {}

export interface EventModelStatic extends ModelStatic<EventInstance> {
  findOne(options?: FindOptions<EventAttributes>): Promise<EventInstance | null>;
  findAll(options?: FindOptions<EventAttributes>): Promise<EventInstance[]>;
}

// Define the EventChurch model type
export interface EventChurchInstance extends Model<EventChurchAttributes, EventChurchAttributes>, EventChurchAttributes {
  Event?: EventInstance;
  Church?: ChurchInstance;
}

export interface EventChurchModelStatic extends ModelStatic<EventChurchInstance> {
  findOne(options?: FindOptions<EventChurchAttributes>): Promise<EventChurchInstance | null>;
  findAll(options?: FindOptions<EventChurchAttributes>): Promise<EventChurchInstance[]>;
}

// Define the EventChurchMember model type
export interface EventChurchMemberInstance extends Model<EventChurchMemberAttributes, EventChurchMemberAttributes>, EventChurchMemberAttributes {
  EventChurch?: EventChurchInstance;
}

export interface EventChurchMemberModelStatic extends ModelStatic<EventChurchMemberInstance> {
  findOne(options?: FindOptions<EventChurchMemberAttributes>): Promise<EventChurchMemberInstance | null>;
  findAll(options?: FindOptions<EventChurchMemberAttributes>): Promise<EventChurchMemberInstance[]>;
  create(values: EventChurchMemberAttributes): Promise<EventChurchMemberInstance>;
} 