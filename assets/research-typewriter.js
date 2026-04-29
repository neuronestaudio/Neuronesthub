/**
 * research-typewriter.js
 * Animates the .body-content section of research deep-dive pages.
 * - The first H3 ("Deep investigation") types in character by character.
 * - Remaining sections cascade in with a staggered fade-up reveal.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var content = document.querySelector('.body-content');
    if (!content) return;

    var nodes = Array.from(content.children);
    if (!nodes.length) return;

    // Inject blink keyframe + transition style once
    if (!document.getElementById('tw-style')) {
      var style = document.createElement('style');
      style.id = 'tw-style';
      style.textContent =
        '@keyframes twBlink{0%,100%{opacity:1}50%{opacity:0}}' +
        '.tw-hidden{opacity:0;transform:translateY(10px);transition:opacity 0.45s ease,transform 0.45s ease;}' +
        '.tw-visible{opacity:1!important;transform:translateY(0)!important;}';
      document.head.appendChild(style);
    }

    // Group nodes into sections split on H3 / H4 boundaries
    var sections = [];
    var current = [];
    nodes.forEach(function (node) {
      var tag = node.tagName;
      if ((tag === 'H3' || tag === 'H4') && current.length > 0) {
        sections.push(current);
        current = [node];
      } else {
        current.push(node);
      }
    });
    if (current.length) sections.push(current);

    // Hide everything first
    nodes.forEach(function (n) {
      n.classList.add('tw-hidden');
    });

    var delay = 0;
    var firstSection = sections[0] || [];
    var firstHeading = firstSection[0];
    var isH3 = firstHeading && firstHeading.tagName === 'H3';

    if (isH3) {
      // Reveal the heading immediately (opacity 1) then type into it
      firstHeading.classList.remove('tw-hidden');
      firstHeading.classList.add('tw-visible');
      firstHeading.style.opacity = '1';
      firstHeading.style.transform = 'translateY(0)';

      var originalText = firstHeading.textContent;
      firstHeading.textContent = '';

      // Typing cursor
      var cursor = document.createElement('span');
      cursor.setAttribute('aria-hidden', 'true');
      cursor.style.cssText =
        'color:#8ea3ff;animation:twBlink 0.6s step-end infinite;margin-left:1px;font-weight:300;';
      cursor.textContent = '|';
      firstHeading.appendChild(cursor);

      var charIdx = 0;
      var charSpeed = 38; // ms per character
      var typingDuration = originalText.length * charSpeed + 550;

      setTimeout(function typeChar() {
        if (charIdx < originalText.length) {
          firstHeading.insertBefore(
            document.createTextNode(originalText[charIdx++]),
            cursor
          );
          setTimeout(typeChar, charSpeed);
        } else {
          setTimeout(function () {
            cursor.remove();
          }, 350);
        }
      }, 180);

      // Rest of first section appears after typing finishes
      delay = typingDuration;
      firstSection.slice(1).forEach(function (el) {
        (function (el, d) {
          setTimeout(function () {
            el.classList.add('tw-visible');
          }, d);
        })(el, delay);
        delay += 70;
      });

      sections = sections.slice(1);
    }

    // Cascade remaining sections
    sections.forEach(function (section) {
      section.forEach(function (el) {
        (function (el, d) {
          setTimeout(function () {
            el.classList.add('tw-visible');
          }, d);
        })(el, delay);
        delay += 50;
      });
      delay += 25; // breathing room between sections
    });
  });
})();
