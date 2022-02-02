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
      this.className = "result-page";
      this.innerHTML = /*html*/ `
      <custom-header></custom-header>
  `;
    }
  }
);
