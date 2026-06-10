(function () {
  "use strict";

  const STORAGE_KEY = "drsUnitPilotRunOfShow";
  const phases = [
    {
      id: "academy",
      label: "Academy",
      minutes: 60,
      prompt: "Learners work independently. Coach the mental model, not the answer. Confirm each member can explain what the record proves."
    },
    {
      id: "qualification",
      label: "Qualification",
      minutes: 35,
      prompt: "Protect individual work. Require the member to count, reconcile, and explain the result before team assignment."
    },
    {
      id: "team",
      label: "Team Ops",
      minutes: 70,
      prompt: "Assign different missions. Enforce role ownership and pass-device handoffs. Release the FRAGO only after the initial issue is accepted."
    },
    {
      id: "aar",
      label: "AAR",
      minutes: 15,
      prompt: "Ask what changed, what evidence drove the decision, and how the team protected accountability. Capture one retraining action."
    }
  ];

  let tickHandle = null;
  let state = loadState();

  function defaultState() {
    return {
      phaseId: phases[0].id,
      running: false,
      startedAt: null,
      elapsedSeconds: 0,
      completed: []
    };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved || !phases.some((phase) => phase.id === saved.phaseId)) {
        return defaultState();
      }
      return Object.assign(defaultState(), saved, {
        completed: Array.isArray(saved.completed) ? saved.completed : []
      });
    } catch (error) {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function currentPhase() {
    return phases.find((phase) => phase.id === state.phaseId) || phases[0];
  }

  function elapsedSeconds() {
    if (!state.running || !state.startedAt) {
      return state.elapsedSeconds;
    }
    return state.elapsedSeconds + Math.max(0, Math.floor((Date.now() - state.startedAt) / 1000));
  }

  function formatTime(totalSeconds) {
    const sign = totalSeconds < 0 ? "-" : "";
    const absolute = Math.abs(totalSeconds);
    const hours = Math.floor(absolute / 3600);
    const minutes = Math.floor((absolute % 3600) / 60);
    const seconds = absolute % 60;
    const clock = [minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
    return hours ? sign + hours + ":" + clock : sign + clock;
  }

  function phaseIndex() {
    return Math.max(0, phases.findIndex((phase) => phase.id === state.phaseId));
  }

  function setPhase(phaseId) {
    const next = phases.find((phase) => phase.id === phaseId);
    if (!next) return;
    state.phaseId = next.id;
    state.running = false;
    state.startedAt = null;
    state.elapsedSeconds = 0;
    saveState();
    render();
  }

  function startTimer() {
    if (state.running) return;
    state.running = true;
    state.startedAt = Date.now();
    saveState();
    startTicking();
    render();
  }

  function pauseTimer() {
    if (!state.running) return;
    state.elapsedSeconds = elapsedSeconds();
    state.running = false;
    state.startedAt = null;
    saveState();
    stopTicking();
    render();
  }

  function resetTimer() {
    state.running = false;
    state.startedAt = null;
    state.elapsedSeconds = 0;
    saveState();
    stopTicking();
    render();
  }

  function advancePhase() {
    const current = currentPhase();
    if (!state.completed.includes(current.id)) {
      state.completed.push(current.id);
    }
    const nextIndex = Math.min(phases.length - 1, phaseIndex() + 1);
    state.phaseId = phases[nextIndex].id;
    state.running = false;
    state.startedAt = null;
    state.elapsedSeconds = 0;
    saveState();
    stopTicking();
    render();
  }

  function startTicking() {
    if (tickHandle) return;
    tickHandle = window.setInterval(updateDisplay, 1000);
  }

  function stopTicking() {
    if (!tickHandle) return;
    window.clearInterval(tickHandle);
    tickHandle = null;
  }

  function updateDisplay() {
    const card = document.getElementById("facilitatorRunbook");
    if (!card) return;
    const phase = currentPhase();
    const elapsed = elapsedSeconds();
    const target = phase.minutes * 60;
    const remaining = target - elapsed;
    const clock = card.querySelector("[data-runbook-clock]");
    const status = card.querySelector("[data-runbook-status]");
    const progress = card.querySelector("[data-runbook-progress]");
    if (clock) clock.textContent = formatTime(elapsed);
    if (status) {
      status.textContent = remaining >= 0
        ? formatTime(remaining) + " remaining"
        : formatTime(Math.abs(remaining)) + " over target";
      status.dataset.overtime = remaining < 0 ? "true" : "false";
    }
    if (progress) {
      progress.value = Math.min(elapsed, target);
      progress.max = target;
    }
  }

  function runbookMarkup() {
    const phase = currentPhase();
    const buttons = phases.map((item, index) => {
      const active = item.id === phase.id ? " is-current" : "";
      const complete = state.completed.includes(item.id) ? " is-complete" : "";
      const currentAttribute = item.id === phase.id ? ' aria-current="step"' : "";
      return (
        '<button type="button" class="runbook-phase' + active + complete + '" data-runbook-phase="' + item.id + '"' + currentAttribute + ">" +
          '<span class="runbook-phase-number">' + (index + 1) + "</span>" +
          '<span><strong>' + item.label + "</strong><small>" + item.minutes + " min</small></span>" +
        "</button>"
      );
    }).join("");

    return (
      '<section id="facilitatorRunbook" class="facilitator-runbook" aria-labelledby="runbookTitle">' +
        '<div class="runbook-heading">' +
          "<div>" +
            '<p class="runbook-eyebrow">LIVE TRAINING CONTROL</p>' +
            '<h2 id="runbookTitle">Three-hour run-of-show</h2>' +
            "<p>Keep the event on pace while protecting individual mastery and team role ownership.</p>" +
          "</div>" +
          '<span class="runbook-total">180 min</span>' +
        "</div>" +
        '<div class="runbook-phases" role="list" aria-label="Training day phases">' + buttons + "</div>" +
        '<div class="runbook-console">' +
          '<div class="runbook-clock-block">' +
            '<span class="runbook-label">Elapsed</span>' +
            '<strong class="runbook-clock" data-runbook-clock>00:00</strong>' +
            '<span class="runbook-status" data-runbook-status></span>' +
          "</div>" +
          '<div class="runbook-guidance">' +
            '<span class="runbook-label">Facilitator prompt</span>' +
            "<strong>" + phase.label + "</strong>" +
            "<p>" + phase.prompt + "</p>" +
          "</div>" +
        "</div>" +
        '<progress class="runbook-progress" data-runbook-progress value="0" max="' + (phase.minutes * 60) + '">0%</progress>' +
        '<div class="runbook-actions">' +
          '<button type="button" class="button button-primary" data-runbook-action="' + (state.running ? "pause" : "start") + '">' +
            (state.running ? "Pause phase" : "Start phase") +
          "</button>" +
          '<button type="button" class="button button-secondary" data-runbook-action="reset">Reset phase</button>' +
          '<button type="button" class="button button-secondary" data-runbook-action="advance">Complete and advance</button>' +
        "</div>" +
        '<p class="runbook-note">This timer is a facilitator aid. It does not change learner scores, unlock content, or reveal answer keys.</p>' +
      "</section>"
    );
  }

  function mount() {
    const facilitator = document.getElementById("facilitator");
    if (!facilitator) return;
    let card = document.getElementById("facilitatorRunbook");
    if (!card) {
      facilitator.insertAdjacentHTML("afterbegin", runbookMarkup());
      card = document.getElementById("facilitatorRunbook");
    }
    if (card) {
      card.hidden = !facilitator.classList.contains("active");
      updateDisplay();
    }
    if (state.running) startTicking();
  }

  document.addEventListener("click", function (event) {
    const phaseButton = event.target.closest("[data-runbook-phase]");
    if (phaseButton) {
      setPhase(phaseButton.dataset.runbookPhase);
      return;
    }
    const actionButton = event.target.closest("[data-runbook-action]");
    if (!actionButton) return;
    const action = actionButton.dataset.runbookAction;
    if (action === "start") startTimer();
    if (action === "pause") pauseTimer();
    if (action === "reset") resetTimer();
    if (action === "advance") advancePhase();
  });

  function render() {
    const existing = document.getElementById("facilitatorRunbook");
    if (existing) existing.remove();
    mount();
  }

  document.addEventListener("DOMContentLoaded", mount);
  window.addEventListener("storage", function (event) {
    if (event.key !== STORAGE_KEY) return;
    state = loadState();
    render();
  });

  const observer = new MutationObserver(function () {
    mount();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
    childList: true,
    subtree: true
  });
})();
