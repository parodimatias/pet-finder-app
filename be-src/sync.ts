import { sequelize } from "./models";
import { Pet } from "./models/models";
async function main() {
  try {
    await Pet.sync({ force: true });
    await sequelize.sync({ force: true });
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
main();
