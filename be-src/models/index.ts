import { Sequelize } from "sequelize";
export const sequelize = new Sequelize({
  dialect: "postgres",
  username: "pzadprxdazemxn",
  password: process.env.SEQUELIZE_PASSWORD,
  database: "de769880lt2m2j",
  port: 5432,
  host: "ec2-18-235-235-165.compute-1.amazonaws.com",
  ssl: true,
  // esto es necesario para que corra correctamente
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
