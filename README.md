# SCFucker

**Bypass SoundCloud geo-restrictions.** No VPN, no bullshit — just routes the SoundCloud API through a proxy so you get full tracks instead of 30-second previews.

Made by [blvcksyxx](https://blvcksyxx.xyz) · [github.com/blvcksyxx/SCFucker](https://github.com/blvcksyxx/SCFucker)

---

## How it works

SoundCloud embeds a geo-claim inside a short-lived `track_authorization` token, generated server-side from your IP. If your region is blocked, the token comes back with `policy: "SNIP"` — 30 seconds max. SCFucker routes only the API requests through a proxy, so the server sees a clean IP and issues `policy: "ALLOW"`. Audio CDN traffic goes direct — no slowdown.

```
api-v2.soundcloud.com  →  PROXY  →  SoundCloud (sees proxy IP → full track)
soundcloud.com (page)  →  DIRECT
CDN / audio segments   →  DIRECT
```

---

## Installation

### Linux (Kali, Ubuntu, Debian, etc.)

**Step 1 — Install Tor**
```bash
sudo apt update && sudo apt install tor -y
sudo systemctl start tor
sudo systemctl enable tor  # start on boot
```

Verify it works:
```bash
curl --socks5 127.0.0.1:9050 https://api.ipify.org
# Should return a foreign IP, not yours
```

**Step 2 — Firefox**

1. Download `SCFucker-Firefox.zip` from [Releases](https://github.com/blvcksyxx/SCFucker/releases) and unzip it
2. Open Firefox → go to `about:debugging` → click **This Firefox**
3. Click **Load Temporary Add-on** → open the unzipped folder → select `manifest.json`

**Step 2 — Chrome / Chromium**

1. Download `SCFucker-Chrome.zip` from [Releases](https://github.com/blvcksyxx/SCFucker/releases) and unzip it
2. Open Chrome → go to `chrome://extensions`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** → select the unzipped `SCFucker-Chrome` folder

---

### Windows

**Step 1 — Install Tor**

1. Download the **Tor Expert Bundle** from [torproject.org/download/tor](https://www.torproject.org/download/tor/) (no GUI, just the daemon)
2. Unzip it to `C:\tor\`
3. Open **PowerShell** or **Command Prompt** and run:
```
C:\tor\tor.exe
```
Leave this window open. Tor is ready when you see:
```
Bootstrapped 100% (done): Done
```

Or install it as a background service so it starts automatically:
```
C:\tor\tor.exe --service install
net start tor
```

Verify it works (in another terminal):
```powershell
curl --socks5 127.0.0.1:9050 https://api.ipify.org
```
Should return a foreign IP.

**Step 2 — Firefox**

1. Download `SCFucker-Firefox.zip` from [Releases](https://github.com/blvcksyxx/SCFucker/releases)
2. Right-click → **Extract All** → extract to e.g. `C:\SCFucker-Firefox\`
3. Open Firefox → go to `about:debugging` → click **This Firefox**
4. Click **Load Temporary Add-on** → navigate to `C:\SCFucker-Firefox\` → select `manifest.json`

**Step 2 — Chrome / Chromium**

1. Download `SCFucker-Chrome.zip` from [Releases](https://github.com/blvcksyxx/SCFucker/releases)
2. Right-click → **Extract All** → extract to e.g. `C:\SCFucker-Chrome\`
3. Open Chrome → go to `chrome://extensions`
4. Enable **Developer mode** (top right toggle)
5. Click **Load unpacked** → select the `C:\SCFucker-Chrome\` folder

---

## Permanent install

**Chrome / Chromium** — extensions loaded via **Load unpacked** are permanent. They survive browser restarts as long as you don't delete the folder. Chrome may show a *"Disable developer mode extensions"* banner on startup — just dismiss it.

**Firefox** — temporary add-ons unload when Firefox closes. To make it permanent:

- **Option A (recommended):** Use [Firefox Developer Edition](https://www.mozilla.org/firefox/developer/) or [Firefox Nightly](https://www.mozilla.org/firefox/nightly/). Go to `about:config` → set `xpinstall.signatures.required` to `false` → go to `about:addons` → gear icon → **Install Add-on From File** → select the `.zip`
- **Option B:** Submit the extension to [addons.mozilla.org](https://addons.mozilla.org) for free signing (takes a few hours), then install the signed `.xpi` normally

---

## Configuration

Click the SCFucker icon in the toolbar → **Configure** to open settings.

| Setting | Description |
|---------|-------------|
| Enable bypass | Toggle the proxy on/off without changing other settings |
| Proxy URL | Any `socks5://`, `socks4://`, or `http://` proxy |

**Quick presets available in settings:**

| Preset | URL |
|--------|-----|
| Tor (default) | `socks5://127.0.0.1:9050` |
| SOCKS5 | `socks5://127.0.0.1:1080` |
| HTTP proxy | `http://127.0.0.1:8080` |
| Squid | `http://127.0.0.1:3128` |

---

## Troubleshooting

**Track is still snipped after enabling**
- Make sure Tor is actually running: `curl --socks5 127.0.0.1:9050 https://api.ipify.org`
- Reload the SoundCloud tab after enabling the extension
- Check the extension is active in `about:debugging` (Firefox) or `chrome://extensions` (Chrome)

**Tor won't start on Windows**
- Run PowerShell as Administrator
- Check if port 9050 is already in use: `netstat -ano | findstr 9050`

**I want to use my own proxy instead of Tor**
- Open Settings → paste your proxy URL → Save
- Supported formats: `socks5://host:port`, `http://host:port`, `http://user:pass@host:port`

---
[blvcksyxx.xyz](https://blvcksyxx.xyz)
