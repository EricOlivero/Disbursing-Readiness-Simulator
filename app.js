const DATA = window.DRS_DATA || {};
const $ = (id) => document.getElementById(id);
const money = (n) => Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
const whole = (n) => Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });

const baseState = {
  scenarioId: "market",
  profile: "",
  mode: "Individual",
  lesson: 0,
  eventIndex: 0,
  usd: 4000,
  zd: 240000,
  supportedUsd: 0,
  stress: 0,
  errors: [],
  ledger: [],
  flags: [],
  briefed: false,
  completedLessons: {},
  trainingComplete: false,
  missionStarted: false,
  teamChecks: {},
  injectChecks: {},
  team: {
    commander: "",
    budget: "",
    ddo: "",
    da: "",
    cashier: "",
    payingAgent: ""
  },
  roleStep: 0,
  roleStepsDone: [],
  disclaimerAccepted: false,
  aar: null
};

const storedState = JSON.parse(localStorage.getItem("drsPolishedState") || "null");
const state = Object.assign({}, baseState, storedState || {});
state.completedLessons = state.completedLessons || {};
state.teamChecks = state.teamChecks || {};
state.injectChecks = state.injectChecks || {};
state.ledger = state.ledger || [];
state.flags = state.flags || [];
state.errors = state.errors || [];

function save() {
  localStorage.setItem("drsPolishedState", JSON.stringify(state));
}

function scenarios() {
  if (Array.isArray(DATA.scenarios)) return DATA.scenarios;
  if (DATA.scenarios && typeof DATA.scenarios === "object") return Object.values(DATA.scenarios);
  return [];
}

function scenario() {
  return scenarios().find((item) => item.id === state.scenarioId) || scenarios()[0] || {};
}

function lessons() {
  return Array.isArray(DATA.lessons) ? DATA.lessons : [];
}

function events() {
  const active = scenario();
  return Array.isArray(active.events) ? active.events : [];
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value == null ? "" : value;
}

function setHtml(id, value) {
  const el = $(id);
  if (el) el.innerHTML = value == null ? "" : value;
}

function show(id) {
  recomputeTrainingComplete();
  if (!state.disclaimerAccepted && id !== "disclaimerGate") {
    id = "disclaimerGate";
  }

  const gate = $("disclaimerGate");
  if (gate) {
    const isGate = id === "disclaimerGate";
    gate.classList.toggle("active", isGate);
    gate.hidden = !isGate;
    gate.style.display = isGate ? "" : "none";
  }

  const gatedScreens = ["mission", "inject", "closeout", "aar"];
  if (gatedScreens.includes(id) && !state.trainingComplete) {
    state.trainingGateMessage = "Mission locked. Complete all Training Bay blocks first so the team understands DD 1081, DD 2665, rates, closeout, and OPORD execution.";
    id = "training";
  }

  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === id);
  });

  document.querySelectorAll("[data-nav]").forEach((btn) => {
    const target = btn.getAttribute("data-nav");
    btn.classList.toggle("active", target === id);
    const locked = ["mission", "inject", "closeout", "aar"].includes(target) && !state.trainingComplete;
    btn.classList.toggle("locked", locked);
    if (locked) btn.setAttribute("aria-disabled", "true");
    else btn.removeAttribute("aria-disabled");
  });

  save();
  renderAll();
}

function ensureTrainingProgressCard() {
  if ($("trainingProgressCard")) return;
  const anchor = $("lessonCounter")?.closest(".card") || $("training");
  if (!anchor || !$("training")) return;

  const card = document.createElement("div");
  card.id = "trainingProgressCard";
  card.className = "card training-progress-card";
  card.innerHTML = `
    <span class="eyebrow">3-hour training day path</span>
    <div class="progress-head">
      <strong id="trainingProgressText">Training locked mission</strong>
      <span id="trainingGateBadge" class="pill">Mission locked</span>
    </div>
    <div class="progress-track"><span id="trainingProgressBar"></span></div>
    <p id="trainingGateNote">Complete the learning blocks first. Then move to the mission board as a team.</p>
  `;
  anchor.parentNode.insertBefore(card, anchor);
}

function ensureHomeStatus() {
  if ($("missionLockStatus")) return;
  const target = document.querySelector(".learn-first-card") || document.querySelector("[data-action='start-demo']")?.parentElement;
  if (!target) return;
  const note = document.createElement("p");
  note.id = "missionLockStatus";
  note.className = "mission-lock-status";
  note.textContent = "Mission locked until Training Bay is complete.";
  target.appendChild(note);
}

function lessonCompleteCount() {
  return lessons().filter((lesson) => state.completedLessons[lesson.id]).length;
}

function recomputeTrainingComplete() {
  state.trainingComplete = lessons().length > 0 && lessonCompleteCount() >= lessons().length;
  return state.trainingComplete;
}

function renderHome() {
  recomputeTrainingComplete();
  ensureHomeStatus();
  const active = scenario();
  setText("profileName", state.profile || "Guest learner");
  setText("homeMode", state.mode || "Individual");
  setText("missionTitle", active.title || "Operation Market Run");
  setText("missionMeta", active.meta || active.level || "Intermediate disbursing team mission");
  setText("missionSummary", active.summary || "Complete training, read the OPORD, handle injects, and close out cash accountability.");
  setText("missionLockStatus", state.trainingComplete ? "Mission unlocked. Teams may deploy after the mission brief." : "Mission locked. Complete Training Bay before deploying.");

  const start = document.querySelector("[data-action='start-demo']");
  if (start) {
    start.textContent = state.trainingComplete ? "Start Team Mission" : "Begin Training First";
    start.classList.toggle("locked-cta", !state.trainingComplete);
  }
}

function renderTraining() {
  ensureTrainingProgressCard();
  recomputeTrainingComplete();

  const allLessons = lessons();
  if (lessonCompleteCount() === 0 && state.lesson > 0) {
    state.lesson = 0;
    save();
  }
  const active = allLessons[state.lesson] || allLessons[0] || {};
  const complete = !!state.completedLessons[active.id];
  const count = lessonCompleteCount();
  const total = allLessons.length || 1;
  const pct = Math.round((count / total) * 100);

  setText("trainingProgressText", `${count}/${total} learning blocks complete`);
  const bar = $("trainingProgressBar");
  if (bar) bar.style.width = `${pct}%`;
  setText("trainingGateBadge", state.trainingComplete ? "Mission unlocked" : "Mission locked");
  setText("trainingGateNote", state.trainingGateMessage || (state.trainingComplete
    ? "Training complete. Move to the mission board, brief the team, and execute the scenario."
    : "Complete every block before the mission unlocks. This keeps the app from becoming a guessing game."));
  state.trainingGateMessage = "";

  setText("lessonCounter", `Block ${Math.min(state.lesson + 1, total)} of ${total}`);
  setText("lessonTitle", active.title || "Training Bay");
  setHtml("lessonBody", paragraphs(active.body || active.content || ""));
  setHtml("lessonWhy", paragraphs(active.why || ""));
  setHtml("lessonDo", list(active.do || active.actions || []));
  setHtml("lessonFailure", list(active.failure || active.failureSigns || []));
  setText("lessonPrompt", active.prompt || "What should the member do before moving on?");

  const choices = $("lessonChoices");
  if (choices) {
    choices.innerHTML = "";
    (active.choices || []).forEach((choice, index) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.type = "button";
      btn.dataset.lessonChoice = String(index);
      btn.innerHTML = `<strong>${choice.label || choice.text || `Option ${index + 1}`}</strong><span>${choice.detail || ""}</span>`;
      choices.appendChild(btn);
    });
  }

  setText("lessonFeedback", complete ? "Block complete. You can review it again or continue through the remaining blocks." : "");
  renderTrainingObjectives();
  renderLab(active);
}

function renderTrainingObjectives() {
  const target = $("trainingObjectives");
  if (!target) return;

  const objectiveText = {
    "accountability-stack": "Explain who is accountable for funds at each point.",
    "dd1081-purpose": "Explain what DD 1081 proves during advance and return.",
    "dd2665-purpose": "Explain what DD 2665 summarizes during daily accountability.",
    "voucher-support": "Identify whether a payment packet is supportable.",
    "foreign-currency": "Choose and explain the directed currency rate.",
    "opord-frago": "Read an OPORD/FRAGO before cash movement.",
    "tccc-accountability": "Respond to an inject without losing life-safety or cash accountability.",
    "closeout-ritual": "Balance cash using count, support, and explanation.",
    "readiness-check": "Brief the minimum standard before team mission execution."
  };

  target.innerHTML = lessons().map((lesson, index) => {
    const done = !!state.completedLessons[lesson.id];
    const active = index === state.lesson;
    return `
      <button type="button" class="objective-item ${done ? "done" : ""} ${active ? "active" : ""}" data-lesson-jump="${index}">
        <span>${done ? "Complete" : active ? "Current" : `Block ${index + 1}`}</span>
        <strong>${escapeHtml(lesson.title || `Block ${index + 1}`)}</strong>
        <em>${escapeHtml(objectiveText[lesson.id] || "Complete this learning objective before mission.")}</em>
      </button>
    `;
  }).join("");
}

function paragraphs(value) {
  if (Array.isArray(value)) return value.map((item) => `<p>${escapeHtml(item)}</p>`).join("");
  return String(value || "").split("\n").filter(Boolean).map((item) => `<p>${escapeHtml(item)}</p>`).join("");
}

function list(value) {
  const items = Array.isArray(value) ? value : String(value || "").split("\n").filter(Boolean);
  return `<ul>${items.map((item) => `<li>${escapeHtml(String(item).replace(/^- /, ""))}</li>`).join("")}</ul>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function renderLab(active) {
  const lab = $("labContent");
  if (!lab) return;
  const labData = active.lab || {};
  if (labData.type === "form") {
    lab.innerHTML = `
      <div class="mini-form">
        <strong>${escapeHtml(labData.title || "Form purpose check")}</strong>
        <p>${escapeHtml(labData.prompt || "Identify what this form proves and what number must agree.")}</p>
        ${(labData.rows || []).map((row) => `
          <label>${escapeHtml(row.label || "Line item")}
            <input value="${escapeHtml(row.value || "")}" readonly>
          </label>
        `).join("")}
      </div>
    `;
    return;
  }
  if (labData.type === "rate") {
    lab.innerHTML = `
      <div class="mini-form">
        <strong>${escapeHtml(labData.title || "Rate selection drill")}</strong>
        <p>${escapeHtml(labData.prompt || "Decide which rate applies and explain why.")}</p>
        <div class="rate-grid">
          ${(labData.rates || []).map((rate) => `<span>${escapeHtml(rate)}</span>`).join("")}
        </div>
      </div>
    `;
    return;
  }
  lab.innerHTML = `
    <div class="mini-form">
      <strong>${escapeHtml(labData.title || "Apply it")}</strong>
      <p>${escapeHtml(labData.prompt || "Say out loud what you would verify before signing or handing off funds.")}</p>
    </div>
  `;
}

function completeLesson(choiceIndex) {
  const allLessons = lessons();
  const active = allLessons[state.lesson] || {};
  const choice = (active.choices || [])[choiceIndex] || {};
  const correct = !!choice.correct;
  const feedback = $("lessonFeedback");

  if (!correct) {
    state.errors.push(`${active.title || "Training"}: ${choice.feedback || "Incorrect training decision."}`);
    if (feedback) feedback.textContent = choice.feedback || "Slow down. The right answer should protect accountability and explain the form purpose.";
    save();
    return;
  }

  state.completedLessons[active.id] = true;
  recomputeTrainingComplete();
  if (feedback) feedback.textContent = choice.feedback || "Correct. That is the standard you need before mission execution.";

  if (!state.trainingComplete) {
    const nextIndex = allLessons.findIndex((lesson, index) => index > state.lesson && !state.completedLessons[lesson.id]);
    state.lesson = nextIndex >= 0 ? nextIndex : (state.lesson + 1) % allLessons.length;
  }

  save();
  renderTraining();
}

function loadScenario(id, resetMission = false) {
  state.scenarioId = id || state.scenarioId;
  const active = scenario();
  if (resetMission) {
    state.eventIndex = 0;
    state.usd = active.startingUsd || 4000;
    state.zd = active.startingZd || 240000;
    state.supportedUsd = 0;
    state.stress = 0;
    state.errors = [];
    state.ledger = [];
    state.flags = [];
    state.briefed = false;
    state.teamChecks = {};
    state.injectChecks = {};
    state.roleStep = 0;
    state.roleStepsDone = [];
    state.aar = null;
    state.missionStarted = true;
  }
  save();
}

function renderMission() {
  const active = scenario();
  const event = events()[state.eventIndex] || {};
  setText("statusThreat", active.threat || "Moderate");
  setText("statusTime", active.time || "D+0 / 0900L");
  setText("statusFunds", `${money(state.usd)} / ${whole(state.zd)} ZD`);
  setText("statusComms", active.comms || "Intermittent");
  setText("opordTitle", active.opordTitle || active.title || "Mission OPORD");
  setHtml("opordText", opordMarkup(active.opord || active.brief || ""));
  renderTimeline();
  renderEvent(event);
  renderLedger();
  renderTeamChecks();
}

function opordMarkup(value) {
  const text = Array.isArray(value) ? value.join("\n") : String(value || "");
  return text.split("\n").filter(Boolean).map((line) => {
    const clean = escapeHtml(line);
    return /^\d\./.test(line.trim()) ? `<h3>${clean}</h3>` : `<p>${clean}</p>`;
  }).join("");
}

function renderTimeline() {
  const timeline = $("timeline");
  if (!timeline) return;
  timeline.innerHTML = events().map((item, index) => `
    <button class="${index === state.eventIndex ? "active" : ""}" type="button" data-event-jump="${index}">
      <span>${index + 1}</span>${escapeHtml(item.title || item.type || "Event")}
    </button>
  `).join("");
}

function renderEvent(event) {
  setText("eventTitle", event.title || "Mission event");
  setText("eventType", event.type || "Disbursing decision");
  setText("eventNarrative", event.narrative || event.description || "Review the prompt and select the action that protects accountability.");
  setText("eventQuestion", event.question || "What do you do?");

  const choices = $("eventChoices");
  if (!choices) return;
  choices.innerHTML = "";
  (event.choices || []).forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.type = "button";
    btn.dataset.eventChoice = String(index);
    btn.innerHTML = `<strong>${choice.label || choice.text || `Decision ${index + 1}`}</strong><span>${choice.detail || ""}</span>`;
    choices.appendChild(btn);
  });
}

function chooseEvent(index) {
  const event = events()[state.eventIndex] || {};
  const choice = (event.choices || [])[index] || {};
  const confidence = $("confidence")?.value || "medium";
  const correct = !!choice.correct;

  if (correct) {
    state.supportedUsd += Number(choice.supportedUsd || event.supportedUsd || 0);
    state.usd += Number(choice.usdDelta || 0);
    state.zd += Number(choice.zdDelta || 0);
  } else {
    state.stress += Number(choice.stress || 10);
    state.errors.push(`${event.title || "Mission event"}: ${choice.feedback || "Decision did not protect accountability."}`);
  }

  state.ledger.push({
    time: event.time || `Event ${state.eventIndex + 1}`,
    event: event.title || "Mission event",
    decision: choice.label || choice.text || "Decision recorded",
    result: correct ? "Supported" : "Finding",
    confidence
  });

  state.eventIndex = Math.min(state.eventIndex + 1, Math.max(events().length - 1, 0));
  save();
  renderMission();
}

function renderLedger() {
  const ledger = $("ledger");
  if (!ledger) return;
  ledger.innerHTML = state.ledger.length ? state.ledger.map((row) => `
    <li>
      <strong>${escapeHtml(row.time)}</strong>
      <span>${escapeHtml(row.event)} - ${escapeHtml(row.decision)}</span>
      <em>${escapeHtml(row.result)} / ${escapeHtml(row.confidence)}</em>
    </li>
  `).join("") : "<li>No mission decisions recorded yet.</li>";
}

function renderTeamChecks() {
  const target = $("teamChecks");
  if (!target) return;
  const checks = [
    ["commander", "Commander states intent and risk acceptance."],
    ["budget", "Budget Officer confirms purpose, limit, and LOA."],
    ["ddo", "DDO validates funds advanced and accountability chain."],
    ["da", "DA confirms DD 1081 handoff and agent responsibilities."],
    ["cashier", "Cashier counts cash, prepares DD 2665 closeout expectations."],
    ["payingAgent", "Paying Agent repeats purchase rules, rate, and receipt standard."]
  ];
  target.innerHTML = checks.map(([key, label]) => `
    <label class="check-row">
      <input type="checkbox" data-team-check="${key}" ${state.teamChecks[key] ? "checked" : ""}>
      <span>${label}</span>
    </label>
  `).join("");
}

function renderInject() {
  const active = scenario();
  const inject = active.inject || (DATA.injects || [])[0] || {};
  setText("injectTitle", inject.title || "TCCC / movement inject");
  setText("injectNarrative", inject.narrative || "A tactical disruption occurs. Stabilize, communicate, and preserve accountability without exceeding your training scope.");
  const listTarget = $("injectChecklist");
  if (listTarget) {
    const items = inject.checklist || [
      "Move only when safe and directed.",
      "Call for help and communicate location.",
      "Apply trained TCCC basics within scope.",
      "Secure cash, vouchers, and DD 1081 chain of custody.",
      "Document interruption and resume only when cleared."
    ];
    listTarget.innerHTML = items.map((item, index) => `
      <label class="check-row">
        <input type="checkbox" data-inject-check="${index}" ${state.injectChecks[index] ? "checked" : ""}>
        <span>${escapeHtml(item)}</span>
      </label>
    `).join("");
  }
}

function physicalUsd() {
  return Number(state.usd || 0);
}

function physicalZd() {
  return Number(state.zd || 0);
}

function renderCloseout() {
  renderDrawers();
  setText("physicalUsd", money(physicalUsd()));
  setText("physicalZd", `${whole(physicalZd())} ZD`);
  setText("supportedUsd", money(state.supportedUsd));
  setText("closeoutFindings", state.errors.length ? `${state.errors.length} finding(s) require explanation.` : "No findings yet. Explain the result and cite the supporting forms.");
}

function renderDrawers() {
  const drawer = $("drawer");
  if (!drawer) return;
  const denominations = [
    ["100", 100],
    ["50", 50],
    ["20", 20],
    ["10", 10],
    ["5", 5],
    ["1", 1]
  ];
  drawer.innerHTML = denominations.map(([label, value]) => `
    <label>${label}
      <input type="number" min="0" data-denom="${value}" placeholder="0">
    </label>
  `).join("");
}

function submitAar() {
  const findings = [...state.errors];
  const roleChecks = Object.values(state.teamChecks || {}).filter(Boolean).length;
  const injectChecks = Object.values(state.injectChecks || {}).filter(Boolean).length;
  const decisionCount = state.ledger.length;

  if (!state.trainingComplete) findings.push("Training Bay was not completed before mission execution.");
  if (!state.briefed) findings.push("Team did not mark OPORD brief complete before execution.");
  if (roleChecks < 5) findings.push("Team role cross-check was incomplete.");
  if (injectChecks < 4) findings.push("TCCC/accountability interruption checklist was incomplete.");
  if (decisionCount < events().length) findings.push("Mission timeline was not fully executed.");

  const ready = findings.length === 0;
  state.aar = {
    level: ready ? "Intermediate ready" : "Needs remediation",
    findings,
    positives: [
      state.trainingComplete ? "Completed the full form/rate/closeout learning path." : "Started the learning path.",
      decisionCount ? "Recorded decisions in the mission ledger." : "Mission ledger needs more evidence.",
      state.supportedUsd ? `Supported ${money(state.supportedUsd)} in mission activity.` : "Needs supported transaction evidence."
    ]
  };
  save();
  renderAar();
}

function renderAar() {
  const aar = state.aar;
  setText("aarLevel", aar ? aar.level : "AAR not submitted");
  setHtml("aarFindings", aar ? list(aar.findings.length ? aar.findings : ["No critical findings."]) : list(["Complete the mission and closeout first."]));
  setHtml("aarPositives", aar ? list(aar.positives) : list(["No positives recorded yet."]));
}

function renderAll() {
  renderHome();
  renderTraining();
  if (state.trainingComplete) {
    renderMission();
    renderInject();
    renderCloseout();
    renderAar();
  }
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-nav]");
  if (nav) {
    event.preventDefault();
    show(nav.getAttribute("data-nav"));
    return;
  }

  const action = event.target.closest("[data-action]")?.getAttribute("data-action");
  if (action === "start-demo") {
    event.preventDefault();
    if (!state.trainingComplete) {
      state.trainingGateMessage = "Start here. The mission board unlocks after all Training Bay blocks are complete.";
      show("training");
      return;
    }
    state.mode = "Same-device team";
    loadScenario("market", true);
    show("mission");
    return;
  }
  if (action === "mark-briefed") {
    state.briefed = true;
    save();
    renderMission();
    return;
  }
  if (action === "next-lesson") {
    state.lesson = Math.min(state.lesson + 1, Math.max(lessons().length - 1, 0));
    save();
    renderTraining();
    return;
  }
  if (action === "previous-lesson") {
    state.lesson = Math.max(state.lesson - 1, 0);
    save();
    renderTraining();
    return;
  }
  if (action === "restart-training") {
    state.lesson = 0;
    state.completedLessons = {};
    state.trainingComplete = false;
    state.trainingGateMessage = "Training restarted. Begin with Block 1 and complete each objective before mission.";
    save();
    show("training");
    return;
  }
  if (action === "submit-aar") {
    submitAar();
    show("aar");
    return;
  }
  if (action === "replay") {
    loadScenario(state.scenarioId, true);
    show("mission");
    return;
  }

  const lessonChoice = event.target.closest("[data-lesson-choice]");
  if (lessonChoice) {
    completeLesson(Number(lessonChoice.dataset.lessonChoice));
    return;
  }

  const lessonJump = event.target.closest("[data-lesson-jump]");
  if (lessonJump) {
    state.lesson = Number(lessonJump.dataset.lessonJump);
    save();
    renderTraining();
    return;
  }

  const eventChoice = event.target.closest("[data-event-choice]");
  if (eventChoice) {
    chooseEvent(Number(eventChoice.dataset.eventChoice));
    return;
  }

  const jump = event.target.closest("[data-event-jump]");
  if (jump) {
    state.eventIndex = Number(jump.dataset.eventJump);
    save();
    renderMission();
  }
});

document.addEventListener("change", (event) => {
  const teamCheck = event.target.closest("[data-team-check]");
  if (teamCheck) {
    state.teamChecks[teamCheck.dataset.teamCheck] = teamCheck.checked;
    save();
  }

  const injectCheck = event.target.closest("[data-inject-check]");
  if (injectCheck) {
    state.injectChecks[injectCheck.dataset.injectCheck] = injectCheck.checked;
    save();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "profileInput") {
    state.profile = event.target.value;
    save();
    renderHome();
  }
});

if ($("acceptDisclaimer")) {
  $("acceptDisclaimer").addEventListener("click", () => {
    const ack = $("disclaimerAck");
    if (ack && !ack.checked) return;
    state.disclaimerAccepted = true;
    save();
    const gate = $("disclaimerGate");
    if (gate) {
      gate.hidden = true;
      gate.style.display = "none";
      gate.classList.remove("active");
    }
    show("home");
  });
}

if (!state.disclaimerAccepted) {
  show("disclaimerGate");
} else {
  show("home");
}
