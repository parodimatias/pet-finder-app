import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";

export class Pet extends Model {}
Pet.init(
  {
    nombre: DataTypes.STRING,
    picture: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
  },
  { sequelize, modelName: "pet" }
);
