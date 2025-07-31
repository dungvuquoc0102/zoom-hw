export class MyFolderTree extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.treeData = [];
  }

  connectedCallback() {
    this.render();
  }

  setTreeData(data) {
    this.treeData = data;
    this.renderTree();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ul { list-style: none; margin: 0; padding: 0; }
        .item.selected, .parent.selected { background-color: #0277d4; color: #fff; }
        .highlight-border { background-color: #ccc !important; }
      </style>
      <ul class="root list"></ul>
    `;
  }

  renderTree() {
    const rootUl = this.shadowRoot.querySelector(".root");
    rootUl.innerHTML = "";
    this.renderNodeList(this.treeData, rootUl, 1);
  }

  renderNodeList(nodeList, parentNode, level) {
    nodeList.forEach((node) => this.renderNode(node, parentNode, level));
  }

  renderNode(node, parentNode, level) {
    let li;
    if (node.type === "file") {
      li = this.createItem(node.name, level);
    } else {
      li = document.createElement("li");
      const div = this.createParent(node.name, level);
      const arrow = this.createArrow(level);
      this.createLeftBorders(level, div);
      div.appendChild(arrow);

      const ul = document.createElement("ul");
      ul.classList.add("list");
      li.appendChild(div);
      li.appendChild(ul);

      this.renderNodeList(node.children || [], ul, level + 1);
    }
    parentNode.appendChild(li);
  }

  createItem(name, level) {
    const li = document.createElement("li");
    li.classList.add("item");
    li.textContent = name;
    li.style.paddingLeft = `${level * 30}px`;
    li.addEventListener("contextmenu", (e) =>
      this.dispatchContextMenu(e, li, "file")
    );
    return li;
  }

  createParent(name, level) {
    const div = document.createElement("div");
    div.classList.add("parent");
    div.textContent = name;
    div.style.paddingLeft = `${level * 30}px`;
    div.addEventListener("contextmenu", (e) =>
      this.dispatchContextMenu(e, div, "folder")
    );
    return div;
  }

  createArrow(level) {
    const i = document.createElement("i");
    i.classList.add("fa-solid", "fa-angle-right");
    i.style.left = `${level * 30 - 17}px`;
    return i;
  }

  createLeftBorders(level, el) {
    for (let i = 1; i < level; i++) {
      const border = document.createElement("div");
      border.style.cssText = `
        position: absolute;
        top: 0;
        height: 100%;
        width: 1px;
        left: ${i * 30 - 15}px;
        background-color: #404040;
      `;
      el.appendChild(border);
    }
  }

  dispatchContextMenu(e, targetEl, type) {
    e.preventDefault();
    const event = new CustomEvent("show-context-menu", {
      detail: { x: e.clientX, y: e.clientY, type, element: targetEl },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

customElements.define("my-folder-tree", MyFolderTree);
