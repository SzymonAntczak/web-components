(() => {
  const style = /* html */ `
    <style>
      :host {
        position: fixed;
        bottom: 0;
        right: 0;
        padding: 1rem;
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
        overflow: hidden;
      }

      :host([opened]) {
        opacity: 1;
        pointer-events: auto;
      }

      #container div {
        background: darkred;
        color: white;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border-radius: 0.25rem;
        transform: translateX(100%);
        transition: transform 0.2s ease-in-out;
      }

      #container div.visible {
        transform: translateX(0);
      }
    </style>
  `;

  class Notifications extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });

      this.shadowRoot.innerHTML = /* html */ `
        ${style}

        <div id="container"></div>
      `;
    }

    render(message) {
      if (!this.hasAttribute("opened")) {
        this.setAttribute("opened", "");
      }

      const notification = document.createElement("div");
      notification.innerHTML = `<span>${message}</span>`;

      const container = this.shadowRoot.querySelector("#container");

      container.appendChild(notification);

      setTimeout(() => {
        notification.classList.add("visible");
      }, 50);

      setTimeout(() => {
        notification.remove();

        if (container.children.length === 0) {
          this.removeAttribute("opened");
        }
      }, 3000);
    }
  }

  customElements.define("app-notifications", Notifications);
})();
