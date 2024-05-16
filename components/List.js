(() => {
  const style = `
    <style>
      section {
        position: relative;
        padding: 1rem;
      }

      #container {
        margin-bottom: 1rem;
      }

      #loading {
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.8);
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      #error {
        color: red;
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

      button {
        display: block;
        margin: 1rem auto 0;
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

      this.shadowRoot.innerHTML = `
        ${style}

        <section></section>
      `;

      this.fetchData();
    }

    #render() {
      const section = this.shadowRoot.querySelector("section");
      const existingLoader = this.shadowRoot.querySelector("app-loader");
  
      if (this.#isLoading) {
        if (!existingLoader) {
          const loader = document.createElement("app-loader");
          section.appendChild(loader);
        }
      } else {
        if (existingLoader) {
          existingLoader.remove();
        }
      }

      if (this.#data.length <= 0) return; 
      
      const existingList = this.shadowRoot.querySelector("ul");

      if (!existingList) {
        const list = document.createElement("ul");

        this.#data.forEach((item) => {
          const li = document.createElement("li");
          li.innerHTML = item.name;
          list.appendChild(li);
        });

        section.appendChild(list);
        return;
      }

      const existingListLength = existingList.children.length;

      for (let i = existingListLength; i < this.#data.length; i++) {
        const li = document.createElement("li");
        li.innerHTML = this.#data[i].name;
        existingList.appendChild(li);
      }
    }

    async fetchData() {
      this.#page++;
      this.#isLoading = true;
      this.#render();

      try {
        const response = await fetch(
          this.#page <= 3
            ? `https://swapi.dev/api/people?page=${this.#page}`
            : `https://swapi.dev/api/peopl?page=${this.#page}`
        );

        if (!response.ok) throw new Error("Error while fetching data");

        const data = await response.json();
        this.#data = [...this.#data, ...data.results];
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
