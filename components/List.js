(() => {
  const style = /* html */ `
    <style>
      section {
        padding: 1rem;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }

      ul li {
        margin: 0.5rem 0;
      }

      app-button {
        margin: 0 auto;
        display: block;
        width: fit-content;
      }
    </style>
  `;

  class List extends HTMLElement {
    #isLoading = true;
    #data = [];
    #page = 0;

    constructor() {
      super();
      this.attachShadow({ mode: "open" });

      this.shadowRoot.innerHTML = /* html */ `
        ${style}

        <section></section>
        <app-button loading=${this.#isLoading}>Load more</button>
      `;

      this.#fetchData();

      this.shadowRoot
        .querySelector("app-button")
        .addEventListener("click", () => {
          this.#fetchData();
        });
    }

    #render() {
      this.shadowRoot
        .querySelector("app-button")
        .setAttribute("loading", `${this.#isLoading}`);

      if (this.#data.length <= 0) return;

      const existingList = this.shadowRoot.querySelector("ul");

      if (!existingList) {
        const list = document.createElement("ul");

        this.#data.forEach((item) => {
          const li = document.createElement("li");
          li.innerHTML = item.name;
          list.appendChild(li);
        });

        this.shadowRoot.querySelector("section").appendChild(list);
        return;
      }

      const existingListLength = existingList.children.length;

      for (let i = existingListLength; i < this.#data.length; i++) {
        const li = document.createElement("li");
        li.innerHTML = this.#data[i].name;
        existingList.appendChild(li);
      }
    }

    async #fetchData() {
      this.#page++;
      this.#isLoading = true;
      this.#render();

      try {
        const response = await fetch(
          this.#page <= 3
            ? `https://swapi.dev/api/people?page=${this.#page}`
            : `https://swapi.dev/api/peopl?page=${this.#page}`
        );

        if (!response.ok) throw new Error();

        const data = await response.json();

        this.#data.push(...data.results);
        this.#isLoading = false;
        this.#render();
      } catch (e) {
        this.#isLoading = false;
        this.#page--;

        const errorEvent = new CustomEvent("fetchingError", {
          detail: { message: "Error while fetching data" },
        });

        document.dispatchEvent(errorEvent);

        this.#render();
      }
    }
  }

  customElements.define("app-list", List);
})();
