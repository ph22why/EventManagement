import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Event extends Model {
  public event_ID!: number;
  public event_Name!: string;
  public event_Location!: string;
  public event_Year!: number;
  public event_Date!: Date;
  public event_Open_Available!: boolean;
  public event_Place!: string;
}

Event.init(
  {
    event_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_Location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_Year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    event_Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    event_Open_Available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    event_Place: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Event',
    tableName: 'EventDB',
    timestamps: false,
  }
);

export default Event; 