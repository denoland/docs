document.addEventListener("DOMContentLoaded", () => {
  const tutorial = document.getElementById("tutorial")! as HTMLInputElement;
  const example = document.getElementById("example")! as HTMLInputElement;
  const video = document.getElementById("video")! as HTMLInputElement;
  const listItems = document.getElementsByClassName("learning-list-item");

  const filterItems = () => {
    const shown = [tutorial, example, video].filter((item) => item.checked);
    const shownType = shown.map((item) => item.id);

    for (const item of listItems) {
      const htmlItem = item as HTMLElement;
      const category = htmlItem.getAttribute("data-category");
      const enabled = shownType.includes(category!);
      htmlItem.style.display = enabled ? "" : "none";
    }
  };

  tutorial.addEventListener("change", () => filterItems());
  example.addEventListener("change", () => filterItems());
  video.addEventListener("change", () => filterItems());

  filterItems();
});
