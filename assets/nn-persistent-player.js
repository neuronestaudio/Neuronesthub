/*!
 * NeuroNest Persistent Radio Player
 * When SoundHub is playing and the user navigates away, this script
 * injects a fixed mini-player bar so audio can resume with one tap.
 *
 * State key: localStorage.nn_playing  (set by soundhub.html on play)
 * Cleared: on natural track end, or when user dismisses the bar.
 *
 * BROWSER AUTOPLAY POLICY: browsers block auto-start without a prior
 * user gesture on the new page. The bar therefore shows a ▶ Resume
 * button — one tap is all that is needed to restart audio.
 */
(function () {
  'use strict';

  var LS_KEY   = 'nn_playing';
  var MAX_AGE  = 8 * 3600 * 1000; // 8 hours — discard stale state

  /* ── Don't activate on SoundHub itself ───────────────────────── */
  if (window.location.pathname.indexOf('soundhub') !== -1) return;

  /* ── Read stored state ────────────────────────────────────────── */
  var state = null;
  try {
    var raw = localStorage.getItem(LS_KEY);
    if (raw) state = JSON.parse(raw);
  } catch (e) {}

  if (!state || !state.id) return;
  if (state.ts && (Date.now() - state.ts > MAX_AGE)) {
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
    return;
  }

  /* ── Runtime state ────────────────────────────────────────────── */
  var yt            = null;
  var ytApiLoaded   = false;
  var ytReady       = false;
  var isPlaying     = false;
  var loadStarted   = false;
  var progTimer     = null;

  /* ── Inject styles ────────────────────────────────────────────── */
  var css = [
    /* Bar container */
    '#nn-pp{',
      'position:fixed;bottom:0;left:0;right:0;z-index:99999;',
      'font-family:"DM Mono",ui-monospace,monospace;',
      'background:rgba(8,8,8,0.97);',
      'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);',
      'border-top:1px solid rgba(255,255,255,0.07);',
      'box-shadow:0 -6px 36px rgba(0,0,0,0.55);',
      'transform:translateY(105%);',
      'transition:transform 0.5s cubic-bezier(0.16,1,0.3,1);',
      'will-change:transform;',
    '}',
    '#nn-pp.nn-visible{transform:translateY(0);}',

    /* Slim progress bar across the very top */
    '#nn-pp-prog{',
      'width:100%;height:3px;',
      'background:rgba(255,255,255,0.06);',
      'cursor:pointer;position:relative;flex-shrink:0;',
      'transition:height 0.15s;',
    '}',
    '#nn-pp-prog:hover{height:5px;}',
    '#nn-pp-prog-fill{',
      'height:100%;background:#E0B100;width:0%;',
      'transition:width 0.5s linear;',
      'box-shadow:0 0 8px rgba(224,177,0,0.45);',
    '}',

    /* Main row */
    '#nn-pp-row{',
      'display:flex;align-items:center;',
      'gap:14px;padding:0 20px;height:72px;',
    '}',

    /* Thumbnail */
    '#nn-pp-thumb{',
      'width:44px;height:44px;object-fit:cover;',
      'border:1px solid rgba(255,255,255,0.09);',
      'flex-shrink:0;border-radius:2px;',
      'transition:transform 0.25s;',
    '}',
    '#nn-pp-thumb:hover{transform:scale(1.06);}',

    /* Info block */
    '#nn-pp-info{flex:1;min-width:0;}',
    '#nn-pp-title{',
      'font-size:11.5px;font-weight:500;color:#F3F3F0;',
      'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
      'margin-bottom:3px;',
    '}',
    '#nn-pp-meta{',
      'font-size:9.5px;text-transform:uppercase;',
      'letter-spacing:0.1em;color:#6B7680;',
      'display:flex;align-items:center;gap:8px;',
    '}',
    '#nn-pp-badge{',
      'display:inline-flex;align-items:center;gap:4px;',
      'padding:1px 7px;',
      'border:1px solid rgba(224,177,0,0.28);border-radius:20px;',
      'font-size:8px;letter-spacing:0.12em;color:#E0B100;white-space:nowrap;',
    '}',
    '#nn-pp-badge::before{content:"●";font-size:5px;vertical-align:middle;}',

    /* Controls */
    '#nn-pp-ctrl{display:flex;align-items:center;gap:10px;flex-shrink:0;}',
    '.nn-pp-icon-btn{',
      'width:30px;height:30px;',
      'background:none;border:none;cursor:pointer;',
      'color:#9ca3af;display:flex;align-items:center;justify-content:center;',
      'border-radius:50%;transition:all 0.15s;padding:0;',
    '}',
    '.nn-pp-icon-btn:hover{color:#F3F3F0;background:rgba(255,255,255,0.07);}',

    /* Play/Pause main button */
    '#nn-pp-play{',
      'width:38px;height:38px;flex-shrink:0;',
      'border:1.5px solid #E0B100;border-radius:50%;',
      'color:#E0B100;background:transparent;cursor:pointer;',
      'display:flex;align-items:center;justify-content:center;',
      'transition:all 0.2s;padding:0;',
    '}',
    '#nn-pp-play:hover{',
      'background:#E0B100;color:#050505;',
      'box-shadow:0 0 18px rgba(224,177,0,0.45);',
    '}',

    /* Open SoundHub pill */
    '#nn-pp-hub{',
      'font-family:"DM Mono",ui-monospace,monospace;',
      'font-size:9px;text-transform:uppercase;letter-spacing:0.12em;',
      'color:#E0B100;text-decoration:none;',
      'border:1px solid rgba(224,177,0,0.28);padding:6px 13px;border-radius:20px;',
      'white-space:nowrap;transition:all 0.15s;flex-shrink:0;',
    '}',
    '#nn-pp-hub:hover{background:rgba(224,177,0,0.1);border-color:rgba(224,177,0,0.55);}',

    /* Close */
    '#nn-pp-close{color:#4b5563;}',
    '#nn-pp-close:hover{color:#F3F3F0 !important;}',

    /* Mobile: hide hub link and badge on very small screens */
    '@media(max-width:580px){',
      '#nn-pp-hub{display:none;}',
      '#nn-pp-badge{display:none;}',
      '#nn-pp-row{gap:10px;padding:0 14px;}',
    '}',

    /* Hidden YT mount */
    '#nn-pp-yt{position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── Build bar HTML ───────────────────────────────────────────── */
  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function svgPlay() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
  }
  function svgPause() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="4.5" height="16"/><rect x="14.5" y="4" width="4.5" height="16"/></svg>';
  }
  function svgClose() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  }

  function resolveHubUrl() {
    /* Build relative path back to soundhub.html from wherever we are */
    var segs = window.location.pathname.split('/').filter(Boolean);
    segs.pop(); // remove filename
    var prefix = segs.length ? segs.map(function(){ return '..'; }).join('/') + '/' : '';
    return prefix + 'soundhub.html';
  }

  var thumbUrl = 'https://img.youtube.com/vi/' + esc(state.id) + '/mqdefault.jpg';
  var hubUrl   = resolveHubUrl();

  var bar = document.createElement('div');
  bar.id  = 'nn-pp';
  bar.innerHTML = [
    '<div id="nn-pp-prog">',
      '<div id="nn-pp-prog-fill"></div>',
    '</div>',
    '<div id="nn-pp-row">',
      '<img id="nn-pp-thumb" src="' + thumbUrl + '" alt="" loading="eager">',
      '<div id="nn-pp-info">',
        '<div id="nn-pp-title">' + esc(state.title) + '</div>',
        '<div id="nn-pp-meta">',
          '<span>' + esc(state.category) + (state.duration ? ' · ' + esc(state.duration) : '') + '</span>',
          '<span id="nn-pp-badge">SoundHub Radio</span>',
        '</div>',
      '</div>',
      '<div id="nn-pp-ctrl">',
        '<button id="nn-pp-play" title="Resume" aria-label="Resume">' + svgPlay() + '</button>',
        '<a id="nn-pp-hub" href="' + hubUrl + '">Open SoundHub →</a>',
        '<button class="nn-pp-icon-btn" id="nn-pp-close" title="Dismiss" aria-label="Dismiss">' + svgClose() + '</button>',
      '</div>',
    '</div>'
  ].join('');

  /* Append and animate in after first paint */
  function mount() {
    document.body.appendChild(bar);
    setTimeout(function() { bar.classList.add('nn-visible'); }, 120);
    bar.querySelector('#nn-pp-play').addEventListener('click', onPlayClick);
    bar.querySelector('#nn-pp-close').addEventListener('click', onDismiss);
    bar.querySelector('#nn-pp-prog').addEventListener('click', onSeek);
  }

  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }

  /* ── Event handlers ───────────────────────────────────────────── */
  function onPlayClick() {
    if (!loadStarted) {
      loadStarted = true;
      initYT();
      return;
    }
    if (!ytReady) return; // still loading
    if (isPlaying) {
      try { yt.pauseVideo(); } catch(e) {}
      isPlaying = false;
    } else {
      try { yt.playVideo(); } catch(e) {}
      isPlaying = true;
    }
    updatePlayBtn();
  }

  function onDismiss() {
    bar.classList.remove('nn-visible');
    setTimeout(function() {
      if (bar.parentNode) bar.parentNode.removeChild(bar);
    }, 500);
    if (yt) { try { yt.stopVideo(); } catch(e) {} }
    try { localStorage.removeItem(LS_KEY); } catch(e) {}
    if (progTimer) clearInterval(progTimer);
  }

  function onSeek(event) {
    if (!ytReady || !yt) return;
    var prog = document.getElementById('nn-pp-prog');
    if (!prog) return;
    var rect = prog.getBoundingClientRect();
    var pct  = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    var dur  = 0;
    try { dur = yt.getDuration() || 0; } catch(e) {}
    if (dur > 0) { try { yt.seekTo(pct * dur, true); } catch(e) {} }
  }

  /* ── YouTube IFrame API ───────────────────────────────────────── */
  function initYT() {
    /* Create the 1x1 hidden mount */
    var mount = document.createElement('div');
    mount.id  = 'nn-pp-yt';
    document.body.appendChild(mount);

    /* Preserve any existing callback (e.g. if the page itself uses YT) */
    var prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function() {
      if (typeof prev === 'function') prev();
      ytApiLoaded = true;
      createPlayer();
    };

    /* If the API script is already loaded and ready, call immediately */
    if (window.YT && window.YT.Player) {
      ytApiLoaded = true;
      createPlayer();
    } else {
      /* Inject the IFrame API script */
      var s   = document.createElement('script');
      s.async = true;
      s.src   = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }
  }

  function createPlayer() {
    yt = new YT.Player('nn-pp-yt', {
      height: '1', width: '1',
      playerVars: {
        autoplay: 1,
        controls: 0,
        origin: window.location.origin
      },
      events: {
        onReady: function() {
          ytReady   = true;
          isPlaying = true;
          try { yt.setVolume(100); } catch(e) {}
          try { yt.loadVideoById(state.id); } catch(e) {}
          updatePlayBtn();
          startProgressLoop();
        },
        onStateChange: function(ev) {
          if (ev.data === 1) { isPlaying = true;  updatePlayBtn(); } // playing
          if (ev.data === 2) { isPlaying = false; updatePlayBtn(); } // paused
          if (ev.data === 0) { // ended — clear state
            isPlaying = false;
            updatePlayBtn();
            try { localStorage.removeItem(LS_KEY); } catch(e) {}
          }
        },
        onError: function() {
          isPlaying = false;
          updatePlayBtn();
        }
      }
    });
  }

  /* ── Progress bar loop ────────────────────────────────────────── */
  function startProgressLoop() {
    if (progTimer) clearInterval(progTimer);
    progTimer = setInterval(function() {
      if (!ytReady || !yt || !yt.getCurrentTime) return;
      var cur = 0, tot = 0;
      try { cur = yt.getCurrentTime() || 0; } catch(e) {}
      try { tot = yt.getDuration()    || 0; } catch(e) {}
      var fill = document.getElementById('nn-pp-prog-fill');
      if (fill && tot > 0) fill.style.width = Math.min(100, (cur / tot) * 100) + '%';
    }, 500);
  }

  /* ── UI helpers ───────────────────────────────────────────────── */
  function updatePlayBtn() {
    var btn = document.getElementById('nn-pp-play');
    if (!btn) return;
    btn.innerHTML   = isPlaying ? svgPause() : svgPlay();
    btn.title       = isPlaying ? 'Pause' : 'Resume';
    btn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Resume');
  }

}());
