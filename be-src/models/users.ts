import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
export class User extends Model {}
User.init(
  {
    email: DataTypes.STRING,
    fullName: DataTypes.STRING,
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
  },
  { sequelize, modelName: "user" }
);
``;
