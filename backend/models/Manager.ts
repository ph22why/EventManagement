import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/sequelize';

export interface ManagerAttributes {
  manager_ID: number;
  manager_Name: string;
  manager_Phone: string;
  manager_Email: string;
  manager_Password: string;
}

export interface ManagerCreationAttributes extends Optional<ManagerAttributes, 'manager_ID'> {}

class ManagerModel extends Model<ManagerAttributes, ManagerCreationAttributes> implements ManagerAttributes {
  public manager_ID!: number;
  public manager_Name!: string;
  public manager_Phone!: string;
  public manager_Email!: string;
  public manager_Password!: string;
}

ManagerModel.init(
  {
    manager_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    manager_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    manager_Phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    manager_Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    manager_Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Manager',
    tableName: 'managers',
    timestamps: false,
  }
);

export default ManagerModel; 