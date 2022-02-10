import { Router } from "@vaadin/router";
import { state } from "../../state";
export function reportFormComponent() {
  customElements.define(
    "report-form",
    class extends HTMLElement {
      static get observedAttributes() {
        return ["petname"];
      }
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        const div = document.createElement("div");
        const style = document.createElement("style");
        shadow.appendChild(div);
        shadow.appendChild(style);
      }
      connectedCallback() {
        this.render(this);
      }
      attributeChangedCallback() {
        this.render(this);
      }
      render(elem) {
        const logoImg = require("url:./X.png");
        const petName = this.getAttribute("petname");
        const shadow = elem.shadowRoot;
        const div = shadow.querySelector("div");
        const style = shadow.querySelector("style");
        div.className = "report-component";
        const cs = state.getState();
        div.innerHTML = `
        <img class="close" src=${logoImg}>
        <h1>Reportar info de ${petName}</h1>
        <form class="report-pet-form">
        <label class="caption" for="name"
        >Tu nombre     </label>
         <input class="input-text" type="text" name="name" id="name" required>
  
         <label class="caption" for="phone"
        >Tu telefono     </label>
         <input class="input-text" type="text" name="phone" id="phone" required>


         <label class="caption" for="desc"
        >¿Donde lo viste?     </label>
         <input class="input-textarea" type="textarea" name="desc" id="desc" required>

      <button type="submit" class="report-pet">Enviar</button>
      </form>
        
`;

        style.textContent = `
        *{
          box-sizing:border-box;
        }
      .report-component{
        position:relative;
        background:white;
        height: 603px;
        width:300px;
        border:solid 1px;
        padding:18px;
      }
      .report-pet-form{
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        height:415px;
      }
      .caption {
        font-family: "Poppins", sans-serif;
        font-weight: 500;
        font-size: 16px;
        text-transform: uppercase;
      }
      .input-text{
        height:50px;
      }
      .input-textarea{
        height:127px;
      }
      .report-pet{
        background:#FF9DF5;
        height:50px;
        border-radius:4px;
        border:none;
        font-family: "Poppins";
        font-size:16px;
        font-weight:700;
      }
      .close{
        position:absolute;
        right:20px;
      }
      `;

        const closeButton = shadow.querySelector(".close");
        closeButton.addEventListener("click", (e) => {
          e.preventDefault();
          this.style.display = "none";
        });
        const form = shadow.querySelector(".report-pet-form");
        form.addEventListener("submit", (e: any) => {
          e.preventDefault();
          const reporterName = e.target.name.value;
          const reporterPhone = e.target.phone.value;
          const reporterDesc = e.target.desc.value;
          this.dispatchEvent(
            new CustomEvent("report", {
              detail: {
                reporterName,
                reporterPhone,
                reporterDesc,
              },
              bubbles: true,
              // esto hace que el evento pueda
              // ser escuchado desde un elemento
              // que está más "arriba" en el arbol
            })
          );
        });
      }
    }
  );
}
