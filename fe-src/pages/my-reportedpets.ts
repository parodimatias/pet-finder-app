import { Router } from "@vaadin/router";
import { state } from "../state";
customElements.define(
  "my-reportedpets",
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

    async render() {
      const cs = state.getState();
      this.className = "my-reportedpets";

      this.innerHTML = /*html*/ `
      <custom-header></custom-header>    <div class="container">
      <h1 class="title-text">Mis mascotas reportadas</h1>
      <p class="caption message">Aun no reportaste mascotas perdidas.</p>
      <div class="pets-container"></div>
   </div>
   <style>
</style>
  `;
      cs.myReportedPets = [];
      cs.myReportedPets = await state.getMyReportedPets();

      if (cs.myReportedPets.length > 0) {
        const text = <HTMLElement>document.querySelector(".message");
        text.style.display = "none";
        myPetsRender(
          document.querySelector(".pets-container"),
          cs.myReportedPets
        );
      }
    }
  }
);

function myPetsRender(container, pets) {
  const cs = state.getState();
  const template = <HTMLTemplateElement>(
    document.querySelector("#template-my-pets")
  );
  const petImage: any = template.content.querySelector(".pet__img");
  console.log(petImage);
  const petImageContainer = template.content.querySelector(
    ".pet__img-container"
  );

  petImage.style.objectFit = "fill";
  petImageContainer.appendChild(petImage);
  petImage.style.width = "100%";
  petImage.style.maxHeight = "100%";
  for (const pet of pets) {
    petImage.src = pet.picture;
    const petName = <HTMLElement>(
      template.content.querySelector(".pet__description-name")
    );
    const petLocation = template.content.querySelector(
      ".pet__description-location"
    );
    const petLink = template.content.querySelector(".pet__link");
    petLink.id = pet.id;
    if (pet.found) {
      petName.textContent = pet.nombre;
      petName.style.color = "green";
      petLocation.textContent = "ENCONTRADO";
    } else {
      petLocation.textContent = pet.location;
      petName.style.color = "red";
      petName.textContent = pet.nombre;
    }
    console.log(pet.location);
    const clone = document.importNode(template.content, true);
    container.appendChild(clone);
    const editButton = document.getElementById(pet.id);
    editButton.addEventListener("click", (e) => {
      e.preventDefault();
      cs.editPetId = pet.id;
      cs.reportPetPicture = pet.picture;
      cs.reportPetLocation = pet.location;
      cs.reportPetName = pet.nombre;
      cs.reportPetLat = pet.lat;
      cs.reportPetLng = pet.lng;
      state.setState(cs);
      Router.go("/edit-pet");
    });
  }
}
