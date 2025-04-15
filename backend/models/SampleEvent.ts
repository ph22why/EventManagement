import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/sequelize';

export interface SampleEventAttributes {
  event_ID: number;
  event_Name: string;
  event_Location: string;
  event_Year: string;
  event_Date: string;
  event_Open_Available: string;
  event_Place: string;
  event_Month: string;
}

export interface SampleEventCreationAttributes extends Optional<SampleEventAttributes, 'event_ID'> {}

class SampleEventModel extends Model<SampleEventAttributes, SampleEventCreationAttributes> implements SampleEventAttributes {
  public event_ID!: number;
  public event_Name!: string;
  public event_Location!: string;
  public event_Year!: string;
  public event_Date!: string;
  public event_Open_Available!: string;
  public event_Place!: string;
  public event_Month!: string;
}

SampleEventModel.init(
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
    event_Location: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '미정',
    },
    event_Year: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '미정',
    },
    event_Date: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '미정',
    },
    event_Open_Available: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '비공개',
    },
    event_Place: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '미정',
    },
    event_Month: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '미정',
    },
  },
  {
    sequelize,
    modelName: 'SampleEvent',
    tableName: 'sample_events',
    timestamps: false,
  }
);

export default SampleEventModel; 