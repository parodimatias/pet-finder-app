import { petAlgoliaIndex } from "../lib/algolia";
import { Pet, User, Auth } from "../models/models";
import { cloudinary } from "../lib/cloudinary";
import { sendMail } from "../lib/sendgrid";
import * as jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET;
export async function checkEmailExist(email: string): Promise<boolean> {
  try {
    const project = await User.findOne({ where: { email } });
    if (project === null) {
      console.log("Not found!");
      return false;
    } else {
      return true;
    }
  } catch (e) {
    console.log("error");
    throw "error";
  }
}
function stringToHash(message) {
  return require("crypto").createHash("sha256").update(message).digest("hex");
}
export async function userCreate(user: {
  email: string;
  fullName: string;
  password: string;
}) {
  try {
    //Busco el usuario, si no existe lo creo, y "created" pasa a ser "true"
    const [userCreated, created] = await User.findOrCreate({
      where: { email: user.email },
      defaults: {
        email: user.email,
        fullName: user.fullName,
      },
    });
    if (created) {
      //si se creo el usuario, le creo la instancia en Auth con el password
      await userCreated.createAuth({
        password: stringToHash(user.password),
      });
      return "ok";
    } else {
      return "User already exists";
    }
  } catch (e) {
    console.log(e);
    return e;
  }
}
export async function getToken(user: { email; password }) {
  const userFound = await User.findOne({
    where: {
      email: user.email,
    },
    include: [
      {
        model: Auth,
        where: { password: stringToHash(user.password) },
      },
    ],
  });
  if (userFound) {
    const token = jwt.sign({ id: userFound.get("id") }, SECRET);
    return token;
  } else {
    return false;
  }
}
export function verifyToken(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  try {
    req._user_id = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json("Not auth");
  }
}
export async function findUserbyPk(userId) {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      return user;
    }
  } catch (e) {
    return false;
  }
}
export async function updateProfile(user: { id; newName; newPassword }) {
  try {
    const foundUser = await findUserbyPk(user.id);
    if (foundUser) {
      if (user.newName) {
        foundUser.set({ fullName: user.newName });
      }
      if (user.newPassword) {
        const auth = await Auth.findOne({
          where: { userId: foundUser.get("id") },
        });
        await auth.update({ password: stringToHash(user.newPassword) });
      }
      await foundUser.save();
      return "updated";
    } else {
      return "user not found";
    }
  } catch (e) {
    console.log(e);
    return e;
  }
}
export async function reportLostPet(data: {
  userId;
  nombre;
  picture;
  lat;
  lng;
  location;
}) {
  const foundUser = await findUserbyPk(data.userId);
  if (foundUser) {
    //si encuentra usuario, chequeo que no se repita el nombre del pet
    const petFound = await Pet.findOne({
      where: {
        userId: data.userId,
        nombre: data.nombre,
      },
    });
    if (petFound) {
      return "Pet already created";
    } else {
      const image = await cloudinary.uploader.upload(data.picture, {
        tags: "basic_sample",
      });
      const newPet = await foundUser.createPet({
        nombre: data.nombre,
        lat: data.lat,
        lng: data.lng,
        picture: image.url,
        location: data.location,
      });
      const algoliaRes = await petAlgoliaIndex
        .saveObject({
          objectID: newPet.get("id"),
          userId: newPet.get("userId"),
          nombre: newPet.get("nombre"),
          _geoloc: {
            lat: newPet.get("lat"),
            lng: newPet.get("lng"),
          },
        })
        .wait();
      return "Pet created";
    }
  }
  return "user not found, error";
}
export async function sendNotification({
  petId,
  reporterName,
  reporterPhone,
  reporterDesc,
}) {
  const data = await Pet.findOne({
    where: {
      id: petId,
    },
    include: [User],
  });
  const email = data.user.email;
  const userFullName = data.user.fullName;
  const msg = {
    to: email, // Change to your recipient
    from: "matias.parodi@outlook.com", // Change to your verified sender
    subject: "Tu mascota ha sido reportada!",
    text: ``,
    html: `   Hola ${userFullName} <br>
    Tu mascota ${data.nombre} ha sido encontrada por: <br>
    Nombre: ${reporterName}.<br>
    Numero: ${reporterPhone}<br>
    Mensaje: ${reporterDesc}<br>
    Contactalo lo mas rápido posible<br>
    <strong>El equipo de Pet Finder App</strong>`,
  };

  sendMail(msg);
}
