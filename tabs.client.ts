const tabGroups = document.querySelectorAll("deno-tabs");

for (const tabGroup of tabGroups) {
  const newGroup = document.createElement("div");
  newGroup.classList.add("deno-tabs");
  newGroup.dataset.id = tabGroup.getAttribute("group-id")!;

  const buttons = document.createElement("ul");
  buttons.classList.add("deno-tabs-buttons");
  newGroup.appendChild(buttons);

  const tabs = document.createElement("div");
  tabs.classList.add("deno-tabs-content");
  newGroup.appendChild(tabs);

  for (const tab of tabGroup.children) {
    if (tab.tagName === "DENO-TAB") {
      const selected = tab.getAttribute("default") !== null;
      const buttonContainer = document.createElement("li");
      buttons.appendChild(buttonContainer);

      const button = document.createElement("button");
      button.textContent = tab.getAttribute("label")!;
      button.dataset.tab = tab.getAttribute("value")!;
      button.dataset.active = String(selected);
      buttonContainer.appendChild(button);

      const content = document.createElement("div");
      content.innerHTML = tab.innerHTML;
      content.dataset.tab = tab.getAttribute("value")!;
      content.dataset.active = String(selected);
      tabs.appendChild(content);
    }
  }
  tabGroup.replaceWith(newGroup);
}

class GroupSelectEvent extends Event {
  groupId: string;
  tabId: string;

  constructor(groupId: string, tabId: string) {
    super("deno-tab-select");
    this.groupId = groupId;
    this.tabId = tabId;
  }
}

for (const tabGroup of document.querySelectorAll<HTMLElement>(".deno-tabs")) {
  const buttons = tabGroup.querySelectorAll<HTMLElement>(
    ".deno-tabs-buttons button",
  )!;
  const tabs = tabGroup.querySelectorAll<HTMLElement>(
    ".deno-tabs-content div",
  )!;

  const groupId = tabGroup.dataset.id!;
  document.addEventListener("deno-tab-select", (event: Event) => {
    if (!(event instanceof GroupSelectEvent)) return;
    if (event.groupId !== groupId) return;
    for (const button of buttons) {
      const active = button.dataset.tab === event.tabId;
      button.dataset.active = String(active);
    }
    for (const tab of tabs) {
      const active = tab.dataset.tab === event.tabId;
      tab.dataset.active = String(active);
    }
  });

  for (const button of buttons) {
    button.addEventListener("click", () => {
      const tabId = button.dataset.tab!;
      localStorage.setItem(`deno-tab-${groupId}`, tabId);
      document.dispatchEvent(new GroupSelectEvent(groupId, tabId));
    });
  }

  const storedTabId = localStorage.getItem(`deno-tab-${groupId}`);
  if (storedTabId) {
    document.dispatchEvent(new GroupSelectEvent(groupId, storedTabId));
  }

  const anyTabActive = Array.from(tabs).some((tab) =>
    tab.dataset.active === "true"
  );

  if (!anyTabActive && tabs.length > 0) {
    const firstTabId = tabs[0].dataset.tab!;
    document.dispatchEvent(new GroupSelectEvent(groupId, firstTabId));
  }
}
