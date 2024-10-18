const toggleDarkMode = () => {
  // const markdownBlocks = document.querySelectorAll(".markdown-body");
  const colorThemes = document.querySelectorAll("[data-color-mode]");
  if (localStorage.theme === "light") {
    localStorage.theme = "dark";
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    colorThemes.forEach((el) => {
      el.setAttribute("data-color-mode", "dark");
    });
    // markdownBlocks.forEach((block) => {
    //   // block.setAttribute("data-color-mode","dark");
    // });
  } else {
    localStorage.theme = "light";
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
    colorThemes.forEach((el) => {
      el.setAttribute("data-color-mode", "light");
    });
    // markdownBlocks.forEach((block) => {
    //   // block.setAttribute("data-color-mode","light");
    // });
  }
};

const darkModeToggleButtons = document.querySelectorAll(
  ".dark-mode-toggle.button"
);

darkModeToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    toggleDarkMode();
  });
});

// window.onload = () => {
//   const markdownBlocks = document.querySelectorAll("div.markdown-body");

//   markdownBlocks.forEach((element) => {
//     // element.setAttribute("data-color-mode", localStorage.theme);
//     const colorThemes = document.querySelectorAll("[data-color-mode]");
//     colorThemes.forEach((el) => {
//       el.setAttribute("data-color-mode", localStorage.theme);
//     });
//   });
// };

// for (
//   const darkModeToggles of document.querySelectorAll(
//     ".dark-mode-toggle",
//   )
// ) {
//   const buttons = darkModeToggles.querySelectorAll(
//     ".dark-mode-toggle button",
//   );
//   for (const button of buttons) {
//     button.addEventListener("click", () => {
//       console.log("click");
//       localStorage.theme = "light";
//       document.documentElement.classList.remove("dark");
//     });
//   }
// }
