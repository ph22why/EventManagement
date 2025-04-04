import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Manager extends Model {
  public manager_ID!: number;
  public manager_Name!: string;
  public manager_Phone!: string;
  public manager_Mail!: string;
  public manager_Bank!: string;
  public manager_Account!: string;
}

Manager.init(
  {
    manager_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    manager_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    manager_Phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    manager_Mail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    manager_Bank: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    manager_Account: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Manager',
    tableName: 'ManagerDB',
    timestamps: false,
  }
);

export default Manager; 