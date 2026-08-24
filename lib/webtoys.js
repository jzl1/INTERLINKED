const defaultLogoURL = 'https://github.com/GleammerRay/INTERLINKED/blob/main/assets/logo.png?raw=true';

const defaultDiscordInviteURL = '';
const discordIconSVG = `<svg class="discord-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`;

export function buildHeaderHTML(logoURL, discordInviteURL = defaultDiscordInviteURL) {
  var discordButton = '';
  if (typeof discordInviteURL === 'string' && discordInviteURL.trim() !== '') {
    discordButton = `\n    <a class="btn-discord" target="_blank" href="${discordInviteURL.trim()}">
      ${discordIconSVG}
      <span>Discord</span>
    </a>`;
  }
  return `  <div class="embed-header">
    <a class="embed-author-link" target="_blank" href="https://github.com/GleammerRay/INTERLINKED">
      <div class="embed-author">
        <div class="image-cropper">
          <img class="embed-author-iconurl" src="${logoURL}" width="24" height="24" alt="logo">
        </div>
        <span class="embed-author-name">INTERLINKED</span>
      </div>
    </a>${discordButton}
  </div>`;
}


const clientScripts = `
<script>
function copyIP(el, text) {
  if (!navigator.clipboard) return;
  navigator.clipboard.writeText(text).then(() => {
    const orig = el.textContent;
    el.textContent = 'Copied!';
    el.classList.add('copied');
    setTimeout(() => {
      el.textContent = orig;
      el.classList.remove('copied');
    }, 1500);
  });
}
function updateRelativeTime() {
  const timeEl = document.getElementById('updated-time');
  const relEl = document.getElementById('rel-time');
  if (!timeEl || !relEl) return;
  const stamp = new Date(timeEl.getAttribute('datetime')).getTime();
  const diffSec = Math.max(0, Math.floor((Date.now() - stamp) / 1000));
  if (diffSec < 5) relEl.textContent = 'just now';
  else if (diffSec < 60) relEl.textContent = diffSec + 's ago';
  else relEl.textContent = Math.floor(diffSec / 60) + 'm ago';
}
setInterval(updateRelativeTime, 1000);
updateRelativeTime();
</script>
`;

export function buildServerField(server) {
  var badgeClass, badgeLabel;
  if (server.playerCount >= server.maxPlayerCount && server.maxPlayerCount > 0) {
    badgeClass = 'status-full';
    badgeLabel = 'FULL';
  } else if (server.playerCount > 0) {
    badgeClass = 'status-online';
    badgeLabel = 'ONLINE';
  } else {
    badgeClass = 'status-idle';
    badgeLabel = 'IDLE';
  }
  var statusBadge = `<span class="status-badge ${badgeClass}"><span class="status-dot"></span>${badgeLabel}</span>`;
  var safeName = server.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  var safeAddress = server.address.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  var safeMap = server.mapName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `  <div class="server-card">
    <div class="server-header">
      <div class="server-title-group">
        ${statusBadge}
        <span class="embed-topserver-name">${safeName}</span>
      </div>
      <a class="btn-connect" href="steam://connect/${safeAddress}">Connect</a>
    </div>
    <div class="server-info-row">
      <span class="embed-topserver-label">Players:</span>
      <span class="embed-topserver-value">${server.playerCount}/${server.maxPlayerCount}</span>
    </div>
    <div class="server-info-row">
      <span class="embed-topserver-label">IP:</span>
      <span class="code embed-topserver-value copyable-ip" onclick="copyIP(this, '${safeAddress}')" title="Click to copy IP">${safeAddress}</span>
    </div>
    <div class="server-info-row">
      <span class="embed-topserver-label">Map:</span>
      <span class="code embed-topserver-value">${safeMap}</span>
    </div>
  </div>`;
}

export function generateTopServersHTML(gameName, serverList, style, logoURL = defaultLogoURL, discordInviteURL = defaultDiscordInviteURL) {
  var now = new Date();
  var topServer;
  var viewAllButton = `    <div class="view-all-container">
      <a class="btn-view-all" href="serverlist.html">View All Servers (${serverList.serverCount}) →</a>
    </div>`;
  if (serverList.activeServers.length == 0) {
    topServer = `  <div class="embed-topserver">
    <h3 class="embed-topserver-title">🔴 No active ${gameName} servers. 🔴</h3>
${viewAllButton}
  </div>`;
  } else {
    var server = serverList.activeServers[0];
    topServer = `  <div class="embed-topserver">
    <h3 class="embed-topserver-title">👑 Top ${gameName} server 👑</h3>
${buildServerField(server)}
${viewAllButton}
  </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="refresh" content="30" />
<title>INTERLINKED - ${gameName}</title>
<link rel="icon" href="${logoURL}" type="image/icon type">
<style>
${style}
</style>
</head>
<body>
<div class="embed-content">
${buildHeaderHTML(logoURL, discordInviteURL)}
  <div class="embed-status">
    <div>
      <span class="embed-status-label">🖥️ Online servers: </span>
      <span class="embed-status-value">${serverList.serverCount}</span>
    </div>
    <div>
      <span class="embed-status-label">🤗 Online players: </span>
      <span class="embed-status-value">${serverList.playerCount}</span>
    </div>
  </div>
${topServer}
  <div class="embed-footer">
    <time class="embed-footer-text" id="updated-time" datetime="${now.toISOString()}">Made by Gemini • <span id="rel-time">just now</span> (${now.toUTCString()})</time>
  </div>
</div>
${clientScripts}
</body>
</html>`;
}

export function generateServerListHTML(gameName, serverList, style, logoURL = defaultLogoURL, discordInviteURL = defaultDiscordInviteURL) {
  var now = new Date();
  var _servers = Object.values(serverList.servers);
  var activeServersHTML = '';
  var emptyServersHTML = '';
  var _addedServers = [];

  if (serverList.activeServers.length != 0) {
    for (var i = 0; i != serverList.activeServers.length; i++) {
      var _server = serverList.activeServers[i];
      activeServersHTML += buildServerField(_server) + '\n';
      _addedServers.push(_server.address);
    }
  }

  var emptyCount = 0;
  if (_servers.length != 0) {
    for (var i = 0; i != _servers.length; i++) {
      var _server = _servers[i];
      if (_addedServers.includes(_server.address)) continue;
      if (_server.playerCount != 0) continue;
      emptyServersHTML += buildServerField(_server) + '\n';
      emptyCount++;
    }
  }

  var bodyContent = '';
  if (_servers.length == 0) {
    bodyContent = `  <div class="embed-topserver">
    <h3 class="embed-topserver-title">No online ${gameName} servers. 🌪️</h3>
  </div>`;
  } else if (serverList.activeServers.length == 0) {
    bodyContent = `  <div class="embed-topserver">
    <h3 class="embed-topserver-title">🔴 No active ${gameName} servers. 🔴</h3>
    <details class="empty-servers-toggle" open>
      <summary class="empty-servers-summary">Show ${emptyCount} idle server${emptyCount === 1 ? '' : 's'}</summary>
      <div class="empty-servers-list">
${emptyServersHTML}      </div>
    </details>
  </div>`;
  } else {
    var emptySection = '';
    if (emptyCount > 0) {
      emptySection = `    <details class="empty-servers-toggle">
      <summary class="empty-servers-summary">Show ${emptyCount} idle server${emptyCount === 1 ? '' : 's'}</summary>
      <div class="empty-servers-list">
${emptyServersHTML}      </div>
    </details>`;
    }
    bodyContent = `  <div class="embed-topserver">
    <h3 class="embed-topserver-title">${gameName} servers list:</h3>
${activeServersHTML}${emptySection}
  </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="refresh" content="30" />
<title>INTERLINKED - ${gameName}</title>
<link rel="icon" href="${logoURL}" type="image/icon type">
<style>
${style}
</style>
</head>
<body>
<div class="embed-content">
${buildHeaderHTML(logoURL, discordInviteURL)}
  <div class="embed-status">
    <div>
      <span class="embed-status-label">🖥️ Online servers: </span>
      <span class="embed-status-value">${serverList.serverCount}</span>
    </div>
    <div>
      <span class="embed-status-label">🤗 Online players: </span>
      <span class="embed-status-value">${serverList.playerCount}</span>
    </div>
  </div>
${bodyContent}
  <div class="embed-footer">
    <time class="embed-footer-text" id="updated-time" datetime="${now.toISOString()}">Made by Gemini • <span id="rel-time">just now</span> (${now.toUTCString()})</time>
  </div>
</div>
${clientScripts}
</body>
</html>`;
}
