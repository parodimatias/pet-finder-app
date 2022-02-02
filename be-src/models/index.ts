import { Sequelize } from "sequelize";
export const sequelize = new Sequelize({
  dialect: "postgres",
  username: "pzadprxdazemxn",
  password: "8da68df538b9dc9ca051a69bb957161dcaecbd7a3e80e9756b0f13a86dcbf042",
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
