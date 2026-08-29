const storageKey = "daylight-checkins";
let selectedMood = { label: "Steady", score: 3 };

const $ = (selector) => document.querySelector(selector);
const date = new Date();
$("#dateLabel").textContent = date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

function updateRange(input, output, suffix) { $(output).textContent = `${input.value}${suffix}`; }
$("#sleep").addEventListener("input", (e) => updateRange(e.target, "#sleepValue", " hrs"));
$("#energy").addEventListener("input", (e) => updateRange(e.target, "#energyValue", " / 10"));

document.querySelectorAll(".mood-option").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".mood-option").forEach((item) => item.classList.remove("selected"));
  button.classList.add("selected");
  selectedMood = { label: button.dataset.mood, score: Number(button.dataset.score) };
}));

function readEntries() { try { return JSON.parse(localStorage.getItem(storageKey)) || []; } catch { return []; } }
function renderHistory() {
  const entries = readEntries();
  $("#historyEmpty").hidden = entries.length > 0;
  const list = $("#historyList");
  list.innerHTML = entries.slice(0, 7).map((entry) => `<div class="history-row"><span class="history-date">${new Date(entry.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span><span><span class="history-mood">${entry.mood}</span>${entry.notes ? ` · ${escapeHtml(entry.notes)}` : ""}</span><span class="history-meta">${entry.sleep}h sleep · ${entry.energy}/10 energy</span></div>`).join("");
}
function escapeHtml(value) { const el = document.createElement("div"); el.textContent = value; return el.innerHTML; }

$("#checkinForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const entries = readEntries();
  entries.unshift({ date: new Date().toISOString(), mood: selectedMood.label, score: selectedMood.score, sleep: $("#sleep").value, energy: $("#energy").value, notes: $("#notes").value.trim() });
  localStorage.setItem(storageKey, JSON.stringify(entries));
  $("#saveMessage").textContent = "Saved privately on this device.";
  $("#notes").value = "";
  renderHistory();
});

$("#clearHistory").addEventListener("click", () => { if (confirm("Remove all saved check-ins from this browser?")) { localStorage.removeItem(storageKey); renderHistory(); } });
$("#privacyButton").addEventListener("click", () => $("#privacyDialog").showModal());
$(".dialog-close").addEventListener("click", () => $("#privacyDialog").close());
renderHistory();
