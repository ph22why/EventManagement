import { Model, DataTypes, Optional, Op } from 'sequelize';
import sequelize from '../config/sequelize';
import EventChurchModel from './EventChurch';

export interface EventChurchMemberAttributes {
  member_ID: number;
  event_church_id: number;
  member_Name: string;
  member_Phone: string;
  member_Type: string;
  member_Status: string;
}

export interface EventChurchMemberCreationAttributes extends Optional<EventChurchMemberAttributes, 'member_ID'> {}

class EventChurchMemberModel extends Model<EventChurchMemberAttributes, EventChurchMemberCreationAttributes> implements EventChurchMemberAttributes {
  public member_ID!: number;
  public event_church_id!: number;
  public member_Name!: string;
  public member_Phone!: string;
  public member_Type!: string;
  public member_Status!: string;

  // Add static methods
  public static async findByEventId(eventId: number): Promise<EventChurchMemberModel[]> {
    const eventChurch = await EventChurchModel.findOne({
      where: { event_ID: eventId }
    });

    if (!eventChurch) {
      return [];
    }

    return this.findAll({
      where: { event_church_id: eventChurch.event_church_id }
    });
  }

  public static async findByChurchId(churchId: string): Promise<EventChurchMemberModel[]> {
    const eventChurches = await EventChurchModel.findAll({
      where: { church_ID: parseInt(churchId) }
    });

    if (eventChurches.length === 0) {
      return [];
    }

    const eventChurchIds = eventChurches.map(ec => ec.event_church_id);
    return this.findAll({
      where: { event_church_id: { [Op.in]: eventChurchIds } }
    });
  }
}

EventChurchMemberModel.init(
  {
    member_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_church_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    member_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    member_Phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    member_Type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    member_Status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'EventChurchMember',
    tableName: 'event_church_members',
    timestamps: false,
  }
);

export default EventChurchMemberModel; 