import { User } from "./users";
import { Auth } from "./auth";
import { Pet } from "./pets";

User.hasMany(Pet);
User.hasOne(Auth);
Pet.belongsTo(User);
export { User, Pet, Auth };
