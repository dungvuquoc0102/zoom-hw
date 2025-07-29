const ModalStack = [];

class MyModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.innerShadowRoot();
    this.setListeners();
  }

  createTemplate() {
    const template = document.createElement("template");

    template.innerHTML = `
      <style>
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .wrapper {
          position: fixed;
          inset: 0;
          background: #000000b5;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
          visibility: hidden;
          opacity: 0;
          z-index: ${this.id.split("-")[1]}
        }

        .modal {
          border-radius: 0.25rem;
          background: #fff;
          padding: 15px;
          transition: all 0.3s ease;
          transform: scale(0.5);
        }

        .cancel {
          border: none;
          padding: 15px;
          color: #fff;
          border-radius: 0.25rem;
          cursor: pointer;
          background: #dc3545;
        }
          
        .show {
          visibility: visible;
          opacity: 1
        }
        
        .show > .modal {
          transform: scale(1);
        }
      </style>
      <div class="wrapper">
        <span class="modal">
          <slot name="header">Title</slot>
          <slot>Content of modal</slot>
          <slot name="footer">
            <button class="submit">Submit</button>
            <button class="cancel">Cancel</button>
          </slot>
        </span>
      </div>
    `;

    return template.content;
  }

  innerShadowRoot() {
    const template = this.createTemplate();
    this.shadowRoot.appendChild(template);
  }

  getElementFromShadow(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  show() {
    this.removeAttribute("hidden");
    if (!document.body.contains(this)) {
      document.body.appendChild(this);
    }
    const wrapper = this.getElementFromShadow(".wrapper");
    requestAnimationFrame(() => {
      wrapper.classList.add("show");
    });

    this.dispatchEvent(new CustomEvent("modal:open"));

    // Đẩy modal vào stack
    ModalStack.push(this);
  }

  hidden() {
    const wrapper = this.getElementFromShadow(".wrapper");
    wrapper.classList.remove("show");
    setTimeout(() => {
      this.remove();
    }, 300);
    this.dispatchEvent(new CustomEvent("modal:close"));

    // Xoá chính nó ra khỏi stack nếu còn trong đó
    const index = ModalStack.lastIndexOf(this);
    if (index !== -1) {
      ModalStack.splice(index, 1);
    }
  }

  setListeners() {
    console.log("He");
    const wrapper = this.getElementFromShadow(".wrapper");
    wrapper.addEventListener("click", (e) => {
      if (!e.target.closest(".modal")) {
        this.hidden();
      }
    });
  }
}

customElements.define("my-modal", MyModal);

// Chỉ cần gán 1 lần duy nhất
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && ModalStack.length > 0) {
    const topModal = ModalStack.pop();
    topModal.hidden();
  }
});
