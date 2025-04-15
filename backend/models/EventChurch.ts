import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/sequelize';
import EventModel from './Event';
import ChurchModel from './Church';
import EventChurchMemberModel from './EventChurchMember';

export interface EventChurchAttributes {
  event_church_id: number;
  event_ID: number;
  church_ID: number;
  manager_ID: number;
  part_total: number;
  part_student: number;
  part_teacher: number;
  part_ym: number;
  costs: number;
}

export interface EventChurchCreationAttributes extends Optional<EventChurchAttributes, 'event_church_id'> {}

class EventChurchModel extends Model<EventChurchAttributes, EventChurchCreationAttributes> implements EventChurchAttributes {
  public event_church_id!: number;
  public event_ID!: number;
  public church_ID!: number;
  public manager_ID!: number;
  public part_total!: number;
  public part_student!: number;
  public part_teacher!: number;
  public part_ym!: number;
  public costs!: number;

  // Add associations
  public readonly Event?: EventModel;
  public readonly Church?: ChurchModel;
  public readonly Members?: EventChurchMemberModel[];
}

EventChurchModel.init(
  {
    event_church_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    church_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    manager_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    part_total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    part_student: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    part_teacher: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    part_ym: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    costs: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'EventChurch',
    tableName: 'event_churches',
    timestamps: false,
  }
);

// Model associations
EventChurchModel.belongsTo(EventModel, { foreignKey: 'event_ID', as: 'Event' });
EventChurchModel.belongsTo(ChurchModel, { foreignKey: 'church_ID', as: 'Church' });
EventChurchModel.hasMany(EventChurchMemberModel, { foreignKey: 'event_church_id', as: 'Members' });

export default EventChurchModel; 