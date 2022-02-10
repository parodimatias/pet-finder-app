import { state } from "../state";
customElements.define(
  "test-pet",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const cs = state.getState();
      this.innerHTML = /*html*/ `<button class="button"></button>
      <report-form class="asd">AAA</report-form>
  `;
      const reportForm = <HTMLElement>this.querySelector(".asd");
      const button = this.querySelector(".button");
      button.addEventListener("click", (e) => {
        e.preventDefault;
        reportForm.setAttribute("petname", "pepe");
      });
      reportForm.addEventListener("report", (e: any) => {
        console.log(e);
      });
    }
  }
);
