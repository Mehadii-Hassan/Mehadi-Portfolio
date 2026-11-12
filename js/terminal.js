/*
 * ============================================================
 *  TERMINAL.JS — interactive AI terminal.
 *  Pre-scripted, NO API calls. Click chips or type commands.
 *  Output streams LLM-style via stream.js and reads from data.js.
 *  Auto-runs "whoami" the first time the section scrolls in.
 * ============================================================ */

"use strict";

(function initTerminal() {
  const body = document.getElementById("term-body");
  if (!body) return;
  const rfm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Command definitions (read from data.js) ---------------------
  const commands = [
    { name: "help", desc: "list available commands" },
    { name: "whoami", desc: "about me" },
    { name: "skills", desc: "list my technologies" },
    { name: "projects", desc: "show my projects" },
    { name: "education", desc: "my education & certs" },
    { name: "certs", desc: "my certifications" },
    { name: "contact", desc: "how to reach me" },
    { name: "resume", desc: "download my CV" },
    { name: "github", desc: "open my GitHub" },
    { name: "linkedin", desc: "open my LinkedIn" },
    { name: "clear", desc: "clear the terminal" },
    { name: "sudo hire mehadi", desc: "easter egg 🎉" }
  ];

  let history = [];
  let historyIndex = -1;

  // --- Building blocks --------------------------------------------------

  // Append a prompt line with input box to the terminal.
  function addPrompt() {
    const line = document.createElement("div");
    line.className = "term-line term-prompt";

    const symbol = document.createElement("span");
    symbol.className = "prompt-symbol";
    symbol.textContent = "➜";

    const label = document.createElement("span");
    label.textContent = "~/portfolio";

    const input = document.createElement("input");
    input.className = "term-input";
    input.type = "text";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("aria-label", "Terminal command input");

    line.appendChild(symbol);
    line.appendChild(label);
    line.appendChild(input);
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;

    // Wire up the input's behaviour.
    input.addEventListener("keydown", onInputKey);
    setTimeout(() => input.focus(), 50);
    return input;
  }

  // Stream a line of output into the terminal.
  function out(text) {
    const line = document.createElement("div");
    line.className = "term-line";
    body.appendChild(line);
    if (rfm) {
      line.textContent = text;
      body.scrollTop = body.scrollHeight;
      return Promise.resolve();
    }
    return streamText(line, text, { period: false }).then(() => {
      body.scrollTop = body.scrollHeight;
    });
  }

  // Print a meta header line like "--> skills".
  function header(label) {
    const line = document.createElement("div");
    line.className = "term-line";
    line.style.color = "var(--accent)";
    line.textContent = "--> " + label;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  // --- Command handlers ---------------------------------------------------

  function run(cmd, done) {
    const code = cmd.trim().toLowerCase();

    // clear: remove everything and add a fresh prompt.
    if (code === "clear") {
      body.innerHTML = "";
      addPrompt();
      if (done) done();
      return;
    }

    switch (code) {
      case "help":
        header("available commands");
        return commands
          .reduce((chain, c) => chain.then(() => out(c.name.padEnd(18) + c.desc)), Promise.resolve())
          .then(() => addPrompt())
          .then(() => done && done());

      case "whoami":
        header("whoami");
        return out(
          PROFILE.name + " — " + PROFILE.title + ".\n" +
          "Located in " + PROFILE.location + ".\n" +
          "Focused on: " + PROFILE.focus.join(", ") + "."
        ).then(addPrompt).then(() => done && done());

      case "skills":
        header("skills");
        return skills
          .reduce((chain, g) => chain.then(() => out("▪ " + g.items.join(", "))), Promise.resolve())
          .then(addPrompt).then(() => done && done());

      case "projects":
        header("projects");
        return projects
          .reduce((chain, p) => chain.then(() => out("▪ " + p.title + " — " + p.subtitle)), Promise.resolve())
          .then(addPrompt).then(() => done && done());

      case "education":
        header("education");
        return out(education.school + "\n  " + education.degree)
          .then(addPrompt).then(() => done && done());

      case "certs":
        header("certifications");
        return certifications
          .reduce((chain, c) =>
            chain
              .then(() => out("▪ " + c.title + " (" + c.issuer + ")"))
              .then(() => {
                if (!c.link || c.link.indexOf("YOUR_") !== -1) return Promise.resolve();
                return out("  " + c.link);
              }),
            Promise.resolve())
          .then(addPrompt).then(() => done && done());

      case "contact":
        header("contact");
        return out("✉ " + PROFILE.email)
          .then(() => out("⌂ " + PROFILE.location))
          .then(() => {
            if (PROFILE.showPhone) return out("✆ " + PROFILE.phone);
            return Promise.resolve();
          })
          .then(() => out("github: " + LINKS.github))
          .then(() => out("linkedin: " + LINKS.linkedin))
          .then(addPrompt).then(() => done && done());

      case "resume":
        header("resume");
        return out("Downloading " + LINKS.resume + "...")
          .then(() => {
            const a = document.createElement("a");
            a.href = LINKS.resume;
            a.download = "Md__Mehadi_Hassan.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
          })
          .then(out("done."))
          .then(addPrompt).then(() => done && done());

      case "github":
        header("github");
        return out("Opening " + LINKS.github + "...")
          .then(() => window.open(LINKS.github, "_blank", "noopener"))
          .then(addPrompt).then(() => done && done());

      case "linkedin":
        header("linkedin");
        return out("Opening " + LINKS.linkedin + "...")
          .then(() => window.open(LINKS.linkedin, "_blank", "noopener"))
          .then(addPrompt).then(() => done && done());

      case "sudo hire mehadi":
        header("sudo");
        return out("Access granted ✔")
          .then(() => out("You've reached the AI Engineer. Salary negotiable, irony free."))
          .then(() => out("Scroll to Contact to say hi 👇"))
          .then(addPrompt)
          .then(() => {
            if (done) done();
            // Smoothly scroll to Contact.
            document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
          });

      default:
        header("error");
        return out("Unknown command: '" + cmd + "'. Type 'help' to see what I can do.")
          .then(addPrompt).then(() => done && done());
    }
  }

  // Handle Enter (run) / Up-Down (history) on the input.
  function onInputKey(e) {
    const input = e.target;

    if (e.key === "Enter") {
      const value = input.value.trim();
      if (!value) return;

      // Replace the current input line with a static echo.
      const promptLine = input.parentElement;
      input.remove();
      const echo = document.createElement("span");
      echo.textContent = value;
      promptLine.appendChild(echo);

      history.push(value);
      historyIndex = history.length;

      body.scrollTop = body.scrollHeight;
      run(value);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex <= 0) return;
      historyIndex--;
      input.value = history[historyIndex];
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= history.length - 1) {
        historyIndex = history.length;
        input.value = "";
      } else {
        historyIndex++;
        input.value = history[historyIndex];
      }
    }
  }

  // --- Command chips above the terminal ---------------------------------
  function renderChips() {
    const wrap = document.getElementById("term-chips");
    commands.forEach((c) => {
      const chip = document.createElement("button");
      chip.className = "term-chip";
      chip.textContent = c.name;
      chip.type = "button";
      chip.setAttribute("aria-label", "Run " + c.name + " command");
      chip.addEventListener("click", () => {
        // Run the command directly (no input needed).
        const line = document.createElement("div");
        line.className = "term-line term-prompt";
        const symbol = document.createElement("span");
        symbol.className = "prompt-symbol";
        symbol.textContent = "➜";
        const label = document.createElement("span");
        label.textContent = "~/portfolio  " + c.name;
        line.appendChild(symbol);
        line.appendChild(label);
        body.appendChild(line);
        body.scrollTop = body.scrollHeight;
        run(c.name);
      });
      wrap.appendChild(chip);
    });
  }

  // --- Setup -----------------------------------------------------------------
  renderChips();
  addPrompt();

  // Auto-run "whoami" when the terminal section first scrolls into view.
  const termSection = document.getElementById("terminal");
  let whoamiRan = false;
  if (termSection) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !whoamiRan) {
          whoamiRan = true;
          // Replace the current prompt with the whoami command.
          body.innerHTML = "";
          addPrompt();
          run("whoami");
          io.disconnect();
        }
      });
    }, { threshold: 0.5 });
    io.observe(termSection);
  }
})();