import { Router } from "@vaadin/router";
import { state } from "../state";
import Dropzone from "dropzone";
import { initMap, initSearchForm } from "../lib/mapbox";
import { any } from "sequelize/types/lib/operators";

customElements.define(
  "edit-pet",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      state.removeListeners();
      this.render();
    }

    render() {
      this.className = "result-page";
      this.innerHTML = /*html*/ `
      <custom-header></custom-header>
      <div class="container">
      <h1 class="title-text">Editar mascota perdida</h1>
      <form action="" class="form dropzone">
      <label for="name"
        >Nombre      </label>
      <input type="text" name="name" id="name">
      <div class="picture-container">Arrastra o clickea para subir foto></div>
      <div id="map" style="width: 100%; height: 200px"> </div>
      <label  for="search-form-container">Busca localizacion y arrastra el marcador
      <div class="search-form-container" name="search-form-container"><input class="q"name="q" type="search" />
      <button class="search-button">Buscar</button></div></label>
      <button class="report-pet">Guardar</button>
      <button class="found">Report como encontrado</button>
      <button class="unlink caption-text">Desvincular</button>
    </form>
    </div>
      <style>
        @import url("//api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css");

        .picture-container{
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          height:200px;
          border: 1px black dashed;
        }
        .picture{
          border: dashed 2px grey;
          height:auto;
        }
        .search-form-container{
          display:flex;
          flex-direction:row;
          justify-content:space-between;
        }
        .unlink{
          background: none;
          color:red;
          border:none;
          text-decoration: underline;
        }

      </style>
  `;
      const cs = state.getState();
      const petName = <HTMLInputElement>document.querySelector("#name");
      petName.value = cs.reportPetName;
      // dropzone //
      const myDropzone = new Dropzone(".picture-container", {
        url: "/falsa",
        autoProcessQueue: false,
        // addRemoveLinks: true,
        thumbnailWidth: 200,
        thumbnailHeight: 150,
        // previewsContainer: ".picture",
        clickable: true,
      });
      cs.reportPetPicture = "";
      myDropzone.on("thumbnail", function (file) {
        // usando este evento pueden acceder al dataURL directamente
        cs.reportPetPicture = file.dataURL;
      });
      //////
      // mapa //
      const map = document.querySelector("#map");
      const initializeddMap = initMap(map);
      const searchButton = document.querySelector(".search-button");
      const searchTextEl = <HTMLInputElement>document.querySelector(".q");
      searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        const searchText = searchTextEl.value;
        cs.reportPetLocation = searchText;
        state.setState(cs);
        const a = initSearchForm(initializeddMap, searchText);
      });
      //////
      const foundButton = document.querySelector(".found");
      foundButton.addEventListener("click", (e) => {
        e.preventDefault();
        state.foundPet().then((res) => {
          console.log(res);
          cs.editPetId = "";
          state.setState(cs);
          Router.go("/my-reportedpets");
        });
      });
      const unlinkButton = document.querySelector(".unlink");
      unlinkButton.addEventListener("click", (e) => {
        e.preventDefault();
        state.unlinkPet().then((res) => {
          console.log(res);
          cs.editPetId = "";
          state.setState(cs);
          Router.go("/my-reportedpets");
        });
      });
      const saveButton = document.querySelector(".report-pet");
      saveButton.addEventListener("click", (e) => {
        e.preventDefault();
        cs.reportPetName = petName.value;
        state.setState(cs);
        state.updateLostPet().then((res) => {
          if (res) {
            console.log("La respuesta es", res);
            Router.go("./my-reportedpets");
          }
        });
      });
    }
  }
);

// function checkForm() {
//   const cs = state.getState();
//   if (!cs.reportPetName) {
//     alert("Ingresar nombre de mascota");
//   } else {
//     if (!cs.reportPetLat && !cs.reportPetLng) {
//       alert("Ingresar ultimo lugar");
//     } else {
//       if (!cs.reportPetPicture) {
//         alert("Ingresar imagen");
//       } else {
//         return true;
//       }
//     }
//   }
// }
