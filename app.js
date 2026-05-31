const DATA = window.DRS_DATA;
const $ = (id) => document.getElementById(id);
const money = (n) => Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
const whole = (n) => Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });

const state = JSON.parse(localStorage.getItem("drsPolishedState") || "null") || {
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
  flags: {},
  briefed: false,
  teamChecks: {},
  injectChecks: {},
  team: { name: "", cashier: "", recorder: "", reviewer: "", chief: "", safety: "" },
  roleStep: 0,
  roleStepsDone: {},
  disclaimerAccepted: false,
  aar: "",
};

const TEAM_ROLES = [
  { key: "cashier", title: "Cashier", prompt: "Confirm physical cash and keep USD/ZD accountability separate." },
  { key: "recorder", title: "Recorder", prompt: "Confirm transaction log, voucher packet, FRAGO note, and exchange slip." },
  { key: "reviewer", title: "Reviewer", prompt: "Challenge support status, rate selection, and DD 1081/DD 2665 entries." },
  { key: "chief", title: "Team Chief", prompt: "Confirm escalation plan and final go/no-go before closeout." },
  { key: "safety", title: "TCCC/Safety Lead", prompt: "Confirm inject response, funds security, and accountability recovery." },
];

function scenario() {
  return DATA.scenarios.find((item) => item.id === state.scenarioId) || DATA.scenarios[0];
}

function save() {
  localStorage.setItem("drsPolishedState", JSON.stringify(state));
}

function show(screen) {
  document.querySelectorAll(".screen").forEach((item) => item.classList.toggle("active-screen", item.id === screen));
  document.querySelectorAll(".bottom-nav button").forEach((item) => item.classList.toggle("active", item.dataset.nav === screen));
}

function renderHome() {
  const s = scenario();
  $("homeMissionTitle").textContent = s.title;
  $("homeMissionSummary").textContent = s.summary;
  $("profileName").value = state.profile;
  $("modeSelect").value = state.mode;
  $("teamName").value = state.team.name || "";
  $("roleCashier").value = state.team.cashier || "";
  $("roleRecorder").value = state.team.recorder || "";
  $("roleReviewer").value = state.team.reviewer || "";
  $("roleChief").value = state.team.chief || "";
  $("roleSafety").value = state.team.safety || "";
  const configured = ["cashier", "recorder", "reviewer", "chief", "safety"].filter((key) => state.team[key]).length;
  $("teamStatus").textContent = configured === 5 ? `${state.team.name || "Team"} configured for same-device team mode.` : `Team setup ${configured}/5 roles assigned.`;
  $("scenarioSelect").innerHTML = DATA.scenarios.map((item) => `<option value="${item.id}">${item.title}</option>`).join("");
  $("scenarioSelect").value = state.scenarioId;
  $("stackMoney").textContent = state.eventIndex ? "in motion" : "pending";
  $("stackDocs").textContent = state.flags.unsupportedFound ? "issue found" : "packet review";
}

function renderTraining() {
  const lesson = DATA.lessons[state.lesson];
  $("lessonCounter").textContent = `${String(state.lesson + 1).padStart(2, "0")} / ${DATA.lessons.length}`;
  $("lessonTitle").textContent = lesson.title;
  $("lessonBody").textContent = lesson.body;
  $("lessonWhy").textContent = lesson.why;
  $("lessonDo").textContent = lesson.do;
  $("lessonFailure").textContent = lesson.failure;
  $("lessonPrompt").textContent = lesson.prompt;
  $("lessonChoices").innerHTML = lesson.choices
    .map((choice, index) => `<button data-lesson-choice="${index}">${choice}</button>`)
    .join("");
}

function renderLab(type = "settlement") {
  const labs = {
    settlement: `<p>$4,000 advance. $1,200 supported payments. Enter returned cash.</p><input id="labAnswer" type="number" placeholder="2800" /><button class="secondary" data-action="check-lab" data-answer="2800">Check</button><p id="labFeedback" class="feedback"></p>`,
    sorter: `<p>A $25 correction collection should be classified as:</p><div class="choice-list"><button data-lab-choice="wrong">Decrease</button><button data-lab-choice="right">Increase</button><button data-lab-choice="wrong">No effect</button></div><p id="labFeedback" class="feedback"></p>`,
    packet: `<p>Select the item that should stop clean closeout.</p><div class="choice-list"><button data-lab-choice="wrong">Vendor A receipt OK</button><button data-lab-choice="wrong">Exchange slip OK</button><button data-lab-choice="right">Vendor C receipt missing</button></div><p id="labFeedback" class="feedback"></p>`,
  };
  $("labContent").innerHTML = labs[type];
}

function renderMission() {
  const s = scenario();
  $("statusThreat").textContent = s.status.threat;
  $("statusTime").textContent = s.status.time;
  $("statusFunds").textContent = s.status.funds;
  $("statusComms").textContent = s.status.comms;
  $("opordTitle").textContent = s.title;
  $("opordText").textContent = s.opord;
  $("briefStatus").textContent = state.briefed ? "Briefing reviewed." : "Briefing not reviewed.";
  $("briefButton").disabled = state.briefed;
  $("stressScore").textContent = state.stress;
  renderTimeline();
  renderEvent();
  renderLedger();
  renderTeamChecks();
}

function renderTimeline() {
  const s = scenario();
  $("timeline").innerHTML = s.events
    .map((_, i) => `<div class="dot ${i < state.eventIndex ? "done" : ""} ${state.errors[i] ? "error" : ""}">${i + 1}</div>`)
    .join("");
}

function renderEvent() {
  const s = scenario();
  const event = s.events[state.eventIndex];
  if (!event) {
    $("eventCount").textContent = "Mission complete";
    $("eventTitle").textContent = "Proceed to Closeout";
    $("eventDetail").textContent = "All mission decisions are complete. Count cash, inspect packet, and submit AAR.";
    $("eventChoices").innerHTML = `<button data-nav="closeout">Go to Closeout</button>`;
    return;
  }
  $("eventCount").textContent = `Decision ${state.eventIndex + 1} / ${s.events.length}`;
  $("eventTitle").textContent = event.title;
  $("eventDetail").textContent = event.detail;
  $("eventChoices").innerHTML = event.choices
    .map((choice, i) => `<button class="${choice.correct ? "" : "risky"}" data-event-choice="${i}">${choice.label}</button>`)
    .join("");
}

function chooseEvent(index) {
  const event = scenario().events[state.eventIndex];
  const choice = event.choices[index];
  const confidence = $("confidenceSelect").value;
  const before = { usd: state.usd, zd: state.zd, supportedUsd: state.supportedUsd };
  if (choice.correct) {
    state.usd += choice.delta?.usd || 0;
    state.zd += choice.delta?.zd || 0;
    state.supportedUsd += choice.delta?.supportedUsd || 0;
    if (choice.flag) state.flags[choice.flag] = true;
  } else {
    state.errors[state.eventIndex] = choice.error || "GEN-001";
    state.stress += confidence === "High" ? 3 : 2;
    state.usd += choice.delta?.usd || 0;
    state.zd += choice.delta?.zd || 0;
  }
  state.stress += 1;
  state.ledger.push({
    event: event.title,
    decision: choice.label,
    result: choice.correct ? "Correct" : "Error",
    confidence,
    usdDelta: state.usd - before.usd,
    zdDelta: state.zd - before.zd,
    supportDelta: state.supportedUsd - before.supportedUsd,
    note: choice.note,
  });
  state.eventIndex += 1;
  $("missionCoach").textContent = choice.note;
  save();
  renderMission();
  renderCloseout();
}

function renderLedger() {
  $("usdBalance").textContent = money(state.usd);
  $("zdBalance").textContent = whole(state.zd);
  $("supportBalance").textContent = `${money(state.supportedUsd)} eq`;
  $("ledgerHistory").innerHTML = state.ledger.length
    ? state.ledger.map((row) => `<div class="ledger-row"><strong>${row.event}</strong>${row.result}, ${row.confidence} confidence | USD ${money(row.usdDelta)} | ZD ${whole(row.zdDelta)}</div>`).join("")
    : "No decisions yet.";
}

function renderTeamChecks() {
  const checks = ["Cashier confirms cash by currency", "Recorder confirms transaction log and packet", "Reviewer confirms support/rate issues", "Team chief confirms escalation", "TCCC/safety confirms inject recovery"];
  $("teamChecks").innerHTML = checks
    .map((label, i) => `<label><input type="checkbox" data-team-check="${i}" ${state.teamChecks[i] ? "checked" : ""}/> ${label}</label>`)
    .join("");
  const active = TEAM_ROLES[state.roleStep] || TEAM_ROLES[0];
  $("activeRoleTitle").textContent = `${active.title}${state.team[active.key] ? `: ${state.team[active.key]}` : ""}`;
  $("activeRolePrompt").textContent = active.prompt;
  $("roleProgress").innerHTML = TEAM_ROLES.map((role) => `<div class="${state.roleStepsDone[role.key] ? "done" : ""}"></div>`).join("");
}

function renderInject() {
  const inj = scenario().inject;
  $("injectTitle").textContent = inj.title;
  $("injectHeadline").textContent = inj.headline;
  $("injectBody").textContent = inj.body;
  const checks = ["Act within trained scope", "Request help and communicate", "Secure cash box and packet if possible", "Recover accountability before closeout"];
  $("injectChecks").innerHTML = checks
    .map((label, i) => `<label><input type="checkbox" data-inject-check="${i}" ${state.injectChecks[i] ? "checked" : ""}/> ${label}</label>`)
    .join("");
}

function renderDrawers() {
  const usdDenoms = [100, 50, 20, 10, 5, 1];
  const zdDenoms = [50000, 10000, 5000, 1000];
  $("usdDrawer").innerHTML = usdDenoms.map((d) => `<div class="denom"><span>$${d}</span><input data-usd-denom="${d}" type="number" min="0" value="0"/></div>`).join("");
  $("zdDrawer").innerHTML = zdDenoms.map((d) => `<div class="denom"><span>${whole(d)} ZD</span><input data-zd-denom="${d}" type="number" min="0" value="0"/></div>`).join("");
}

function physicalUsd() {
  return [...document.querySelectorAll("[data-usd-denom]")].reduce((sum, input) => sum + Number(input.dataset.usdDenom) * Number(input.value || 0), 0);
}
function physicalZd() {
  return [...document.querySelectorAll("[data-zd-denom]")].reduce((sum, input) => sum + Number(input.dataset.zdDenom) * Number(input.value || 0), 0);
}

function renderCloseout() {
  $("expectedUsd").textContent = money(state.usd);
  $("expectedZd").textContent = whole(state.zd);
  $("physicalUsd").textContent = money(physicalUsd());
  $("physicalZd").textContent = whole(physicalZd());
  $("usdVariance").textContent = money(physicalUsd() - state.usd);
  $("zdVariance").textContent = whole(physicalZd() - state.zd);
  $("packetList").innerHTML = scenario().packet.map((item) => `<div class="packet-item ${item.status === "missing" ? "missing" : ""}">${item.label}</div>`).join("");
}

function submitAar() {
  const usdVar = physicalUsd() - state.usd;
  const zdVar = physicalZd() - state.zd;
  const returnedUsd = Number($("returnUsd").value);
  const returnedZd = Number($("returnZd").value);
  const decreases = Number($("formDecreases").value);
  const increases = Number($("formIncreases").value);
  const findings = {
    cash: $("findingCash").value,
    docs: $("findingDocs").value,
    escalation: $("findingEscalation").value,
    rate: $("findingRate").value,
    inject: $("findingInject").value,
  };
  const critical = [];
  if (!state.briefed) critical.push("OPORD briefing not reviewed");
  if (usdVar !== 0 || zdVar !== 0) critical.push("Cash/currency variance unresolved");
  if (returnedUsd !== state.usd || returnedZd !== state.zd) critical.push("DD 1081 returned accountability mismatch");
  if (decreases !== state.supportedUsd || increases !== 0) critical.push("DD 2665 classification mismatch");
  if (!state.flags.unsupportedFound) critical.push("Missing support not identified");
  if (Object.keys(state.injectChecks).length < 4) critical.push("Inject recovery incomplete");
  if (state.mode === "Same-device team" && Object.keys(state.teamChecks).length < 5) critical.push("Team handoff incomplete");
  if (state.mode === "Same-device team" && Object.keys(state.roleStepsDone).length < 5) critical.push("Team role rotation incomplete");
  if (findings.cash !== "Balanced" || findings.docs !== "Missing support identified" || findings.escalation !== "Notify DDO" || findings.rate !== "Future exchanges only" || findings.inject !== "Recovered accountability") critical.push("Structured findings incorrect");
  const ready = critical.length === 0 && state.errors.filter(Boolean).length === 0;
  const remediation = [];
  if (critical.some((c) => c.includes("variance") || c.includes("1081") || c.includes("2665"))) remediation.push("Repeat Closeout Workbench drill.");
  if (critical.some((c) => c.includes("support"))) remediation.push("Repeat Missing Support packet drill.");
  if (critical.some((c) => c.includes("Inject"))) remediation.push("Repeat TCCC Inject Recovery checklist.");
  if (state.errors.some((e) => String(e).startsWith("RATE"))) remediation.push("Repeat Rate FRAGO drill.");
  if (!remediation.length) remediation.push("Replay with changed numbers or advance difficulty.");
  state.aar = [
    ready ? "Intermediate Readiness: Achieved" : "Intermediate Readiness: Not Yet",
    "",
    `USD variance: ${money(usdVar)}`,
    `ZD variance: ${whole(zdVar)}`,
    `Stress: ${state.stress}`,
    "",
    "Critical findings:",
    ...(critical.length ? critical.map((c) => `- ${c}`) : ["- None"]),
    "",
    "Decision timeline:",
    ...(state.ledger.length ? state.ledger.map((row, i) => `- ${i + 1}. ${row.event}: ${row.decision} (${row.result}, ${row.confidence})`) : ["- No decisions"]),
    "",
    "Explanation:",
    $("aarExplanation").value || "No explanation entered.",
  ].join("\n");
  $("aarResult").innerHTML = `<span>Intermediate Readiness</span><h2>${ready ? "Achieved" : "Not Yet"}</h2><p>${ready ? "Learner balanced, documented, escalated, and explained." : "Review critical findings and remediation."}</p>`;
  $("aarCards").innerHTML = `<div class="green"><span>Green</span><strong>${state.ledger.filter((l) => l.result === "Correct").length}</strong></div><div class="amber"><span>Amber</span><strong>${remediation.length}</strong></div><div class="red"><span>Red</span><strong>${critical.length}</strong></div>`;
  $("remediationQueue").innerHTML = remediation.map((r) => `<div class="packet-item">${r}</div>`).join("");
  $("detailedAar").textContent = state.aar;
  save();
  show("aar");
}

function loadScenario(id, reset = true) {
  state.scenarioId = id;
  const s = scenario();
  if (reset) {
    Object.assign(state, {
      eventIndex: 0,
      usd: s.start.usd,
      zd: s.start.zd,
      supportedUsd: s.start.supportedUsd,
      stress: 0,
      errors: [],
      ledger: [],
      flags: {},
      briefed: false,
      teamChecks: {},
      injectChecks: {},
      roleStep: 0,
      roleStepsDone: {},
      aar: "",
    });
  }
  save();
  renderAll();
}

function replay() {
  loadScenario(state.scenarioId, true);
  state.usd += 100;
  state.zd += 10000;
  save();
  renderAll();
  show("mission");
}

function renderAll() {
  renderHome();
  renderTraining();
  renderLab();
  renderMission();
  renderInject();
  renderCloseout();
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.dataset.nav) show(target.dataset.nav);
  if (target.dataset.action === "start-demo") { state.mode = "Same-device team"; loadScenario("market", true); show("mission"); }
  if (target.dataset.action === "load-scenario") loadScenario($("scenarioSelect").value, true);
  if (target.dataset.action === "save-profile") { state.profile = $("profileName").value.trim(); state.mode = $("modeSelect").value; $("profileStatus").textContent = "Saved locally."; save(); }
  if (target.dataset.action === "save-team") {
    state.team = {
      name: $("teamName").value.trim(),
      cashier: $("roleCashier").value.trim(),
      recorder: $("roleRecorder").value.trim(),
      reviewer: $("roleReviewer").value.trim(),
      chief: $("roleChief").value.trim(),
      safety: $("roleSafety").value.trim(),
    };
    state.mode = "Same-device team";
    $("modeSelect").value = state.mode;
    save();
    renderHome();
  }
  if (target.dataset.action === "complete-role-step") {
    const active = TEAM_ROLES[state.roleStep] || TEAM_ROLES[0];
    state.roleStepsDone[active.key] = true;
    state.roleStep = Math.min(state.roleStep + 1, TEAM_ROLES.length - 1);
    save();
    renderTeamChecks();
  }
  if (target.dataset.action === "mark-briefed") { state.briefed = true; save(); renderMission(); }
  if (target.dataset.action === "submit-aar") submitAar();
  if (target.dataset.action === "replay") replay();
  if (target.dataset.lessonChoice) {
    const lesson = DATA.lessons[state.lesson];
    const correct = Number(target.dataset.lessonChoice) === lesson.correct;
    $("lessonFeedback").textContent = correct ? "Correct. Carry that logic into the mission." : "Not yet. Review the why/do/failure cards.";
    if (correct) { state.lesson = (state.lesson + 1) % DATA.lessons.length; save(); setTimeout(renderTraining, 450); }
  }
  if (target.dataset.eventChoice) chooseEvent(Number(target.dataset.eventChoice));
  if (target.dataset.lab) { document.querySelectorAll(".segmented button").forEach((b) => b.classList.remove("selected")); target.classList.add("selected"); renderLab(target.dataset.lab); }
  if (target.dataset.action === "check-lab") $("labFeedback").textContent = Number($("labAnswer").value) === Number(target.dataset.answer) ? "Correct." : "Not yet.";
  if (target.dataset.labChoice) $("labFeedback").textContent = target.dataset.labChoice === "right" ? "Correct." : "Not yet.";
  if (target.dataset.currencyTab) {
    document.querySelectorAll("[data-currency-tab]").forEach((b) => b.classList.remove("selected"));
    target.classList.add("selected");
    $("usdDrawer").classList.toggle("hidden", target.dataset.currencyTab !== "usd");
    $("zdDrawer").classList.toggle("hidden", target.dataset.currencyTab !== "zd");
  }
});

$("acceptDisclaimer").addEventListener("click", () => {
  if (!$("disclaimerAck").checked) return;
  state.disclaimerAccepted = true;
  save();
  $("disclaimerGate").classList.add("hidden");
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (target.dataset.teamCheck) { state.teamChecks[target.dataset.teamCheck] = target.checked; save(); }
  if (target.dataset.injectCheck) { state.injectChecks[target.dataset.injectCheck] = target.checked; save(); }
  if (target.matches("[data-usd-denom], [data-zd-denom]")) renderCloseout();
});

renderDrawers();
renderAll();
if (state.disclaimerAccepted) $("disclaimerGate").classList.add("hidden");
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("service-worker.js").catch(() => {});
}
