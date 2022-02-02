import { Router } from "@vaadin/router";
import { state } from "../state";
import Dropzone from "dropzone";
import { initMap, initSearchForm } from "../../lib/mapbox";
import { any } from "sequelize/types/lib/operators";

customElements.define(
  "my-data",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      state.removeListeners();
      this.render();
    }

    render() {
      this.className = "my-data";
      this.innerHTML = /*html*/ `
      <custom-header></custom-header>
      <div class="container">
      <form action="" class="form dropzone">
      <label for="name"
        >Mi Nombre      </label>
        <input type="text" name="name" id="name"></label>
      <label for="password"
        >Contraseña      </label>
        <input type="password" name="password" id="password"></label>
      <label for="passwordRep"
        >Repetir contraseña     </label>
        <input type="password" name="passwordRep" id="passwordRep"></label>

      <button class="save-button">Guardar</button></div>

    </form>
    </div>
      <style>
        @import url("//api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css");

        .picture-container{
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          height:200px;
          border:solid 1px red;
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
    }
  }
);
