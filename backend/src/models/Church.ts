import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Church extends Model {
  public church_ID!: number;
  public church_reg_ID!: string;
  public church_sub_ID!: string;
  public church_Name!: string;
  public church_Location!: string;
}

Church.init(
  {
    church_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    church_reg_ID: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    church_sub_ID: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: 'a',
    },
    church_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    church_Location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Church',
    tableName: 'ChurchDB',
    timestamps: false,
  }
);

export default Church; 