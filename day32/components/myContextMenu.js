class MyContextMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        .menu {
          position: fixed;
          background: #fff;
          border: 1px solid #ddd;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          display: none;
          z-index: 1000;
        }
        .menu div {
          padding: 8px 16px;
          cursor: pointer;
        }
        .menu div:hover {
          background-color: #f0f0f0;
        }
      </style>
      <div class="menu" id="menu"></div>
    `;

    this.menu = this.shadowRoot.querySelector("#menu");
    document.addEventListener("click", () => this.hide());
    this.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("show-context-menu", (e) => this.show(e.detail));
  }

  show({ x, y, type, element }) {
    this.menu.innerHTML = "";
    const options = this.getOptions(type);
    options.forEach(({ label, action }) => {
      const div = document.createElement("div");
      div.textContent = label;
      div.addEventListener("click", () => this.handleAction(action, element));
      this.menu.appendChild(div);
    });
    this.menu.style.display = "block";
    this.menu.style.top = `${y}px`;
    this.menu.style.left = `${x}px`;
  }

  hide() {
    this.menu.style.display = "none";
  }

  getOptions(type) {
    if (type === "file") {
      return [
        { label: "Rename", action: "rename" },
        { label: "Delete", action: "delete" },
      ];
    }
    if (type === "folder") {
      return [
        { label: "New File", action: "new-file" },
        { label: "New Folder", action: "new-folder" },
        { label: "Rename", action: "rename" },
        { label: "Delete", action: "delete" },
      ];
    }
    return [];
  }

  handleAction(action, element) {
    switch (action) {
      case "rename":
        const oldName = element.textContent;
        const input = document.createElement("input");
        input.value = oldName;
        element.textContent = "";
        element.appendChild(input);
        input.focus();
        input.addEventListener("blur", () => {
          element.textContent = input.value || oldName;
        });
        break;
      case "delete":
        element.closest("li").remove();
        break;
      case "new-file":
      case "new-folder":
        const ul = element.closest("li")?.querySelector("ul.list");
        if (!ul) return;
        const li = document.createElement("li");
        const div = document.createElement("div");
        div.className = action === "new-file" ? "item" : "parent";
        div.textContent = action === "new-file" ? "newFile.js" : "newFolder";
        div.style.paddingLeft = element.style.paddingLeft;
        ul.appendChild(li);
        li.appendChild(div);
        break;
    }
    this.hide();
  }
}

customElements.define("my-context-menu", MyContextMenu);
