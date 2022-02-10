import { petAlgoliaIndex } from "../lib/algolia";
import { Pet, User, Auth } from "../models/models";
import { cloudinary } from "../lib/cloudinary";
export async function deletePet(petId) {
  const response = await Pet.destroy({
    where: {
      id: petId.petId,
    },
  });
  await petAlgoliaIndex.deleteObject(petId.petId);
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
  if (picture) {
    const image = await cloudinary.uploader.upload(picture, {
      tags: "basic_sample",
    });
    const response = await Pet.update(
      { picture: image.url },
      {
        where: {
          id,
        },
      }
    );
  }
  const response = await Pet.update(
    { location, nombre, lat, lng },
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
  return response;
}
export async function foundClosePets({ lat, lng }) {
  const algoliaSearch = await petAlgoliaIndex.search("", {
    aroundLatLng: [lat, lng].join(","),
    aroundRadius: 10000,
  });
  const hitIds = algoliaSearch.hits.map((hit) => {
    return hit.objectID;
  });
  const foundPets = await Pet.findAll({
    where: {
      id: hitIds,
    },
  });
  return foundPets;
}
