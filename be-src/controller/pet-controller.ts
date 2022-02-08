import { petAlgoliaIndex } from "../lib/algolia";
import { Pet, User, Auth } from "../models/models";
import { cloudinary } from "../lib/cloudinary";
export async function deletePet(petId) {
  const response = await Pet.destroy({
    where: {
      id: petId.petId,
    },
  });
  return response;
}
export async function foundPet({ id, found }) {
  const response = await Pet.update(
    { found },
    {
      where: {
        id,
      },
    }
  );
  return response;
}
export async function getPets(userId) {
  const pets = await Pet.findAll({
    where: userId,
  });
  return pets;
}
export async function getAllPets() {
  const data = await Pet.findAll();
  return data;
}
export async function updateLostPet({
  id,
  location,
  picture,
  nombre,
  lat,
  lng,
}) {
  const response = await Pet.update(
    { location, picture, nombre, lat, lng },
    {
      where: {
        id,
      },
    }
  );
  const algoliaRes = await petAlgoliaIndex
    .saveObject({
      objectID: id,
      nombre: nombre,
      _geoloc: {
        lat: lat,
        lng: lng,
      },
    })
    .wait();
  console.log(algoliaRes);
  return response;
}
