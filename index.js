/**
 * 4essex — index.js
 * App-specific navigation and UI helpers built on iWebKit 5.
 */

/* ==================== SCREEN CONFIGS ==================== */

var screenConfigs = {
  home: {
    title: '4essex',
    backLabel: null
  },
  ai: {
    title: 'AI Chat',
    backLabel: 'Back',
    backTarget: 'home'
  },
  music: {
    title: 'Stream Music',
    backLabel: 'Back',
    backTarget: 'home'
  },
  instagram: {
    title: 'Direct',
    backLabel: 'Back',
    backTarget: 'home'
  }
};

/* ==================== NAVIGATION ==================== */

// Listen for iWebKit screen-change events and update the topbar
document.addEventListener('iwscreenchange', function (e) {
  var id = e.detail;
  var cfg = screenConfigs[id];
  if (cfg) iwSetTopbar(cfg);
});

/* ==================== STATUS BAR CLOCK ==================== */

/**
 * iWebKit 5 topbar shows the title, not a status bar clock.
 * We do not simulate a status bar; this function is kept as
 * a no-op so nothing breaks if called elsewhere.
 */
function updateClock() {
  /* no-op: iWebKit 5 does not include a custom status bar */
}

/* ==================== AI CHAT ==================== */

/**
 * Append a message bubble to the chat view.
 * @param {string} text
 * @param {'user'|'assistant'} role
 */
function appendChatMessage(text, role) {
  var container = document.getElementById('chat-messages');
  var emptyState = document.getElementById('chat-empty');

  if (emptyState) {
    emptyState.style.display = 'none';
  }

  var bubble = document.createElement('div');
  bubble.className = 'chat-message ' + role;
  bubble.textContent = text;

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

/**
 * Handle the send-button / Enter-key action.
 * NOTE: No AI backend logic is wired up — UI only.
 */
function handleChatSend() {
  var input = document.getElementById('chat-input');
  var text  = input ? input.value.trim() : '';
  if (!text) return;

  appendChatMessage(text, 'user');
  input.value = '';
  // Placeholder: assistant reply will be added here when logic is implemented
}

/* ==================== MUSIC PLAYER ==================== */

var musicPlaying = false;

/**
 * Toggle play/pause state in the music UI.
 * NOTE: No audio streaming logic — UI only.
 */
function toggleMusicPlay() {
  musicPlaying = !musicPlaying;
  var iconEl = document.getElementById('music-play-icon');
  var btnEl  = document.getElementById('music-play');

  if (!iconEl || !btnEl) return;

  if (musicPlaying) {
    iconEl.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    btnEl.setAttribute('aria-label', 'Pause');
  } else {
    iconEl.innerHTML = '<path d="M8 5v14l11-7z"/>';
    btnEl.setAttribute('aria-label', 'Play');
  }
}

/* ==================== BOOT ==================== */

document.addEventListener('DOMContentLoaded', function () {
  // Initialise topbar for the home screen
  var homeCfg = screenConfigs.home;
  if (homeCfg) iwSetTopbar(homeCfg);

  // Chat send button
  var sendBtn = document.getElementById('chat-send');
  if (sendBtn) sendBtn.addEventListener('click', handleChatSend);

  // Chat input — send on Enter
  var chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleChatSend();
      }
    });
  }

  // Music play/pause button
  var playBtn = document.getElementById('music-play');
  if (playBtn) playBtn.addEventListener('click', toggleMusicPlay);
});
