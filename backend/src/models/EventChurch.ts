import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Event from './Event';
import Church from './Church';
import Manager from './Manager';

class EventChurch extends Model {
  public id!: number;
  public event_ID!: number;
  public church_ID!: number;
  public manager_ID!: number;
  public part_total!: number;
  public part_student!: number;
  public part_teacher!: number;
  public part_ym!: number;
  public costs!: number;
  
  // 관계 정의
  public readonly Event?: Event;
  public readonly Church?: Church;
  public readonly Manager?: Manager;
}

EventChurch.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: 'event_ID',
      },
    },
    church_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Church,
        key: 'church_ID',
      },
    },
    manager_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Manager,
        key: 'manager_ID',
      },
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
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'EventChurch',
    tableName: 'Event-ChurchDB',
    timestamps: false,
  }
);

// 관계 설정
EventChurch.belongsTo(Event, { foreignKey: 'event_ID' });
EventChurch.belongsTo(Church, { foreignKey: 'church_ID' });
EventChurch.belongsTo(Manager, { foreignKey: 'manager_ID' });

export default EventChurch; 