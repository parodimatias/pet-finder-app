import { state } from "../state";
import { Router } from "@vaadin/router";
customElements.define(
  "password-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      state.removeListeners();
      this.render();
    }
    render() {
      this.className = "password-page";
      this.innerHTML = /*html*/ `
      <custom-header></custom-header>
      <div class="container">
      <form class="form" id="form-password">
      <label for="password">password</label>
      <input name="password" type="password">
      <button type="submit" id="password-save-button">Siguiente</button>
      </form></div>
      <style>
        .password-form{
          display:flex;
          flex-direction:column;
        }
      </style>
  `;
      const passwordSaveButton = document.getElementById("form-password");
      passwordSaveButton.addEventListener("submit", (e: any) => {
        e.preventDefault();
        const cs = state.getState();
        cs.password = e.target.password.value;
        state.setState(cs);
        state.getAuthToken().then((res) => {
          if (res) {
            //log exitoso
            console.log("LA", cs.lastAddress);
            if (cs.lastAddress)
              //a donde quiso ir el usuario
              console.log("hola");
            Router.go(cs.lastAddress);
          } else {
            //si no a home page
            Router.go("/");
          }
        });
      });
    }
  }
);
