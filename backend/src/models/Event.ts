import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/sequelize';

export interface EventAttributes {
  event_ID: number;
  event_Name: string;
  event_Date: Date;
  event_Location: string;
  event_Description?: string;
}

export interface EventCreationAttributes extends Optional<EventAttributes, 'event_ID'> {}

class EventModel extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public event_ID!: number;
  public event_Name!: string;
  public event_Date!: Date;
  public event_Location!: string;
  public event_Description?: string;
}

EventModel.init(
  {
    event_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    event_Location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_Description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: false,
  }
);

export default EventModel; 