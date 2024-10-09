const copyBtns = document.querySelectorAll("button[data-copy]");

copyBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    navigator?.clipboard?.writeText(btn.getAttribute("data-copy") as string);
  });
});
