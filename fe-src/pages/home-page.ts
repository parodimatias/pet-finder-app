import { state } from "../state";
customElements.define(
  "home-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      state.removeListeners();
      this.render();
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
   <div class="report-form-container">
   <report-form class="report-pet-form"></report-form></div>
   <style>
   .report-pet-form{
     display:none;
     position:absolute;
     top:50px;
     left:33%;
   }
</style>
  `;
      const giveLocationButton = <HTMLElement>(
        document.querySelector(".give-location-button")
      );
      const caption = <HTMLElement>document.querySelector(".caption");
      if (cs.lat && cs.lng) {
        giveLocationButton.style.display = "none";
        caption.style.display = "none";
        state.getNearLostPets().then((res) => {
          lostPetsRender(document.querySelector(".pets-container"), res);
        });
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
  const giveLocationButton = <HTMLElement>(
    document.querySelector(".give-location-button")
  );
  const caption = <HTMLElement>document.querySelector(".caption");
  if (cs.lat && cs.lng) {
    giveLocationButton.style.display = "none";
    caption.style.display = "none";
    state.getNearLostPets().then((res) => {
      lostPetsRender(document.querySelector(".pets-container"), res);
    });
  }
}
function error() {
  alert("Unable to retrieve your location");
}

function lostPetsRender(container, pets) {
  const cs = state.getState();
  const template = <HTMLTemplateElement>(
    document.querySelector("#template-lost-pets")
  );
  const petImage: any = template.content.querySelector(".pet__img");
  const petImageContainer = template.content.querySelector(
    ".pet__img-container"
  );
  petImage.style.objectFit = "fill";
  petImageContainer.appendChild(petImage);
  petImage.style.width = "100%";
  petImage.style.maxHeight = "100%";
  const petName = <HTMLElement>(
    template.content.querySelector(".pet__description-name")
  );
  const reportForm = <HTMLElement>document.querySelector(".report-pet-form");
  reportForm.addEventListener("report", (ee: any) => {
    ee.preventDefault();
    Object.assign(cs.reporter, ee.detail);
    state.setState(cs);
    state
      .sendNotification()
      .then((res) => {
        return res;
      })
      .then((response) => {
        alert("Notification sent");
        reportForm.style.display = "none";
      });
  });
  for (const pet of pets) {
    petImage.src = pet.picture;
    const petLocation = template.content.querySelector(
      ".pet__description-location"
    );
    const petLink = template.content.querySelector(".pet__link");
    petLink.id = pet.id;
    petLocation.textContent = pet.location;
    petName.textContent = pet.nombre;
    const clone = document.importNode(template.content, true);
    container.appendChild(clone);
    const reportButton = document.getElementById(pet.id);
    reportButton.setAttribute("petname", pet.nombre);
    reportButton.addEventListener("click", (e) => {
      e.preventDefault();
      cs.reporter.petId = reportButton.getAttribute("id");
      reportForm.setAttribute("petname", reportButton.getAttribute("petname"));
      reportForm.style.display = "block";
      state.setState(cs);
    });
  }
}
