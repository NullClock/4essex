/**
 * iWebKit 5 — JavaScript Framework
 * iOS 6-style web app framework helpers
 */

(function () {
  'use strict';

  /* ── Touch active states ─────────────────────────────────── */
  // iOS doesn't fire :active CSS pseudo-class reliably on scroll;
  // we add/remove a class manually for instant tap feedback.
  function addTouchFeedback(el) {
    el.addEventListener('touchstart', function () {
      el.classList.add('active-state');
    }, { passive: true });
    el.addEventListener('touchend', function () {
      el.classList.remove('active-state');
    }, { passive: true });
    el.addEventListener('touchcancel', function () {
      el.classList.remove('active-state');
    }, { passive: true });
  }

  function bindGroupLinks() {
    var links = document.querySelectorAll('ul li.group a');
    for (var i = 0; i < links.length; i++) {
      addTouchFeedback(links[i]);
    }
  }

  /* ── Topbar helpers ──────────────────────────────────────── */

  /**
   * Update the global topbar for a given screen config.
   * @param {object} cfg
   * @param {string} cfg.title        - Centre title text
   * @param {string} [cfg.backLabel]  - Left button label (falsy = hidden)
   * @param {string} [cfg.backTarget] - Screen ID to navigate back to
   * @param {string} [cfg.rightLabel] - Right button label (falsy = hidden)
   * @param {Function} [cfg.rightFn]  - Right button click handler
   */
  window.iwSetTopbar = function (cfg) {
    var titleEl    = document.getElementById('title');
    var leftEl     = document.getElementById('leftnav');
    var rightEl    = document.getElementById('rightnav');

    if (titleEl) titleEl.textContent = cfg.title || '';

    if (leftEl) {
      if (cfg.backLabel && cfg.backTarget) {
        leftEl.innerHTML =
          '<a href="#" class="back" onclick="iwNavigate(\'' +
          cfg.backTarget + '\');return false;">' +
          escHtml(cfg.backLabel) + '</a>';
      } else {
        leftEl.innerHTML = '';
      }
    }

    if (rightEl) {
      if (cfg.rightLabel) {
        rightEl.innerHTML =
          '<a href="#" id="iw-right-btn">' + escHtml(cfg.rightLabel) + '</a>';
        if (cfg.rightFn) {
          var btn = document.getElementById('iw-right-btn');
          if (btn) btn.addEventListener('click', function (e) {
            e.preventDefault();
            cfg.rightFn();
          });
        }
      } else {
        rightEl.innerHTML = '';
      }
    }
  };

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Navigation ──────────────────────────────────────────── */

  /**
   * Navigate to a named screen.  Apps call this directly.
   * @param {string} screenId
   */
  window.iwNavigate = function (screenId) {
    var screens = document.querySelectorAll('.iw-screen');
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.remove('iw-screen-active');
    }
    var target = document.getElementById('iw-screen-' + screenId);
    if (target) {
      target.classList.add('iw-screen-active');
      window.scrollTo(0, 0);
    }
    // Refresh touch bindings for newly visible links
    bindGroupLinks();
    // Fire custom event so app can update topbar
    document.dispatchEvent(new CustomEvent('iwscreenchange', { detail: screenId }));
  };

  /* ── Loading spinner ─────────────────────────────────────── */
  window.iwShowLoading = function () {
    var el = document.getElementById('iw-loading');
    if (el) el.style.display = 'flex';
  };

  window.iwHideLoading = function () {
    var el = document.getElementById('iw-loading');
    if (el) el.style.display = 'none';
  };

  /* ── Boot ────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    bindGroupLinks();

    // Prevent rubber-band scroll on topbar (iOS Safari)
    var topbar = document.getElementById('topbar');
    if (topbar) {
      topbar.addEventListener('touchmove', function (e) {
        e.preventDefault();
      }, { passive: false });
    }
  });
}());
