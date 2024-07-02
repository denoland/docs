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
}
