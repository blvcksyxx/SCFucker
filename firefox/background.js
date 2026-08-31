const DEFAULT_PROXY = "socks5://127.0.0.1:9050";

// Firefox uses browser.proxy.onRequest — fires for every request
// we intercept only api-v2.soundcloud.com and return proxy info

function parseProxyUrl(url) {
  try {
    const parsed = new URL(url);
    const type = parsed.protocol.replace(":", "");
    const host = parsed.hostname;
    const port = parseInt(parsed.port) || (type.startsWith("socks") ? 1080 : 8080);
    // Firefox proxy type: "socks" covers socks5 when proxyDNS=true
    const ffType = (type === "socks5" || type === "socks") ? "socks" : "http";
    return { type: ffType, host, port, proxyDNS: true };
  } catch {
    return null;
  }
}

let currentEnabled = true;
let currentProxyUrl = DEFAULT_PROXY;

// Load settings on startup
browser.storage.sync.get({ enabled: true, proxyUrl: DEFAULT_PROXY }).then((s) => {
  currentEnabled = s.enabled;
  currentProxyUrl = s.proxyUrl;
});

// Intercept requests to SoundCloud API only
browser.proxy.onRequest.addListener(
  (requestInfo) => {
    if (!currentEnabled) return { type: "direct" };

    const url = new URL(requestInfo.url);
    if (
      url.hostname === "api-v2.soundcloud.com" ||
      url.hostname === "api.soundcloud.com"
    ) {
      const proxy = parseProxyUrl(currentProxyUrl);
      if (proxy) return proxy;
    }

    return { type: "direct" };
  },
  { urls: ["*://api-v2.soundcloud.com/*", "*://api.soundcloud.com/*"] }
);

// Listen for settings changes
browser.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SETTINGS_CHANGED") {
    browser.storage.sync.get({ enabled: true, proxyUrl: DEFAULT_PROXY }).then((s) => {
      currentEnabled = s.enabled;
      currentProxyUrl = s.proxyUrl;
      console.log("[SCFucker] Settings updated →", s.enabled ? s.proxyUrl : "direct");
    });
  }
});
