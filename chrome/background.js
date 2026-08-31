const DEFAULT_PROXY = "socks5://127.0.0.1:9050";

async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      { enabled: true, proxyUrl: DEFAULT_PROXY },
      resolve
    );
  });
}

function parseProxyUrl(url) {
  try {
    const parsed = new URL(url);
    const scheme = parsed.protocol.replace(":", "");
    const host = parsed.hostname;
    const port = parseInt(parsed.port) || (scheme === "socks5" ? 1080 : 8080);
    return { scheme, host, port };
  } catch {
    return null;
  }
}

function buildPacScript(proxyUrl) {
  const p = parseProxyUrl(proxyUrl);
  if (!p) return null;

  // Map scheme to PAC format
  let pacProxy;
  if (p.scheme === "socks5" || p.scheme === "socks") {
    pacProxy = `SOCKS5 ${p.host}:${p.port}`;
  } else if (p.scheme === "http" || p.scheme === "https") {
    pacProxy = `PROXY ${p.host}:${p.port}`;
  } else {
    pacProxy = `SOCKS5 ${p.host}:${p.port}`;
  }

  // Only route SoundCloud API through proxy — CDN and page go direct
  return `
    function FindProxyForURL(url, host) {
      if (
        shExpMatch(host, "api-v2.soundcloud.com") ||
        shExpMatch(host, "api.soundcloud.com")
      ) {
        return "${pacProxy}";
      }
      return "DIRECT";
    }
  `;
}

async function applyProxy() {
  const { enabled, proxyUrl } = await getSettings();

  if (!enabled) {
    chrome.proxy.settings.clear({ scope: "regular" });
    return;
  }

  const pacData = buildPacScript(proxyUrl);
  if (!pacData) {
    console.error("[SCFucker] Invalid proxy URL:", proxyUrl);
    return;
  }

  chrome.proxy.settings.set(
    {
      value: {
        mode: "pac_script",
        pacScript: { data: pacData },
      },
      scope: "regular",
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error("[SCFucker] Proxy error:", chrome.runtime.lastError);
      } else {
        console.log("[SCFucker] Proxy applied →", proxyUrl);
      }
    }
  );
}

// Apply on startup
applyProxy();

// Listen for settings changes from popup/options
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SETTINGS_CHANGED") {
    applyProxy();
  }
});
