/**
 * 4essex — index.js
 * Basic navigation and UI helpers (no backend logic).
 */

/* ==================== SCREEN NAVIGATION ==================== */

/**
 * Show a named screen and hide all others.
 * @param {string} screenId - 'home' | 'ai' | 'music' | 'instagram'
 */
function showScreen(screenId) {
  var screens = document.querySelectorAll('.screen');
  for (var i = 0; i < screens.length; i++) {
    screens[i].classList.remove('active');
  }

  var target = document.getElementById('screen-' + screenId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }
}

/**
 * Keyboard navigation helper for app icons (Enter / Space to activate).
 * @param {KeyboardEvent} event
 * @param {string} screenId
 */
function handleKeyNav(event, screenId) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    showScreen(screenId);
  }
}

/* ==================== STATUS BAR CLOCK ==================== */

/**
 * Update the status-bar clock to the current local time (12-hour, no seconds).
 */
function updateClock() {
  var el = document.getElementById('status-time');
  if (!el) return;

  var now = new Date();
  var h = now.getHours();
  var m = now.getMinutes();
  var ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  el.textContent = h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
}

/* ==================== AI CHAT (layout only) ==================== */

/**
 * Append a message bubble to the chat view.
 * @param {string} text - Message text
 * @param {'user'|'assistant'} role - Who sent the message
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
 * Handle the send-button / Enter-key action in the chat input.
 * NOTE: No AI backend logic is wired up — this only updates the UI.
 */
function handleChatSend() {
  var input = document.getElementById('chat-input');
  var text = input ? input.value.trim() : '';
  if (!text) return;

  appendChatMessage(text, 'user');
  input.value = '';

  // Placeholder: assistant reply will be added here when logic is implemented
}

/* ==================== MUSIC PLAYER (layout only) ==================== */

var musicPlaying = false;

/**
 * Toggle the play/pause state of the music player UI.
 * NOTE: No audio streaming logic is wired up — this only updates the UI.
 */
function toggleMusicPlay() {
  musicPlaying = !musicPlaying;
  var iconEl = document.getElementById('music-play-icon');
  var btnEl = document.getElementById('music-play');

  if (!iconEl || !btnEl) return;

  if (musicPlaying) {
    // Show pause icon
    iconEl.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    btnEl.setAttribute('aria-label', 'Pause');
  } else {
    // Show play icon
    iconEl.innerHTML = '<path d="M8 5v14l11-7z"/>';
    btnEl.setAttribute('aria-label', 'Play');
  }
}

/* ==================== BOOT ==================== */

document.addEventListener('DOMContentLoaded', function () {
  // Start status-bar clock
  updateClock();
  setInterval(updateClock, 30000);

  // Chat send button
  var sendBtn = document.getElementById('chat-send');
  if (sendBtn) {
    sendBtn.addEventListener('click', handleChatSend);
  }

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
  if (playBtn) {
    playBtn.addEventListener('click', toggleMusicPlay);
  }
});
