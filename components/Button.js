(() => {
  const style = /* html */ `
    <style>
      button {
        border-radius: 8px;
        border: 1px solid transparent;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: #1a1a1a;
        cursor: pointer;
        transition: border-color 0.25s;
      }

      button:hover {
        border-color: #646cff;
      }

      button:focus,
      button:focus-visible {
        outline: 4px auto -webkit-focus-ring-color;
      }
    </style>
  `;

  class Button extends HTMLElement {
    #isLoading = false;

    static get observedAttributes() {
      return ["loading"];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });

      this.shadowRoot.innerHTML = /* html */ `
        ${style}

        <button>
          <slot></slot>
        </button>
      `;
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "loading" && oldValue !== newValue) {
        this.#isLoading = newValue === "true";
        this.#render();
      }
    }

    #render() {
      const button = this.shadowRoot.querySelector("button");

      button.disabled = this.#isLoading;
      button.innerHTML = this.#isLoading
        ? "<span>Loading...</span>"
        : "<slot></slot>";
    }
  }

  customElements.define("app-button", Button);
})();
