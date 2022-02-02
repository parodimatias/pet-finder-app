import { Router } from "@vaadin/router";
import { state } from "../state";
import { img } from "./img/test";
customElements.define(
  "home-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      state.removeListeners();
      this.render();
      state.subscribe(() => {
        this.render();
      });
    }

    render() {
      const cs = state.getState();
      this.className = "home-page";

      this.innerHTML = /*html*/ `
      <custom-header></custom-header>    <div class="container">
      <h1 class="title-text">Mascotas perdidas cerca tuyo</h1>
      <p class="caption">Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.</p>
      <button class="give-location-button">Dar mi ubicación</button>
      <div class="pets-container"></div>
   </div>
   <style>
</style>
  `;
      const giveLocationButton = <HTMLElement>(
        document.querySelector(".give-location-button")
      );
      const caption = <HTMLElement>document.querySelector(".caption");
      if (cs.lat && cs.lng) {
        giveLocationButton.style.display = "none";
        caption.style.display = "none";
        lostPetsRender(document.querySelector(".pets-container"));
      }
      if (!cs.lat && !cs.lng) {
        giveLocationButton.addEventListener("click", (e) => {
          e.preventDefault();
          const location = navigator.geolocation.getCurrentPosition(
            success,
            error
          );
        });
      }
    }
  }
);
function success(position) {
  const cs = state.getState();
  cs.lat = position.coords.latitude;
  cs.lng = position.coords.longitude;
  state.setState(cs);
}
function error() {
  alert("Unable to retrieve your location");
}
function lostPetsRender(container) {
  state.getNearLostPets();
  const template = <HTMLTemplateElement>(
    document.querySelector("#template-item")
  );
  const petImageContainer = template.content.querySelector(
    ".pet__img-container"
  );
  const petImage: any = document.createElement("img");
  petImage.src = img;
  petImage.style.objectFit = "scale-down";
  petImageContainer.appendChild(petImage);
  petImage.style.width = "100%";
  const petName = template.content.querySelector(".pet__description-name");
  const petLocation = template.content.querySelector(
    ".pet__description-location"
  );
  const petLink = template.content.querySelector(".pet__link");

  petName.textContent = "Pepeeeeeee";
  petLocation.textContent = "CIPOLLETTI";
  const clone = document.importNode(template.content, true);
  container.appendChild(clone);
}
