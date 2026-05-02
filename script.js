// ── Start Screen ────────────────────────────────────────
const startScreen = document.getElementById("start-screen");
if (startScreen) {
  const dismissStart = () => {
    startScreen.classList.add("hidden");
  };
  document.addEventListener("keydown", dismissStart, { once: true });
  startScreen.addEventListener("pointerdown", dismissStart, { once: true });
}

const menuButton = document.getElementById("menu-button");
const navList = document.getElementById("nav-list");

if (menuButton && navList) {
  menuButton.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const revealNodes = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

revealNodes.forEach((node) => revealObserver.observe(node));

const tiltNodes = document.querySelectorAll("[data-tilt]");

const handleTilt = (event) => {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const rotateY = (x - 0.5) * 8;
  const rotateX = (0.5 - y) * 8;

  card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
};

const resetTilt = (event) => {
  event.currentTarget.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
};

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  tiltNodes.forEach((node) => {
    node.style.transition = "transform 220ms ease";
    node.addEventListener("pointermove", handleTilt);
    node.addEventListener("pointerleave", resetTilt);
  });
}

const workToggles = document.querySelectorAll(".exp-toggle");
workToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const panelId = toggle.getAttribute("aria-controls");
    if (!panelId) return;
    const panel = document.getElementById(panelId);
    if (!panel) return;

    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    panel.hidden = isOpen;
  });
});

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

// ── Skill Bars ──────────────────────────────────────────
const sblFills = document.querySelectorAll(".sbl-fill[data-pct]");
if (sblFills.length) {
  const sblObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.width = entry.target.dataset.pct + "%";
        sblObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );
  sblFills.forEach((fill) => sblObserver.observe(fill));
}

// ── Achievement Popup ───────────────────────────────────
const achievementEl = document.getElementById("achievement");
const achievementDesc = document.getElementById("achievement-desc");

const triggerAchievement = (text) => {
  if (!achievementEl || !achievementDesc) return;
  achievementDesc.textContent = text;
  achievementEl.hidden = false;
  setTimeout(() => {
    achievementEl.hidden = true;
  }, 3600);
};

const achievements = [
  ["experience", "Quest Log Unlocked"],
  ["projects",   "Rare Artifacts Discovered"],
  ["skills",     "Tech Tree Expanded"],
  ["contact",    "Guild Recruitment Open"],
];

achievements.forEach(([id, text]) => {
  const el = document.getElementById(id);
  if (!el || !achievementEl) return;
  let fired = false;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          setTimeout(() => triggerAchievement(text), 500);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.35 }
  );
  obs.observe(el);
});

// ── Scroll spy — highlight active nav link ───────────────
const spySections = document.querySelectorAll("section[id]");
const spyLinks = document.querySelectorAll(".nav-list a");

if (spySections.length && spyLinks.length) {
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        spyLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );
  spySections.forEach((s) => spyObserver.observe(s));
}

// ── Terminal ─────────────────────────────────────────────
const terminal     = document.getElementById("terminal");
const termOutput   = document.getElementById("terminal-output");
const termInput    = document.getElementById("terminal-input");
const termBody     = document.getElementById("terminal-body");
const termCloseDot = document.getElementById("terminal-close-dot");

let termHistory    = [];
let termHistoryIdx = -1;
let termOpen       = false;

const openTerminal = () => {
  termOpen = true;
  terminal.hidden = false;
  termInput.focus();
};

const closeTerminal = () => {
  termOpen = false;
  terminal.hidden = true;
};

// Backtick toggles terminal (unless focus is on another input)
document.addEventListener("keydown", (e) => {
  if (e.key === "t" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
    e.preventDefault();
    termOpen ? closeTerminal() : openTerminal();
  }
  if (e.key === "Escape" && termOpen) closeTerminal();
});

if (termCloseDot) termCloseDot.addEventListener("click", closeTerminal);

const scrollTermBottom = () => {
  termBody.scrollTop = termBody.scrollHeight;
};

const tPrint = (html, cls = "t-white") => {
  const p = document.createElement("p");
  p.className = `t-line ${cls}`;
  p.innerHTML = html;
  termOutput.appendChild(p);
  scrollTermBottom();
};

const tBlank = () => tPrint("");

const COMMANDS = {
  help() {
    tBlank();
    tPrint("Available commands:", "t-accent");
    tPrint('  <span class="t-cmd">whoami</span>          — about Samyuktha');
    tPrint('  <span class="t-cmd">ls</span>              — list sections');
    tPrint('  <span class="t-cmd">ls skills</span>       — list skill categories');
    tPrint('  <span class="t-cmd">cat resume</span>      — resume summary');
    tPrint('  <span class="t-cmd">cat skills</span>      — full skill list');
    tPrint('  <span class="t-cmd">cat experience</span>  — work history');
    tPrint('  <span class="t-cmd">cat projects</span>    — projects');
    tPrint('  <span class="t-cmd">ssh contact</span>     — contact info');
    tPrint('  <span class="t-cmd">cd &lt;section&gt;</span>    — scroll to section');
    tPrint('  <span class="t-cmd">neofetch</span>        — system info');
    tPrint('  <span class="t-cmd">sudo hire-me</span>    — ???');
    tPrint('  <span class="t-cmd">clear</span>           — clear terminal');
    tPrint('  <span class="t-cmd">exit</span>            — close terminal');
    tBlank();
  },

  whoami() {
    tBlank();
    tPrint("Samyuktha Wuyyuru", "t-accent");
    tPrint("Backend Engineer · LVL 5", "t-yellow");
    tPrint('Location:  United States');
    tPrint('Status:    <span class="t-success">● Open to Work</span>');
    tPrint("Experience: 3+ years");
    tBlank();
  },

  ls(args) {
    tBlank();
    const normalized = (args || "").replace("skills/", "").trim();
    switch (normalized) {
      case "skills":
        tPrint('<span class="t-cmd">languages/</span>    <span class="t-cmd">cloud/</span>    <span class="t-cmd">datastores/</span>    <span class="t-cmd">system-design/</span>    <span class="t-cmd">ai-ml/</span>');
        break;
      case "languages":
        tPrint('<span class="t-yellow">Python</span>    <span class="t-yellow">Go</span>    <span class="t-yellow">Java</span>    <span class="t-yellow">SQL</span>    <span class="t-yellow">C++</span>    <span class="t-yellow">Bash</span>');
        break;
      case "cloud":
        tPrint('<span class="t-accent">AWS Lambda</span>    <span class="t-accent">S3</span>    <span class="t-accent">ECS</span>    <span class="t-accent">API Gateway</span>    <span class="t-accent">CloudWatch</span>    <span class="t-accent">IAM</span>    <span class="t-accent">Terraform</span>    <span class="t-accent">Docker</span>    <span class="t-accent">CI/CD</span>');
        break;
      case "datastores":
        tPrint('<span class="t-cmd">PostgreSQL</span>    <span class="t-cmd">MySQL</span>    <span class="t-cmd">DynamoDB</span>    <span class="t-cmd">MongoDB</span>    <span class="t-cmd">Redis</span>    <span class="t-cmd">Kafka</span>    <span class="t-cmd">SQS</span>');
        break;
      case "system-design":
        tPrint('<span class="t-success">Idempotency</span>    <span class="t-success">Retry/Backoff</span>    <span class="t-success">Async Workflows</span>    <span class="t-success">Rate Limiting</span>    <span class="t-success">Caching</span>    <span class="t-success">OAuth 2.0</span>');
        break;
      case "ai-ml":
        tPrint('<span class="t-yellow">Transformer Models</span>    <span class="t-yellow">NLP Pipelines</span>    <span class="t-yellow">OpenAI API</span>    <span class="t-yellow">Claude</span>    <span class="t-yellow">Codex</span>');
        break;
      default:
        tPrint('<span class="t-cmd">about/</span>    <span class="t-cmd">story/</span>    <span class="t-cmd">experience/</span>    <span class="t-cmd">projects/</span>    <span class="t-cmd">skills/</span>    <span class="t-cmd">contact/</span>');
    }
    tBlank();
  },

  cat(args) {
    tBlank();
    switch (args) {
      case "resume":
        tPrint("Name:      Samyuktha Wuyyuru");
        tPrint("Role:      Backend Software Engineer");
        tPrint("Exp:       3+ years");
        tPrint("Current:   Qued Inc. (Aug 2024–Present)");
        tPrint("Stack:     Python · Go · AWS · PostgreSQL · Redis");
        tPrint('Download:  <a href="resume.pdf" download style="color:#79c0ff">resume.pdf</a>');
        break;
      case "skills":
        tPrint('Languages:      <span class="t-yellow">Python · Go · Java · SQL · C++ · Bash</span>');
        tPrint("Cloud:          AWS Lambda · S3 · ECS · API Gateway · CloudWatch · IAM · Terraform · Docker");
        tPrint("Databases:      PostgreSQL · MySQL · DynamoDB · MongoDB · Redis · Kafka · SQS");
        tPrint("System Design:  Idempotency · Retry/Backoff · Async · Rate Limiting · Caching · OAuth 2.0");
        tPrint("AI/ML:          Transformer Models · NLP Pipelines · OpenAI API · Claude · Codex");
        break;
      case "experience":
        tPrint('  [1]  <span class="t-accent">Qued Inc.</span>           Software Engineer           Aug 2024–Present');
        tPrint('  [2]  <span class="t-accent">Astek Diagnostics</span>   Software Developer Intern   Jun–Dec 2023');
        tPrint('  [3]  <span class="t-accent">Infosys Ltd.</span>        Associate Software Engineer Dec 2020–Oct 2021');
        break;
      case "projects":
        tPrint('  [RARE]  <span class="t-accent">Expense Workflow Automation</span>   FastAPI · PostgreSQL · Redis · SQS');
        tPrint('  [EPIC]  <span class="t-accent">Chat Emotion Intelligence</span>     Go · Kafka · DynamoDB · Python · OIDC');
        break;
      default:
        tPrint(`cat: ${args || "(missing argument)"}: No such file`, "t-error");
    }
    tBlank();
  },

  ssh(args) {
    tBlank();
    if (args === "contact") {
      tPrint("Establishing connection to samyuktha@portfolio...", "t-muted");
      tPrint('<span class="t-success">Connected!</span>');
      tBlank();
      tPrint('Email:     <a href="mailto:swuyyuru12@gmail.com" style="color:#79c0ff">swuyyuru12@gmail.com</a>');
      tPrint('GitHub:    <a href="https://github.com/swuyyuru24" target="_blank" rel="noreferrer" style="color:#79c0ff">github.com/swuyyuru24</a>');
      tPrint('LinkedIn:  <a href="https://www.linkedin.com/in/samyuktha-wuyyuru/" target="_blank" rel="noreferrer" style="color:#79c0ff">linkedin.com/in/samyuktha-wuyyuru</a>');
    } else {
      tPrint(`ssh: connect to host ${args || "?"} port 22: Connection refused`, "t-error");
    }
    tBlank();
  },

  cd(args) {
    const map = {
      about: "#about", story: "#story", experience: "#experience",
      quests: "#experience", projects: "#projects", skills: "#skills",
      stats: "#skills", approach: "#approach", contact: "#contact",
      passives: "#approach",
    };
    const target = map[args?.toLowerCase()];
    if (target) {
      tPrint(`Navigating to /${args.toLowerCase()}...`, "t-muted");
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
      setTimeout(closeTerminal, 400);
    } else {
      tPrint(`cd: ${args || "(missing argument)"}: No such directory`, "t-error");
      tBlank();
    }
  },

  neofetch() {
    tBlank();
    tPrint('        /\\        <span class="t-accent">samyuktha@portfolio</span>');
    tPrint('       /  \\       <span class="t-muted">──────────────────────</span>');
    tPrint('      / /\\ \\      OS: Portfolio RPG v2025');
    tPrint('     / /  \\ \\     Host: GitHub Pages');
    tPrint('    / / /\\ \\ \\    Shell: Python 3.x · Go 1.22');
    tPrint('   /_/ /  \\_\\_\\   Uptime: 3+ years');
    tPrint('                  Packages: PostgreSQL, Redis, Kafka, Docker');
    tPrint('                  Memory: plenty of stack left');
    tPrint('                  Status: <span class="t-success">● All systems operational</span>');
    tBlank();
  },

  clear() {
    termOutput.innerHTML = "";
  },

  sudo(args) {
    if (args === "hire-me") {
      tPrint("[sudo] password for recruiter: ", "t-muted");
      setTimeout(() => {
        tPrint("Sorry, recruiter is not in the sudoers file.", "t-error");
        tPrint("This incident will be reported.", "t-muted");
        setTimeout(() => {
          tPrint("...just kidding :)", "t-yellow");
          tPrint('Send her an email: <a href="mailto:swuyyuru12@gmail.com" style="color:#79c0ff">swuyyuru12@gmail.com</a>');
          tBlank();
        }, 800);
      }, 700);
    } else {
      tPrint(`sudo: ${args || "(missing argument)"}: command not found`, "t-error");
      tBlank();
    }
  },

  exit: () => closeTerminal(),
  quit: () => closeTerminal(),
};

const processCommand = (raw) => {
  const input = raw.trim();
  if (!input) return;

  // Echo the typed command
  const echo = document.createElement("p");
  echo.className = "t-line t-prompt-line";
  echo.innerHTML = `<span style="color:#7ee787">samyuktha@portfolio:~$</span>&nbsp;${input}`;
  termOutput.appendChild(echo);

  termHistory.unshift(input);
  if (termHistory.length > 80) termHistory.pop();
  termHistoryIdx = -1;

  const parts = input.trim().split(/\s+/);
  const cmd   = parts[0].toLowerCase();
  const args  = parts.slice(1).join(" ");

  if (COMMANDS[cmd]) {
    COMMANDS[cmd](args);
  } else {
    tPrint(`${cmd}: command not found — type <span class="t-cmd">help</span> for available commands.`, "t-error");
    tBlank();
  }

  scrollTermBottom();
};

if (termInput) {
  termInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      processCommand(termInput.value);
      termInput.value = "";
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      termHistoryIdx = Math.min(termHistoryIdx + 1, termHistory.length - 1);
      termInput.value = termHistory[termHistoryIdx] ?? "";
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      termHistoryIdx = Math.max(termHistoryIdx - 1, -1);
      termInput.value = termHistoryIdx === -1 ? "" : termHistory[termHistoryIdx];
    }
    // Prevent T from propagating and re-toggling the terminal
    if (e.key === "t") e.stopPropagation();
  });
}
