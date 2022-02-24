import "dotenv/config";
import * as cors from "cors";
import * as express from "express";
import {
  checkEmailExist,
  userCreate,
  getToken,
  verifyToken,
  findUserbyPk,
  updateProfile,
  reportLostPet,
  sendNotification,
} from "./controller/user-controller";
import {
  getPets,
  getAllPets,
  deletePet,
  foundPet,
  updateLostPet,
  foundClosePets,
} from "./controller/pet-controller";
const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/email", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  try {
    if (await checkEmailExist(email)) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (e) {
    res.error(e);
  }
});
app.post("/auth", async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    const response = await userCreate({ email, fullName, password });
    res.json(response);
  } catch (e) {
    res.status(400).send("Error");
  }
});
app.post("/auth/token", async (req, res) => {
  const { email, password } = req.body;
  const token = await getToken({ email, password });
  if (token) {
    res.json(token);
  } else {
    res.status(400).json("wrong email or password");
  }
});

app.get("/me", verifyToken, async (req, res) => {
  const user = await findUserbyPk(req._user_id.id);
  res.json(user);
});
app.post("/profileupdate", async (req, res) => {
  try {
    const { fullName, password, id } = req.body;
    const response = await updateProfile({
      id: id,
      newName: fullName,
      newPassword: password,
    });
    if (response == "updated") {
      res.json(response);
    } else if (response == "user not found") {
      res.status(404).send("User not found");
    }
  } catch {
    res.status(400).send("error");
  }
});
app.post("/report-lost-pet", async (req, res) => {
  try {
    const newLostPet = await reportLostPet(req.body);
    res.json(newLostPet);
  } catch (err) {
    console.log(err);
  }
});
function bodyToIndex(body) {
  const respuesta: any = {};
  if (body.nombre) {
    respuesta.nombre = body.nombre;
  }
  if (body.picture) {
    respuesta.picture = body.picture;
  }

  if (body.lat && body.lng) {
    respuesta.lat = body.lat;
    respuesta.lng = body.lng;
  }

  if (body.id) {
    respuesta.id = body.id;
  }
  if (body.location) {
    respuesta.location = body.location;
  }
  return respuesta;
}

// app.get("/comercios", async (req, res) => {
//   const comercio = await Comercio.findAll();
//   res.json(comercio);
// });
app.get("/pets/:userId", async (req, res) => {
  const pets = await getPets(req.params);
  res.json(pets);
});
app.delete("/pet/:petId", async (req, res) => {
  const response = await deletePet(req.params);
  res.json(response);
});
app.patch("/pet", async (req, res) => {
  const response = await foundPet(req.body);
  res.json(response);
});
app.put("/pet", async (req, res) => {
  const response = await updateLostPet(bodyToIndex(req.body));
  res.json(response);
});

app.get("/pets/", async (req, res) => {
  const coordinates = req.query;
  const response = await foundClosePets(coordinates);
  res.json(response);
});

app.post("/sendnotification", async (req, res) => {
  const response = await sendNotification(req.body);
  res.json(response);
});
const path = require("path");
app.get("*", express.static(path.join(__dirname, "/../fe-dist")));
