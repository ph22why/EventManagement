import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import EventChurch from './EventChurch';

class EventChurchMember extends Model {
  public id!: number;
  public event_church_id!: number;
  public part_Name!: string;
  public part_Phone!: string;
  public belong!: string;
  public state_add!: boolean;
  public state_edit!: boolean;
  public state_memo!: string;
}

EventChurchMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event_church_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EventChurch,
        key: 'id',
      },
    },
    part_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    part_Phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    belong: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state_add: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    state_edit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    state_memo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'EventChurchMember',
    tableName: 'Event-Church-MemberDB',
    timestamps: false,
  }
);

// 관계 설정
EventChurchMember.belongsTo(EventChurch, { foreignKey: 'event_church_id' });

export default EventChurchMember; 