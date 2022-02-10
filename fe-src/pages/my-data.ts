import { Router } from "@vaadin/router";
import { state } from "../state";
import Dropzone from "dropzone";
import { initMap, initSearchForm } from "../lib/mapbox";
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
      <form action="" class="form">
      <label for="name"
        >Mi Nombre      </label>
        <input type="text" name="name" id="name"></label>
      <label for="password"
        >Contraseña      </label>
        <input type="password" name="password" id="password"></label>
      <label for="passwordRep"
        >Repetir contraseña     </label>
        <input type="password" name="passwordRep" id="passwordRep"></label>

      <button type="submit" class="save-button">Guardar</button></div>

    </form>
    </div>
      <style>

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
      const cs = state.getState();
      const form = this.querySelector(".form") as any;
      if (cs.logged) {
        form.name.value = cs.fullName;
        form.password.value = cs.password;
        form.passwordRep.value = cs.password;
      }
      form.addEventListener("submit", (e: any) => {
        e.preventDefault();
        cs.fullName = e.target.name.value;
        if (e.target.password.value == e.target.passwordRep.value) {
          cs.password = e.target.password.value;
          state.setState(cs);
          if (!cs.logged) {
            auth();
          } else {
            updateData();
          }
        } else {
          alert("Las contraseña no son iguales");
        }
      });
    }
  }
);

function auth() {
  const cs = state.getState();
  state.auth().then((res) => {
    if (res) {
      state.getAuthToken().then((res) => {
        if (res) {
          console.log("Logged");
          //log exitoso
          if (cs.lastAddress)
            //a donde quiso ir el usuario
            Router.go(cs.lastAddress);
        } else {
          //si no a home page
          Router.go("/");
        }
      });
    }
  });
}
function updateData() {
  const cs = state.getState();
  state.profileUpdate().then((res) => {
    if (res) {
      state.getAuthToken().then((res) => {
        if (res) {
          console.log("Logged");
          //log exitoso
          if (cs.lastAddress)
            //a donde quiso ir el usuario
            console.log("Going to LA");
          Router.go(cs.lastAddress);
        } else {
          //si no a home page
          console.log("Going Home Page");
          Router.go("/");
        }
      });
    }
  });
}
