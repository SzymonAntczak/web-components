(() => {
  const style = `
    <style>
      #loader {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        background-color: rgba(0, 0, 0, 0.3);
        pointer-events: none;
      }

      #loader span {
        text-align: center;
      }
    </style>
  `;

  class Loader extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });

      this.shadowRoot.innerHTML = `
        ${style}

        <div id="loader">
          <span>Loading...</span>
        </div>
      `;
    }
  }

  customElements.define("app-loader", Loader);
})();
