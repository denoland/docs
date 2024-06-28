function findParent(el, find) {
  do {
    if (find(el)) {
      return el;
    }
  } while (el = el.parentElement);
}

document.addEventListener("click", (e) => {
  const target = findParent(
    e.target,
    (el) => el instanceof HTMLButtonElement && el.dataset["copy"],
  );
  if (target) {
    navigator?.clipboard?.writeText(target.dataset["copy"]);
  }
});
