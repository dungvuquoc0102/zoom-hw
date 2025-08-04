import "./my-modal.js";

const openModalBtns = document.querySelectorAll(".open-modal");

openModalBtns.forEach((btn) => {
  const modalName = btn.id;
  const modal = document.querySelector(`my-modal#${modalName}`);
  const cancelBtns = modal.querySelectorAll(".close-modal");

  btn.onclick = modal.open.bind(modal);

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

  cancelBtns.forEach((cancelBtn) => {
    cancelBtn.onclick = modal.close.bind(modal);
  });
});
