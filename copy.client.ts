const copyBtns = document.querySelectorAll("button[data-copy]");

copyBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    let textToCopy = btn.getAttribute("data-copy") as string;
    // CLEAN COMMANDS:  Remove leading spaces, $, and > from each line
    textToCopy = textToCopy.replace(/^[\$>\s]+/, "");
    navigator?.clipboard?.writeText(textToCopy);
  });
});
