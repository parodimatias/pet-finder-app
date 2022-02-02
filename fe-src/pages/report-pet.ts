import { Router } from "@vaadin/router";
import { state } from "../state";
import Dropzone from "dropzone";
import { initMap, initSearchForm } from "../../lib/mapbox";
import { any } from "sequelize/types/lib/operators";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWF0aWFzcGFyb2RpIiwiYSI6ImNreTh6NnNlcDAxZXQycWs5c2VndTQxemYifQ.g5ici0kzf8C_pEntf30JYA";
customElements.define(
  "report-pet",
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
      <h1 class="title-text">Reportar nueva mascota</h1>
      <form action="" class="form dropzone">
      <label for="name"
        >Nombre      </label>
      <input type="text" name="name" id="name">
      <button  type="button" class="picture-container">
      <p class="picture-button">Arrastra o clickea para subir foto</p></button>
      <div id="map" style="width: 100%; height: 200px"> </div>
      <label  for="search-form-container">Busca localizacion y arrastra el marcador
      <div class="search-form-container" name="search-form-container"><input class="q"name="q" type="search" />
      <button class="search-button">Buscar</button></div></label>
      <button class="report-pet">Reportar como perdido</button>
      <button class="cancel">Cancelar</button>
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

      </style>
  `;
      const cs = state.getState();
      // dropzone //
      const myDropzone = new Dropzone(".picture-container", {
        url: "/falsa",
        autoProcessQueue: false,
        // addRemoveLinks: true,
        thumbnailWidth: 200,
        // previewsContainer: ".picture",
        clickable: true,
      });
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
        const a = initSearchForm(initializeddMap, searchText);
      });
      //////
      const cancelButton = document.querySelector(".cancel");
      cancelButton.addEventListener("click", (e) => {
        e.preventDefault();
        Router.go("/");
      });
      const reportButton = document.querySelector(".report-pet");
      reportButton.addEventListener("click", (e) => {
        e.preventDefault();
        const petName = <HTMLInputElement>document.querySelector("#name");
        cs.reportPetName = petName.value;
        state.setState(cs);
        const formOk = checkForm();
        if (formOk) {
          state.reportLostPet();
        }
      });
    }
  }
);

function checkForm() {
  const cs = state.getState();
  if (!cs.reportPetName) {
    alert("Ingresar nombre de mascota");
  } else {
    if (!cs.reportPetLat && !cs.reportPetLng) {
      alert("Ingresar ultimo lugar");
    } else {
      if (!cs.reportPetPicture) {
        alert("Ingresar imagen");
      } else {
        return true;
      }
    }
  }
}
