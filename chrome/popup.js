const toggle = document.getElementById("toggle");
const statusDot = document.getElementById("statusDot");
const statusTitle = document.getElementById("statusTitle");
const statusDesc = document.getElementById("statusDesc");
const proxyDisplay = document.getElementById("proxyDisplay");
const openSettings = document.getElementById("openSettings");

function updateUI(enabled, proxyUrl) {
  toggle.checked = enabled;

  if (enabled) {
    statusDot.className = "status-dot active";
    statusTitle.textContent = "Active";
    statusDesc.textContent = "SoundCloud API → proxy";
  } else {
    statusDot.className = "status-dot inactive";
    statusTitle.textContent = "Disabled";
    statusDesc.textContent = "Tracks will be geo-restricted";
  }

  proxyDisplay.textContent = proxyUrl || "socks5://127.0.0.1:9050";
}

// Load settings
chrome.storage.sync.get({ enabled: true, proxyUrl: "socks5://127.0.0.1:9050" }, (s) => {
  updateUI(s.enabled, s.proxyUrl);
});

// Toggle
toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  chrome.storage.sync.get({ proxyUrl: "socks5://127.0.0.1:9050" }, (s) => {
    chrome.storage.sync.set({ enabled }, () => {
      chrome.runtime.sendMessage({ type: "SETTINGS_CHANGED" });
      updateUI(enabled, s.proxyUrl);
    });
  });
});

// Open options
openSettings.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});
