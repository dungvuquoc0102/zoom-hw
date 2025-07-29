import "./my-modal.js";

const openModalBtns = document.querySelectorAll(".open-modal");

openModalBtns.forEach((btn) => {
  const modalName = btn.id;
  const modal = document.querySelector(`my-modal#${modalName}`);
  const cancelBtns = modal.querySelectorAll(".close-modal");

  modal.addEventListener("modal:open", () => {
    Toastify({
      text: "Modal đã được mở",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  });

  modal.addEventListener("modal:close", () => {
    Toastify({
      text: "Modal đã được đóng",
      style: {
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      },
    }).showToast();
  });

  btn.onclick = () => {
    modal.show();
  };

  cancelBtns.forEach((btn) => {
    btn.onclick = () => {
      modal.hidden();
    };
  });
});
