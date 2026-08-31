const enabledToggle = document.getElementById("enabledToggle");
const proxyInput = document.getElementById("proxyInput");
const saveBtn = document.getElementById("saveBtn");
const toast = document.getElementById("toast");
const routeApi = document.getElementById("routeApi");

browser.storage.sync.get({ enabled: true, proxyUrl: "socks5://127.0.0.1:9050" }).then((s) => {
  enabledToggle.checked = s.enabled;
  proxyInput.value = s.proxyUrl;
  updateRouteLabel(s.enabled);
});

enabledToggle.addEventListener("change", () => {
  updateRouteLabel(enabledToggle.checked);
});

function updateRouteLabel(enabled) {
  routeApi.textContent = enabled ? "→ proxy" : "→ direct (bypass off)";
  routeApi.style.color = enabled ? "#efefef" : "#555";
}

document.querySelectorAll(".preset").forEach((btn) => {
  btn.addEventListener("click", () => {
    proxyInput.value = btn.dataset.proxy;
  });
});

saveBtn.addEventListener("click", () => {
  const proxyUrl = proxyInput.value.trim() || "socks5://127.0.0.1:9050";
  const enabled = enabledToggle.checked;

  browser.storage.sync.set({ enabled, proxyUrl }).then(() => {
    browser.runtime.sendMessage({ type: "SETTINGS_CHANGED" });
    showToast("Settings saved");
    updateRouteLabel(enabled);
  });
});

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}
