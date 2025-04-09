import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/sequelize';
import ChurchModel from './Church';
import EventModel from './Event';

export interface EventChurchAttributes {
  event_church_id: number;
  event_ID: number;
  church_ID: number;
  manager_ID: number;
}

export interface EventChurchCreationAttributes extends Optional<EventChurchAttributes, 'event_church_id'> {}

class EventChurchModel extends Model<EventChurchAttributes, EventChurchCreationAttributes> implements EventChurchAttributes {
  public event_church_id!: number;
  public event_ID!: number;
  public church_ID!: number;
  public manager_ID!: number;
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
      references: {
        model: EventModel,
        key: 'event_ID',
      },
    },
    church_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ChurchModel,
        key: 'church_ID',
      },
    },
    manager_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'EventChurch',
    tableName: 'event_churches',
    timestamps: false,
  }
);

// 모델 간 관계 설정
EventChurchModel.belongsTo(ChurchModel, { foreignKey: 'church_ID' });
EventChurchModel.belongsTo(EventModel, { foreignKey: 'event_ID' });

export default EventChurchModel; 