// Content is readable without JavaScript; these controls enhance the architecture.
const architecture = document.querySelector("[data-architecture]");
const tabs = [...architecture.querySelectorAll("[data-stage]")];
const panels = tabs.map((tab) => document.getElementById(tab.dataset.stage));
const pipeline = architecture.querySelector(".pipeline");

pipeline.setAttribute("role", "tablist");
pipeline.setAttribute("aria-orientation", "vertical");
architecture.classList.add("is-enhanced");

function selectStage(index, focus = false) {
  tabs.forEach((tab, i) => {
    const selected = i === index;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    panels[i].hidden = !selected;
  });
  if (focus) tabs[index].focus();
}

tabs.forEach((tab, index) => {
  tab.id = "tab-" + tab.dataset.stage;
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-controls", panels[index].id);
  panels[index].setAttribute("role", "tabpanel");
  panels[index].setAttribute("aria-labelledby", tab.id);

  tab.addEventListener("click", (event) => {
    event.preventDefault();
    selectStage(index);
    history.replaceState(null, "", tab.getAttribute("href"));
  });

  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowDown") next = (index + 1) % tabs.length;
    if (event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (event.key === " ") next = index;
    if (next === undefined) return;
    event.preventDefault();
    selectStage(next, true);
    history.replaceState(null, "", tabs[next].getAttribute("href"));
  });
});

function revealHash() {
  let id;
  try {
    id = decodeURIComponent(location.hash.slice(1));
  } catch {
    return;
  }
  const stageIndex = panels.findIndex((panel) => panel.id === id);
  if (stageIndex !== -1) selectStage(stageIndex);
  const target = document.getElementById(id);
  const details = target?.closest("details");
  if (details) details.open = true;
}

selectStage(3);
revealHash();
window.addEventListener("hashchange", revealHash);

document.querySelectorAll("[data-open-details]").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById(link.dataset.openDetails).open = true;
  });
});

const navLinks = [...document.querySelectorAll(".site-nav a")];
const sectionObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    navLinks.forEach((link) => {
      if (link.hash === "#" + entry.target.id) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }
}, { rootMargin: "-10% 0px -65% 0px" });

navLinks.forEach((link) => sectionObserver.observe(document.querySelector(link.hash)));
sectionObserver.observe(document.getElementById("home"));
