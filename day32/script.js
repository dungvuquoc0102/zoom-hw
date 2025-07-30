const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const dragbar = $(".dragbar");
const sidebar = $(".sidebar");
const content = $(".content");

let isDragging = false;

// Thêm sự kiện mouseover
dragbar.addEventListener("mouseover", () => {
  if (!isDragging) {
    dragbar.classList.add("hover");
    dragbar.style.cursor = "col-resize";
  }
});

// Thêm sự kiện mouseout
dragbar.addEventListener("mouseleave", () => {
  if (!isDragging) {
    dragbar.classList.remove("hover");
    dragbar.style.cursor = "default";
  }
});

// Bắt đầu kéo
dragbar.addEventListener("mousedown", (e) => {
  isDragging = true;
  document.body.style.cursor = "col-resize"; // Đặt con trỏ trên toàn bộ document
  dragbar.classList.add("hover");
  e.preventDefault(); // Ngăn hành vi mặc định
});

// Kết thúc kéo
document.addEventListener("mouseup", () => {
  isDragging = false;
  dragbar.classList.remove("hover");
  document.body.style.cursor = "default"; // Khôi phục con trỏ
  dragbar.style.cursor = "col-resize"; // Đặt lại con trỏ cho dragbar
});

// Dragging
document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  dragbar.style.left = e.clientX + "px";
  sidebar.style.width = e.clientX + "px";
  content.style.width = `calc(100% - ${e.clientX + 1}px`;
  document.body.classList.remove("dragging"); // Xóa lớp dragging
});

const tree = [
  {
    type: "folder",
    name: "src",
    children: [
      {
        type: "folder",
        name: "components",
        children: [
          { type: "file", name: "Header.js" },
          { type: "file", name: "Footer.js" },
        ],
      },
      { type: "file", name: "index.js" },
      {
        type: "folder",
        name: "utils",
        children: [{ type: "file", name: "helpers.js" }],
      },
      {
        type: "folder",
        name: "views",
        children: [
          {
            type: "folder",
            name: "admin",
            children: [{ type: "file", name: "index.html" }],
          },
        ],
      },
    ],
  },
  {
    type: "folder",
    name: "public",
    children: [{ type: "file", name: "index.html" }],
  },
  { type: "file", name: "package.json" },
  { type: "file", name: "README.md" },
  { name: "taptin_goc.txt", type: "file" },
];
const rootUl = $(".root");

const icons = {
  ".js": { name: ["fa-brands", "fa-square-js"], color: "#f4bf75" },
  node_modules: { name: ["fa-brands", "fa-node-js"], color: "#90a959" },
  ".css": { name: ["fa-brands", "fa-css3"], color: "#6a9fb5" },
  ".html": { name: ["fa-brands", "fa-html5"], color: "#d28445" },
  ".gitignore": { name: ["fa-brands", "fa-git-alt"], color: "#ac4142" },
  "other/text": { name: ["fa-solid", "fa-file-lines"], color: "#cccccc" },
};

const getIconFromName = (name) => {
  switch (true) {
    case name.includes(".js"):
      return icons[".js"];
    case name.includes(".css"):
      return icons[".css"];
    case name.includes(".html"):
      return icons[".html"];
    case name.includes(".gitignore"):
      return icons[".gitignore"];
    case name.includes("node_modules"):
      return icons["node_modules"];
    default:
      return icons["other/text"];
  }
};

const highlightLastBordersOfDirectChildren = (
  parentUl,
  deep = 0,
  level = 0
) => {
  // Reset tất cả border cũ
  if (deep === 0) {
    $$(".highlight-border").forEach((el) =>
      el.classList.remove("highlight-border")
    );
  }

  const liChildren = Array.from(parentUl.children);

  liChildren.forEach((li) => {
    if (li.classList.contains("item")) {
      if (deep === 0) {
        level = parseInt(li.style.paddingLeft || 0) / 30 - 1;
      }
      const borders = li.querySelectorAll("div");
      borders.forEach((border) => {
        const left = parseInt(border.style.left) || 0;
        if (left === level * 30 - 15) {
          border.classList.add("highlight-border");
        }
      });
    } else {
      const parentDiv = li.querySelector(".parent");
      if (deep === 0) {
        level = parseInt(parentDiv.style.paddingLeft || 0) / 30 - 1;
      }
      const borders = parentDiv.querySelectorAll("div");
      borders.forEach((border) => {
        const left = parseInt(border.style.left) || 0;
        if (left === level * 30 - 15) {
          border.classList.add("highlight-border");
        }
      });
      highlightLastBordersOfDirectChildren(
        li.querySelector(".list"),
        (deep = deep + 1),
        level
      );
    }
  });
};

const createItem = (name, level) => {
  const li = document.createElement("li");
  li.classList.add("item");
  const icon = getIconFromName(name);
  const iconName = icon.name;
  const iconColor = icon.color;

  createLeftBorders(level, li);

  const i = document.createElement("i");
  i.classList.add(...iconName);
  i.style.cssText = `
    margin-right: 10px;
    color: ${iconColor};
  `;

  const span = document.createElement("span");
  span.textContent = name;

  li.appendChild(i);
  li.appendChild(span);
  li.style.paddingLeft = `${level * 30}px`;

  li.addEventListener("click", (e) => {
    const allParentAndItem = $$(".parent, .item");
    allParentAndItem.forEach((i) => i.classList.remove("selected"));
    li.classList.add("selected");

    const parentLi = li.closest("ul")?.closest("li");
    if (parentLi) {
      const directUl = parentLi.querySelector(":scope > ul.list");
      if (directUl) {
        highlightLastBordersOfDirectChildren(directUl);
      }
    }
  });

  return li;
};

const createParent = (name, level) => {
  const div = document.createElement("div");
  div.classList.add("parent");

  const i = document.createElement("i");
  i.classList.add("fa-solid", "fa-folder");
  i.style.cssText = `
    margin-right: 10px;
    color: #cccccc;
  `;

  const span = document.createElement("span");
  span.textContent = name;

  div.appendChild(i);
  div.appendChild(span);
  div.style.paddingLeft = `${level * 30}px`;

  div.addEventListener("click", (e) => {
    e.stopPropagation();
    const allParentAndItem = $$(".parent, .item");
    allParentAndItem.forEach((i) => i.classList.remove("selected"));
    div.classList.add("selected");

    const li = div.closest("li");
    const ul = li.querySelector(":scope > ul.list");

    const isExpanded = div.classList.toggle("expanded");

    if (!isExpanded || !ul || ul.children.length === 0) {
      // Nếu đang đóng → xử lý như file
      const parentLi = div.closest("ul")?.closest("li");
      if (parentLi) {
        const directUl = parentLi.querySelector(":scope > ul.list");
        if (directUl) {
          highlightLastBordersOfDirectChildren(directUl);
        }
      }
    } else {
      // Đang mở → highlight các con trực tiếp trong folder này
      highlightLastBordersOfDirectChildren(ul);
    }
  });

  return div;
};

const createArrow = (level) => {
  const i = document.createElement("i");
  i.classList.add("fa-solid", "fa-angle-right");
  i.style.cssText = `
      position: absolute;
      top: 5px;
      left: ${level * 30 - 17}px;
    `;
  return i;
};

const createLeftBorder = (level) => {
  const div = document.createElement("div");
  div.style.cssText = `
    position: absolute;
    top: 0;
    height: 100%;
    width: 1px;
    left: ${level * 30 - 15}px;
    background-color: #404040;
  `;
  return div;
};

const createLeftBorders = (level, parentNode) => {
  if (level > 1) {
    new Array(level - 1).fill("_").forEach((_, index) => {
      const border = createLeftBorder(index + 1);
      parentNode.appendChild(border);
    });
  }
};

const createLevelOneLightLeftBorder = (level, parentNode) => {
  if (level > 1) {
    new Array(level - 1).fill("_").forEach((_, index) => {
      const border = createLeftBorder(index + 1);
      parentNode.appendChild(border);
    });
  } else {
    const border = createLeftBorder(index + 1);
    parentNode.appendChild(border);
  }
};

const renderNode = (node, parentNode, level) => {
  let li;
  if (node.type === "file") {
    // File
    li = createItem(node.name, level);
  } else {
    // Folder
    li = document.createElement("li");

    const div = createParent(node.name, level);

    const i = createArrow(level);

    // Create border
    createLeftBorders(level, div);

    div.appendChild(i);
    const ul = document.createElement("ul");
    ul.classList.add("list");
    li.appendChild(div);
    li.appendChild(ul);
    renderNodeList(node.children, ul, level + 1);
  }
  parentNode.appendChild(li);
};
const renderNodeList = (nodeList, parentNode = rootUl, level = 1) => {
  nodeList.forEach((node) => {
    renderNode(node, parentNode, level);
  });
};

renderNodeList(tree);
