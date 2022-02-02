import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
export class Auth extends Model {}
Auth.init(
  {
    password: DataTypes.STRING,
  },
  { sequelize, modelName: "auth" }
);
