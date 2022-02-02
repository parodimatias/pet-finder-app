import { Router } from "@vaadin/router";
import { state } from "../../state";
export function headerComponent() {
  customElements.define(
    "custom-header",
    class extends HTMLElement {
      constructor() {
        super();
        this.render();
      }

      render() {
        const shadow = this.attachShadow({ mode: "open" });
        const div = document.createElement("div");
        div.className = "header-container";
        const style = document.createElement("style");
        const logoImg = require("url:./logo.png");
        const menuImg = require("url:./menu.png");
        const cs = state.getState();
        let email = "";
        let logging = "";
        if (cs.logged) {
          email = cs.email;
          logging = "Cerrar sesion";
        } else {
          email = "No logueado";
          logging = "Iniciar sesion";
        }
        div.innerHTML = `
        <div class="logo">
        <img src=${logoImg} alt="not found"></div>
        <div class="menu-button">
        <img src=${menuImg} alt="not found"></div>
        </div>
        <div class="menu">
        <div class="option-container">
        <div class="my-data subtitle-text-bold">Mis datos</div>
        <div class="my-reported-pets subtitle-text-bold">Mis mascotas reportadas</div>
        <div class="report-pet subtitle-text-bold">Reportar mascota</div>
        </div>
        <div class="log-option-container">
        <div class="my-email body-text-bold">${email}</div>
        <button class="logging">${logging}</button></div>
        </div>
        
`;

        style.textContent = `
        .header-container{
          box-sizing:border-box;
          background:pink;
          height:60px;
          display: flex;
          flex-direction:row;
          justify-content:space-between;
          padding-left:30px;
          padding-right:30px;
           }
        img {
          width: 100%; /* or any custom size */
          height: 100%; 
          object-fit: contain;
          }        
        .menu-button{
          width:45px
          }
        .logo{
          width:45px;
           }
        .menu{
          box-sizing:border-box;
          display:none;
          padding: 50px;
          text-align:center;
          align-content:center;
          flex-direction:column;
          justify-content:space-between;
          position:fixed;
          left:0px;
          top:0;
          background-color:#8AF1FF;
          width:100%;
          height:600px
        }
        .option-container{
          display:flex;
          flex-direction:column;
          justify-content: space-between;
          height:200px;
        }
        }
.title-text {
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 40px;
}
.subtitle-text {
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 24px;
}
.subtitle-text-bold {
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 24px;
}
.body-text {
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 16px;
}
.body-text-bold {
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 16px;
}`;
        shadow.appendChild(div);
        shadow.appendChild(style);
        const menu = <HTMLElement>shadow.querySelector(".menu");
        const menuButton = shadow.querySelector(".menu-button");
        const myDataButton = shadow.querySelector(".my-data");
        const myReportedPetsButton = shadow.querySelector(".my-reported-pets");
        const reportPetButton = shadow.querySelector(".report-pet");
        const loggingButton = shadow.querySelector(".logging");
        myDataButton.addEventListener("click", (e) => {
          e.preventDefault();
          menu.style.display = "none";
          state.go("/my-data");
        });
        myReportedPetsButton.addEventListener("click", (e) => {
          e.preventDefault();
          menu.style.display = "none";
          state.go("/my-reported-pets");
        });
        reportPetButton.addEventListener("click", (e) => {
          e.preventDefault();
          menu.style.display = "none";
          Router.go("/report-pet");
        });
        loggingButton.addEventListener("click", (e) => {
          e.preventDefault();
          menu.style.display = "none";
          if (cs.logged) {
            state.closeSession();
            Router.go("/");
          } else {
            Router.go("/email-page");
          }
        });
        menuButton.addEventListener("click", () => {
          menu.style.display = "flex";
        });
      }
    }
  );
}
