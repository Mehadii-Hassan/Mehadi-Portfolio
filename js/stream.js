/*
 * ============================================================
 *  STREAM.JS — reusable LLM-style text streaming effect.
 *  Streams text word-by-word with tiny random delays and a
 *  blinking cursor, like a ChatGPT answer.
 *
 *  Usage:
 *    streamText(element, "text", { speed: [20,60], cursor: true })
 *      .then(() => done);   // resolves when finished
 *    streamText.immediate(element, "text")  // instant (reduced motion)
 * ============================================================ */

"use strict";

// Respect reduced-motion preference once at load.
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const streamText = (function () {
  // Default timing for each word (min/max ms).
  const DEFAULT_MIN = 20;
  const DEFAULT_MAX = 60;

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /*
   * Main streaming function.
   * element : the DOM element we append text into.
   * text    : full string to stream.
   * opts    : { min, max, cursor:boolean, period:boolean }
   * Returns a Promise resolved when the stream completes.
   *
   * Words are inserted as text nodes BEFORE a trailing cursor span,
   * so the blinking cursor stays at the end the whole time.
   */
  function streamText(element, text, opts) {
    opts = opts || {};

    // Reduced motion: show instantly.
    if (REDUCED_MOTION) {
      element.textContent = text;
      return Promise.resolve();
    }

    const min = opts.min || DEFAULT_MIN;
    const max = opts.max || DEFAULT_MAX;
    const cursor = opts.cursor !== false;
    const period = opts.period !== false;

    const words = text.split(" ");

    // Trailing blinking-cursor span (empty inline-block bar).
    let cur = null;
    if (cursor) {
      cur = document.createElement("span");
      cur.className = "stream-cursor";
      element.appendChild(cur);
    }

    return new Promise((resolve) => {
      let i = 0;

      function next() {
        if (i >= words.length) {
          // Add a period if the text doesn't end with punctuation.
          if (period && !/[.!?]$/.test(text)) {
            element.insertBefore(document.createTextNode("."), cur);
          }
          if (cur) cur.remove();
          resolve();
          return;
        }

        const word = words[i];
        let pause = rand(min, max);
        // Breathe longer after punctuation-like endings.
        if (/[.,!?]/.test(word)) pause += rand(30, 120);

        // Insert the next word before the cursor (preserving it).
        element.insertBefore(document.createTextNode(word + " "), cur);
        i++;
        setTimeout(next, pause);
      }

      next();
    });
  }

  // Instant version (used for reduced-motion or instant sections).
  streamText.immediate = function (element, text) {
    element.textContent = text;
    return Promise.resolve();
  };

  return streamText;
})();