import { Model, DataTypes, Optional } from 'sequelize';
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
      references: {
        model: EventChurchModel,
        key: 'event_church_id',
      },
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

// 모델 간 관계 설정
EventChurchMemberModel.belongsTo(EventChurchModel, { foreignKey: 'event_church_id' });

export default EventChurchMemberModel; 