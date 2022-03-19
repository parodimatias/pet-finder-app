import * as cors from "cors";
import "dotenv/config";
import * as express from "express";
import petController from "./controller/pet-controller";
import userController from "./controller/user-controller";
const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.use(cors({ origin: "https://pet-finder-app-882b7.web.app/" }));
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/email", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  try {
    if (await userController.checkEmailExist(email)) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (e) {
    res.status(500).send("Something broke!");
  }
});
app.post("/auth", async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    const response = await userController.userCreate({
      email,
      fullName,
      password,
    });
    res.json(response);
  } catch (e) {
    res.status(400).send("Error");
  }
});
app.post("/auth/token", async (req, res) => {
  const { email, password } = req.body;
  const token = await userController.getToken({ email, password });
  if (token) {
    res.json(token);
  } else {
    res.status(400).json("wrong email or password");
  }
});
app.get("/me", userController.verifyToken, async (req, res) => {
  const user = await userController.findUserbyPk(req._user_id.id);
  res.json(user);
});
app.post("/profileupdate", async (req, res) => {
  try {
    const { fullName, password, id } = req.body;
    const response = await userController.updateProfile({
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
    const newLostPet = await userController.reportLostPet(req.body);
    res.json(newLostPet);
  } catch (err) {
    console.log(err);
  }
});
app.get("/pets/:userId", async (req, res) => {
  const pets = await petController.getPets(req.params);
  res.json(pets);
});
app.delete("/pet/:petId", async (req, res) => {
  const response = await petController.deletePet(req.params);
  res.json(response);
});
app.patch("/pet", async (req, res) => {
  const response = await petController.foundPet(req.body);
  res.json(response);
});
app.put("/pet", async (req, res) => {
  console.log("body ess", req.body);
  const response = await petController.updateLostPet(
    petController.bodyToIndex(req.body)
  );
  res.json(response);
});

app.get("/pets/", async (req, res) => {
  const coordinates = req.query;
  const response = await petController.foundClosePets(coordinates);
  res.json(response);
});

app.post("/sendnotification", async (req, res) => {
  const response = await userController.sendNotification(req.body);
  res.json(response);
});
const path = require("path");
app.get("*", express.static(path.join(__dirname, "/../fe-dist")));
