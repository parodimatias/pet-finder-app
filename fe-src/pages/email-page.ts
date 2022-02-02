import { state } from "../state";
import { Router } from "@vaadin/router";
customElements.define(
  "email-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      state.removeListeners();
      this.render();
    }
    render() {
      this.className = "email-page";
      this.innerHTML = /*html*/ `
      <custom-header></custom-header>
      <div class="container">
      <form class="form" id="form">
      <label for="email">email</label>
      <input name="email" type="email">
      <button type="submit" id="email-save-button">Siguiente</button>
      </form>
      </div>
      <style>
        .email-form{
          display:flex;
          flex-direction:column;
        }
      </style>
  `;
      const emailSaveButton = document.getElementById("form");
      emailSaveButton.addEventListener("submit", (e: any) => {
        e.preventDefault();
        const cs = state.getState();
        cs.email = e.target.email.value;
        state.setState(cs);
        state.checkEmail().then((res) => {
          if (res) {
            Router.go("password-page");
          } else {
            Router.go("my-data-page");
          }
        });
      });
    }
  }
);
