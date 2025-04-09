import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/sequelize';

export interface ChurchAttributes {
  church_ID: number;
  church_reg_ID: string;
  church_sub_ID: string;
  church_Name: string;
  church_Location: string;
  church_Phone?: string;
}

export interface ChurchCreationAttributes extends Optional<ChurchAttributes, 'church_ID'> {}

class ChurchModel extends Model<ChurchAttributes, ChurchCreationAttributes> implements ChurchAttributes {
  public church_ID!: number;
  public church_reg_ID!: string;
  public church_sub_ID!: string;
  public church_Name!: string;
  public church_Location!: string;
  public church_Phone?: string;
}

ChurchModel.init(
  {
    church_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    church_reg_ID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    church_sub_ID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    church_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    church_Location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    church_Phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Church',
    tableName: 'churches',
    timestamps: false,
  }
);

export default ChurchModel; 