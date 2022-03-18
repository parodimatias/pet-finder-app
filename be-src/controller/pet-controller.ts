import { petAlgoliaIndex } from "../lib/algolia";
import { cloudinary } from "../lib/cloudinary";
import { Pet } from "../models/models";

const petController = {
  async deletePet(petId) {
    const response = await Pet.destroy({
      where: {
        id: petId.petId,
      },
    });
    await petAlgoliaIndex.deleteObject(petId.petId);
    return response;
  },
  async foundPet({ id, found }) {
    const response = await Pet.update(
      { found },
      {
        where: {
          id,
        },
      }
    );
    return response;
  },
  async getPets(userId) {
    const pets = await Pet.findAll({
      where: userId,
    });
    return pets;
  },
  async getAllPets() {
    const data = await Pet.findAll();
    return data;
  },
  async updateLostPet({ id, location, picture, nombre, lat, lng }) {
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
  },
  async foundClosePets({ lat, lng }) {
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
  },
  bodyToIndex(body) {
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
    console.log("body es", respuesta);
    return respuesta;
  },
};
export default petController;
