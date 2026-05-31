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

window.DRS_DATA = {
  lessons: [
    {
      id: "accountability",
      title: "Accountability Stack",
      body: "Disbursing is clean only when money, documents, authority, rates, and explanation agree.",
      why: "A drawer can balance and still fail if the transaction is unsupported or outside authority.",
      do: "Check money, documents, authority, rate, and AAR explanation separately.",
      failure: "Thinking cash balance means the mission is automatically clean.",
      prompt: "Cash balances, but a receipt is missing. What catches the issue?",
      choices: ["Cash count", "Support/document review", "Stress score"],
      correct: 1,
    },
    {
      id: "dd1081",
      title: "DD 1081 Settlement",
      body: "An advance must settle through returned cash/currency plus supported payments.",
      why: "If learners lose the start point, they cannot defend the end point.",
      do: "Track advance, supported payments, and returned accountability.",
      failure: "Treating an advance like a vendor receipt.",
      prompt: "$4,000 advance, $1,200 supported payments. Returned cash?",
      choices: ["$2,800", "$1,200", "$4,000"],
      correct: 0,
    },
    {
      id: "dd2665",
      title: "DD 2665 Daily Summary",
      body: "Daily accountability requires correctly classifying increases, decreases, and ending cash.",
      why: "Most closeout mistakes come from putting transactions on the wrong side.",
      do: "Classify the event before calculating the balance.",
      failure: "Treating a collection like a payment.",
      prompt: "A $25 collection is a:",
      choices: ["Decrease", "Increase", "No effect"],
      correct: 1,
    },
    {
      id: "docs",
      title: "Support Documents",
      body: "Every payment needs support. Missing or mismatched support is separate from cash variance.",
      why: "Cash can balance while the packet still fails review.",
      do: "Match vendor, amount, currency, and receipt status.",
      failure: "Clearing Vendor C because the cash still balances.",
      prompt: "Vendor C receipt is missing. Best action?",
      choices: ["Clear closeout", "Hold/escalate", "Create receipt later"],
      correct: 1,
    },
  ],
  scenarios: [
    {
      id: "market",
      title: "Operation Market Run",
      summary: "Vendor payments, FRAGO rate change, missing support, and casualty inject.",
      opord: "Support three approved vendor payments in Zarian Dinar. Use daily rate for exchanges. Notify DDO for missing support, variance, or inject.",
      status: { threat: "Elevated", time: "0900-1200", funds: "Controlled", comms: "Primary" },
      start: { usd: 4000, zd: 240000, supportedUsd: 0 },
      expected: { usd: 3800, zd: 169000, supportedUsd: 800 },
      packet: [
        { label: "Vendor A receipt: 60,000 ZD", status: "ok" },
        { label: "Vendor B receipt: 36,000 ZD", status: "ok" },
        { label: "Vendor C receipt: missing", status: "missing" },
        { label: "Exchange slip: $200 to 25,000 ZD", status: "ok" },
        { label: "FRAGO note: daily rate changed to 125 ZD", status: "ok" },
      ],
      inject: {
        title: "TCCC / Operational Inject",
        headline: "Simulated blast injury near team vehicle.",
        body: "Cash box and voucher packet are exposed during movement.",
      },
      events: [
        {
          title: "Vendor A",
          detail: "Vendor A requests 60,000 ZD. Packet complete.",
          choices: [
            { label: "Pay Vendor A", correct: true, delta: { zd: -60000, supportedUsd: 500 }, note: "Supported payment. ZD decreases." },
            { label: "Pay from USD drawer", correct: false, error: "MATH-004", note: "Wrong currency. Keep USD and ZD separate." },
            { label: "Hold for no reason", correct: false, error: "AUTH-003", note: "Packet is complete and mission-authorized." },
          ],
        },
        {
          title: "Vendor B",
          detail: "Vendor B requests 36,000 ZD. Packet complete.",
          choices: [
            { label: "Pay Vendor B", correct: true, delta: { zd: -36000, supportedUsd: 300 }, note: "Supported payment. Log it." },
            { label: "Escalate missing support", correct: false, error: "DOC-003", note: "No support issue exists here." },
            { label: "Revalue at budget rate", correct: false, error: "RATE-001", note: "No rate decision is needed." },
          ],
        },
        {
          title: "FRAGO 01",
          detail: "DDO changes daily rate to 1 USD = 125 ZD for new accommodation exchanges.",
          choices: [
            { label: "Apply to future exchanges only", correct: true, flag: "rateFrago", note: "Correct. Do not revalue completed payments." },
            { label: "Revalue all completed payments", correct: false, error: "RATE-002", note: "Completed transactions stay as recorded unless directed." },
            { label: "Ignore FRAGO", correct: false, error: "COMM-002", note: "Mission instructions changed." },
          ],
        },
        {
          title: "Accommodation Exchange",
          detail: "Exchange $200 USD for ZD after FRAGO.",
          choices: [
            { label: "Use new daily rate: 25,000 ZD", correct: true, delta: { usd: -200, zd: 25000 }, note: "$200 x 125 = 25,000 ZD." },
            { label: "Use budget rate: 20,000 ZD", correct: false, error: "RATE-001", note: "Budget rate is not used for this exchange." },
            { label: "Use old daily rate: 24,000 ZD", correct: false, error: "RATE-001", note: "FRAGO changed the rate." },
          ],
        },
        {
          title: "Vendor C",
          detail: "Vendor C requests 50,000 ZD. Receipt packet is missing.",
          choices: [
            { label: "Hold/escalate until support is corrected", correct: true, flag: "unsupportedFound", note: "Correct. Cash availability does not fix missing support." },
            { label: "Pay now, fix later", correct: false, error: "DOC-001", delta: { zd: -50000 }, note: "Unsupported payment created packet defect." },
            { label: "Ask budget to approve support", correct: false, error: "AUTH-002", note: "Budget availability is not disbursing support." },
          ],
        },
      ],
    },
  ],
};

# Final Expert Launch Review

Review date: 2026-05-31  
Artifact reviewed: Polished Disbursing Readiness Simulator PWA prototype  
Audience under consideration: unit testers, Air Force finance leaders, career field manager  
Expert panel stance: app product team, mobile UX lead, learning development expert, Air Force disbursing SME, TCCC-aware training reviewer, senior-leader pitch reviewer.

## Executive Verdict

**Go for controlled unit demonstration. Not yet go for career-field-wide launch.**

The polished app is now strong enough to show as a serious concept and early working prototype. It communicates the vision clearly: an offline-first disbursing readiness simulator where Air Force finance members learn the concepts, execute a mission, handle friction, close out funds, and receive an AAR.

It is not yet ready to be represented as a final training product. It is ready to be shown as:

```text
Working prototype for feedback and SME validation.
```

It should not yet be shown as:

```text
Complete Air Force-ready training app.
```

## What The Expert Panel Likes

### 1. The Intent Is Clear

The app finally reads as a disbursing readiness tool, not a generic quiz app. The flow from Brief to Train to Mission to Inject to Closeout to AAR matches the learning intent.

### 2. The Learn-First Path Is Now Visible

The home screen now includes a "Learn before you deploy" path. This matters because the original intent included giving members knowledge before pushing them into scenarios.

### 3. Mobile-First Direction Is Much Better

The polished version feels closer to a phone app than the earlier web prototype:

- bottom navigation
- large touch targets
- cards
- step-based screens
- one main task per area

### 4. The Accountability Stack Is A Strong Design Signature

The "Money, Documents, Authority, Explanation" stack is memorable and useful. It should become the app's core mental model.

### 5. Mission Decisions Are Relevant

The current mission decisions reflect real disbursing judgment:

- supported payment
- wrong currency
- FRAGO rate application
- missing receipt
- budget/authority confusion

### 6. Closeout Is Moving In The Right Direction

The Closeout Table includes:

- cash count
- voucher packet
- DD 1081-style fields
- DD 2665-style fields
- structured findings

This is the strongest candidate for the app's signature experience.

### 7. TCCC Is Framed Correctly

The app does not try to certify TCCC. It frames TCCC injects as operational disruption tied to life, communication, funds security, document control, and accountability recovery.

### 8. AAR Is More Than A Score

The AAR gives readiness status, critical findings, remediation, and decision history. That is the right direction.

### 9. PWA Strategy Is The Correct Low-Cost Launch Path

For a first unit review, PWA is the right option:

- free or near-free
- phone accessible
- no app store approval
- no PII needed
- easy to iterate

### 10. It Is Explainable To Leadership

The product can now be pitched simply:

```text
This gives finance Airmen disbursing repetitions before the stakes are real.
```

## Major Concerns Before Unit Demo

### 1. It Needs Clear Prototype Labeling

Every tester must understand this is not official policy, not Silver Flag content, and not TCCC certification.

Recommended visible language:

```text
Prototype for training concept review. Uses fictional scenarios and simplified form logic. Does not replace official policy, local SOP, instructor judgment, or TCCC certification.
```

### 2. Scenario Content Is Still Too Thin

Operation Market Run is usable as a demo mission. The app is not yet scenario-rich.

For unit feedback, that is acceptable. For career-field manager review, be clear that this is the first mission pattern, not the full content library.

### 3. DD 1081/DD 2665 Are Still Training Abstractions

The app uses simplified form logic. That is fine for MVP, but SMEs may ask why the exact form layout is not replicated.

Recommended answer:

```text
V1 teaches form logic and accountability flow. Exact form replication comes after SME validation so we do not accidentally teach incorrect field behavior.
```

### 4. AAR Scoring Still Needs SME Rubric Review

The structured AAR is much better, but it should be validated by disbursing SMEs before being treated as authoritative.

### 5. Team Mode Is Still Early

The app supports the idea of same-device team training but does not yet fully create separate role experiences.

Do not overclaim team functionality.

### 6. No Instructor Dashboard Yet

For unit demo, local AAR is enough. For career-field scaling, instructors will want:

- roster
- attempts
- common errors
- exports
- scenario assignment

### 7. No Real SME Approval Workflow Yet

The app does not yet include built-in scenario approval statuses:

- draft
- finance SME reviewed
- TCCC reviewed
- approved
- retired

This is needed before wider adoption.

### 8. Visual Quality Is Good For Prototype, Not Final

The polished app looks dramatically better, but a final mobile product should still be rebuilt in a modern framework with smoother transitions and reusable components.

### 9. Phone Install Still Requires Hosting

The app is PWA-ready, but users cannot install it cleanly from a local file. It must be hosted over HTTPS.

### 10. Testing Must Be Controlled

Do not send broadly yet. Test with a small group first.

Recommended first group:

- 1 new Airman
- 1 SrA/NCO
- 1 disbursing-experienced SME
- 1 instructor/cadre type
- 1 senior leader or SEL reviewer

## Go / No-Go Assessment

### Controlled Unit Feedback Demo

Status: **GO**

Conditions:

- Present as prototype.
- Use fictional scenario disclaimer.
- Ask for feedback, not endorsement.
- Observe testers using it.
- Capture where they get confused.

### Career Field Manager Concept Brief

Status: **GO WITH CAUTION**

Conditions:

- Show as proof of concept.
- Lead with the problem and readiness gap.
- Demo one mission only.
- Be transparent about what remains to build.
- Ask for SME review support or pilot approval, not full adoption.

### Public PWA Release

Status: **NOT YET**

Required before release:

- disclaimer screen
- SME review of mission logic
- TCCC reviewer feedback
- hosted test link
- feedback capture plan
- at least 3 complete missions or clear labeling as single-mission demo

### App Store Release

Status: **NO-GO**

Reason:

- Not enough validated content yet.
- No formal review workflow.
- Needs native/PWA packaging decision.
- Needs privacy/support documents.

## Recommended Demo Script

Use this sequence for unit/career-field-manager review:

1. Show Briefing Room.
2. Point out "Learn before you deploy."
3. Tap Training Bay and show the Accountability Stack lesson.
4. Go to Mission.
5. Mark briefing reviewed.
6. Make correct Vendor A/B decisions.
7. Show FRAGO rate decision.
8. Show Vendor C missing support pressure.
9. Show Inject screen.
10. Go to Closeout.
11. Show voucher packet, DD 1081, DD 2665, and structured findings.
12. Submit AAR.
13. Explain readiness/remediation.

Do not click through every lesson. The point is to show the learning loop.

## Recommended Talking Points

### Problem

Finance Airmen often get limited disbursing repetitions before deployment, especially with manual balancing, forms, foreign currency, documentation, and mission disruption.

### Solution

An offline-first simulator that gives safe, repeatable, measurable reps.

### Differentiator

This is not CBT. It is a mission simulator centered on accountability.

### Why It Matters

Disbursing errors can create cash loss, audit risk, mission delay, and reduced confidence in deployed finance operations.

### Ask

Approve a controlled SME/user feedback pilot and help identify disbursing/TCCC reviewers.

## Highest Priority Fixes After Demo

1. Add a required disclaimer screen.
2. Host the PWA on a free HTTPS platform.
3. Build two more complete missions.
4. Add exact SME review notes to each scenario.
5. Improve DD 1081/DD 2665 form fidelity.
6. Build role rotation for same-device team mode.
7. Add instructor test script.
8. Improve AAR rubric with SME validation.
9. Add exportable feedback package.
10. Create a one-page leadership brief.

## Final Expert Recommendation

Show it to your unit as a prototype.

Show it to the career field manager only if you frame it correctly:

```text
This is a working prototype demonstrating a proposed Disbursing Readiness Simulator. It is not final training content. I am seeking SME feedback, pilot support, and guidance on whether this solves a real career-field readiness gap.
```

The concept is strong enough to start the conversation.


<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#16211e" />
    <title>Disbursing Readiness Simulator</title>
    <link rel="manifest" href="manifest.json" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div id="disclaimerGate" class="disclaimer-gate">
      <section class="disclaimer-card">
        <span class="status-pill">Prototype Notice</span>
        <h1>Before Training</h1>
        <p>
          This is a supplemental prototype for disbursing readiness practice. It uses fictional scenarios,
          simplified form logic, and training-only currency. It does not replace official policy, local SOP,
          instructor judgment, or TCCC certification.
        </p>
        <div class="notice-list">
          <div>Use for controlled feedback and learning only.</div>
          <div>Do not enter PII, real vendor data, or protected course content.</div>
          <div>Finance/TCCC SMEs should validate content before formal use.</div>
        </div>
        <label class="ack-line"><input id="disclaimerAck" type="checkbox" /> I understand this is a prototype training simulator.</label>
        <button id="acceptDisclaimer" class="primary">Enter Simulator</button>
      </section>
    </div>
    <main class="app">
      <section id="home" class="screen active-screen">
        <div class="hero">
          <span class="status-pill">Briefing Room</span>
          <h1>Disbursing Readiness Simulator</h1>
          <p>Practice deployed finance decisions with cash, forms, rates, packets, FRAGOs, TCCC injects, closeout, and AAR.</p>
          <div class="prototype-banner">Prototype for controlled unit feedback. Fictional scenario. SME review required before formal training use.</div>
          <button class="primary" data-action="start-demo">Start Demo Mission</button>
        </div>

        <div class="mission-card dark-card">
          <span>Today's readiness mission</span>
          <h2 id="homeMissionTitle">Operation Market Run</h2>
          <p id="homeMissionSummary">Vendor payments, FRAGO rate change, missing support, and casualty inject.</p>
        </div>

        <div class="learn-first-card">
          <span class="eyebrow">New learner path</span>
          <h2>Learn before you deploy.</h2>
          <p>Start here if you have not practiced disbursing recently. Build the core mental model before entering the mission.</p>
          <div class="learn-first-list">
            <div>Accountability Stack</div>
            <div>DD 1081 Settlement</div>
            <div>DD 2665 Daily Summary</div>
            <div>Support Documents</div>
          </div>
          <button class="secondary" data-nav="training">Start Training Bay</button>
        </div>

        <div class="accountability-stack">
          <span>Accountability Stack</span>
          <div><strong>Money</strong><em id="stackMoney">Pending</em></div>
          <div><strong>Documents</strong><em id="stackDocs">Packet review</em></div>
          <div><strong>Authority</strong><em>DDO escalation</em></div>
          <div><strong>Explanation</strong><em>AAR required</em></div>
        </div>

        <div class="card">
          <span class="eyebrow">Scenario library</span>
          <label for="scenarioSelect">Mission</label>
          <select id="scenarioSelect"></select>
          <button class="secondary" data-action="load-scenario">Load Mission</button>
        </div>

        <div class="card">
          <span class="eyebrow">Local profile</span>
          <label for="profileName">Name or callsign</label>
          <input id="profileName" placeholder="A1C Example" />
          <label for="modeSelect">Mode</label>
          <select id="modeSelect">
            <option>Individual</option>
            <option>Same-device team</option>
          </select>
          <button class="secondary" data-action="save-profile">Save Locally</button>
          <p id="profileStatus" class="muted">No account. Progress stays on this device.</p>
        </div>

        <div class="team-setup-card">
          <span class="eyebrow">Team training setup</span>
          <h2>Same-device paying agent team</h2>
          <p>For training day: members learn individually, then form a team and rotate through role responsibilities during the mission.</p>
          <label for="teamName">Team name</label>
          <input id="teamName" placeholder="Team Alpha" />
          <div class="role-input-grid">
            <label>Cashier <input id="roleCashier" placeholder="Name" /></label>
            <label>Recorder <input id="roleRecorder" placeholder="Name" /></label>
            <label>Reviewer <input id="roleReviewer" placeholder="Name" /></label>
            <label>Team chief <input id="roleChief" placeholder="Name" /></label>
            <label>TCCC/Safety <input id="roleSafety" placeholder="Name" /></label>
          </div>
          <button class="secondary" data-action="save-team">Save Team</button>
          <p id="teamStatus" class="muted">Team not configured.</p>
        </div>
      </section>

      <section id="training" class="screen">
        <header class="screen-header">
          <span class="status-pill">Training Bay</span>
          <strong id="lessonCounter">01 / 08</strong>
        </header>

        <div class="lesson-hero">
          <h2 id="lessonTitle">Accountability Stack</h2>
          <p id="lessonBody">Disbursing is only clean when money, documents, authority, rates, and explanation agree.</p>
        </div>

        <div class="lesson-blocks">
          <article><span>Why</span><p id="lessonWhy"></p></article>
          <article><span>Do</span><p id="lessonDo"></p></article>
          <article class="warning"><span>Failure</span><p id="lessonFailure"></p></article>
        </div>

        <div class="card">
          <span class="eyebrow">Interactive check</span>
          <p id="lessonPrompt"></p>
          <div id="lessonChoices" class="choice-list"></div>
          <p id="lessonFeedback" class="feedback"></p>
        </div>

        <div class="card">
          <span class="eyebrow">Object lab</span>
          <div class="segmented">
            <button class="selected" data-lab="settlement">DD 1081</button>
            <button data-lab="sorter">DD 2665</button>
            <button data-lab="packet">Packet</button>
          </div>
          <div id="labContent"></div>
        </div>
      </section>

      <section id="mission" class="screen">
        <header class="screen-header">
          <span class="status-pill amber">Mission Board</span>
          <strong>Stress <span id="stressScore">0</span></strong>
        </header>

        <div class="mission-status">
          <div><span>Threat</span><strong id="statusThreat">Elevated</strong></div>
          <div><span>Time</span><strong id="statusTime">0900-1200</strong></div>
          <div><span>Funds</span><strong id="statusFunds">Controlled</strong></div>
          <div><span>Comms</span><strong id="statusComms">Primary</strong></div>
        </div>

        <div class="card">
          <span class="eyebrow">OPORD</span>
          <h2 id="opordTitle">Operation Market Run</h2>
          <p id="opordText"></p>
          <button id="briefButton" class="secondary" data-action="mark-briefed">Mark Briefing Reviewed</button>
          <p id="briefStatus" class="muted">Briefing not reviewed.</p>
        </div>

        <div class="timeline" id="timeline"></div>

        <div class="event-card">
          <span id="eventCount">Decision</span>
          <h2 id="eventTitle">Ready</h2>
          <p id="eventDetail">Load a mission and begin.</p>
          <label for="confidenceSelect">Confidence</label>
          <select id="confidenceSelect">
            <option>High</option>
            <option selected>Medium</option>
            <option>Low</option>
          </select>
          <div id="eventChoices" class="choice-list"></div>
          <p id="missionCoach" class="feedback"></p>
        </div>

        <div class="ledger card">
          <span class="eyebrow">Live Ledger</span>
          <div class="ledger-totals">
            <div><span>USD</span><strong id="usdBalance">$4,000</strong></div>
            <div><span>ZD</span><strong id="zdBalance">240,000</strong></div>
            <div><span>Support</span><strong id="supportBalance">$0 eq</strong></div>
          </div>
          <div id="ledgerHistory" class="ledger-history">No decisions yet.</div>
        </div>

        <div class="card">
          <span class="eyebrow">Team Handoff</span>
          <div class="active-role-panel">
            <span>Active role</span>
            <h2 id="activeRoleTitle">Cashier</h2>
            <p id="activeRolePrompt">Confirm physical cash and currency separation before mission closeout.</p>
            <button class="secondary" data-action="complete-role-step">Complete Role Step</button>
          </div>
          <div id="roleProgress" class="role-progress"></div>
          <div id="teamChecks" class="check-grid"></div>
        </div>
      </section>

      <section id="inject" class="screen">
        <header class="screen-header">
          <span class="status-pill red">Inject</span>
          <strong>Operational</strong>
        </header>
        <div class="alert-card">
          <span id="injectTitle">TCCC / Operational Inject</span>
          <h2 id="injectHeadline">Mission disrupted.</h2>
          <p id="injectBody">Act within trained scope, communicate, secure funds and documents if possible, and recover accountability.</p>
        </div>
        <div id="injectChecks" class="check-grid"></div>
      </section>

      <section id="closeout" class="screen">
        <header class="screen-header">
          <span class="status-pill">Closeout Table</span>
          <strong>Workbench</strong>
        </header>

        <div class="stepper"><span class="done"></span><span class="done"></span><span class="active"></span><span></span><span></span></div>

        <div class="drawer-card">
          <h2>Cash Count</h2>
          <div class="currency-tabs">
            <button class="selected" data-currency-tab="usd">USD</button>
            <button data-currency-tab="zd">ZD</button>
          </div>
          <div id="usdDrawer" class="drawer-pane"></div>
          <div id="zdDrawer" class="drawer-pane hidden"></div>
          <div class="variance-row"><span>Expected USD</span><strong id="expectedUsd">$0</strong></div>
          <div class="variance-row"><span>Physical USD</span><strong id="physicalUsd">$0</strong></div>
          <div class="variance-row"><span>USD Variance</span><strong id="usdVariance">$0</strong></div>
          <div class="variance-row"><span>Expected ZD</span><strong id="expectedZd">0</strong></div>
          <div class="variance-row"><span>Physical ZD</span><strong id="physicalZd">0</strong></div>
          <div class="variance-row"><span>ZD Variance</span><strong id="zdVariance">0</strong></div>
        </div>

        <div class="card">
          <span class="eyebrow">Voucher Packet</span>
          <div id="packetList" class="packet-list"></div>
        </div>

        <div class="form-stack">
          <div class="form-card"><span>DD 1081</span><label>Returned USD</label><input id="returnUsd" type="number" /><label>Returned ZD</label><input id="returnZd" type="number" /></div>
          <div class="form-card"><span>DD 2665</span><label>Supported decreases</label><input id="formDecreases" type="number" /><label>Increases / collections</label><input id="formIncreases" type="number" value="0" /></div>
        </div>

        <div class="card">
          <span class="eyebrow">Structured Findings</span>
          <label>Cash status</label><select id="findingCash"><option>Balanced</option><option>Short</option><option>Over</option><option>Unresolved</option></select>
          <label>Documentation</label><select id="findingDocs"><option>Missing support identified</option><option>Fully supported</option><option>Mismatched support</option><option>Unresolved support issue</option></select>
          <label>Escalation</label><select id="findingEscalation"><option>Notify DDO</option><option>Notify commander only</option><option>Notify budget officer only</option><option>No notification required</option></select>
          <label>Rate / FRAGO</label><select id="findingRate"><option>Future exchanges only</option><option>Revalue all transactions</option><option>No rate impact</option><option>Unresolved rate issue</option></select>
          <label>Inject recovery</label><select id="findingInject"><option>Recovered accountability</option><option>Funds/documents unsecured</option><option>Medical overreach</option><option>Unresolved inject impact</option></select>
          <label>Explain the result</label><textarea id="aarExplanation" rows="4" placeholder="Explain cash, support, escalation, FRAGO, and inject recovery."></textarea>
          <button class="primary" data-action="submit-aar">Submit Closeout</button>
        </div>
      </section>

      <section id="aar" class="screen">
        <header class="screen-header">
          <span class="status-pill">AAR Room</span>
          <strong>Result</strong>
        </header>
        <div id="aarResult" class="aar-result">
          <span>Intermediate Readiness</span>
          <h2>Pending</h2>
          <p>Submit closeout to generate AAR.</p>
        </div>
        <div id="aarCards" class="debrief-grid"></div>
        <div class="card"><span class="eyebrow">Remediation Queue</span><div id="remediationQueue">No remediation yet.</div></div>
        <div class="card"><span class="eyebrow">Detailed AAR</span><pre id="detailedAar">No AAR yet.</pre></div>
        <button class="primary" data-action="replay">Replay With New Numbers</button>
      </section>

      <nav class="bottom-nav">
        <button class="active" data-nav="home">Brief</button>
        <button data-nav="training">Train</button>
        <button data-nav="mission">Mission</button>
        <button data-nav="inject">Inject</button>
        <button data-nav="closeout">Close</button>
        <button data-nav="aar">AAR</button>
      </nav>
    </main>

    <script src="data.js"></script>
    <script src="app.js"></script>
  </body>
</html>

{
  "name": "Disbursing Readiness Simulator",
  "short_name": "DRS",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#e7ece9",
  "theme_color": "#16211e",
  "description": "Offline-first Air Force finance disbursing readiness simulator prototype.",
  "icons": []
}

# Privacy Note

This prototype is designed to avoid collecting personal information.

## What Is Stored

The app may store the following locally on the user's device:

- Local profile name or callsign entered by the user.
- Team role names entered by the user.
- Scenario progress.
- Mission decisions.
- AAR results.

This information is stored in the browser's local storage on that device.

## What Is Not Collected

The prototype does not require:

- Login.
- Email address.
- CAC.
- DoD ID number.
- SSN.
- Real vendor data.
- Real deployment data.
- Real finance packets.

## Important User Guidance

Users should not enter:

- PII.
- CUI.
- Classified information.
- Protected course content.
- Real vendor/payment data.
- Real casualty details.

## Prototype Status

This is a controlled-feedback prototype. It is not an official Air Force system of record and should not be used to store official training records.


# PWA Launch Checklist

Use this before sharing the simulator link with your unit.

## Required Before Sharing

- Open the app and confirm the prototype notice appears.
- Confirm users can enter the simulator after acknowledging the notice.
- Confirm Training Bay is visible and easy to find.
- Confirm team setup works.
- Confirm Mission decisions work.
- Confirm Inject checklist works.
- Confirm Closeout allows USD and ZD entry.
- Confirm AAR generates after submitting closeout.
- Confirm no real PII, vendor data, deployment data, CUI, classified, or protected course content is included.
- Confirm the app is described as a prototype, not official training.

## Recommended Controlled Test Group

- 1 new Airman.
- 1 SrA or NCO.
- 1 disbursing-experienced SME.
- 1 instructor/cadre type.
- 1 senior leader or SEL reviewer.

## Recommended Test Flow

1. Individual users complete Training Bay.
2. Users form teams.
3. Teams assign roles.
4. Teams run Operation Market Run.
5. Teams complete Inject checklist.
6. Teams complete Closeout.
7. Teams review AAR.
8. Instructor collects feedback.

## Do Not Claim

- Do not claim it is official Air Force training.
- Do not claim it certifies TCCC.
- Do not claim it replaces Silver Flag.
- Do not claim it is policy-complete.
- Do not claim it is ready for career-field-wide release.

## Safe Claim

```text
This is a working prototype for controlled feedback. It demonstrates a proposed offline-first Disbursing Readiness Simulator for Air Force finance members. It uses fictional scenarios and simplified training logic while we collect SME and learner feedback.
```

## PWA Hosting Note

The PWA/offline install features require the app to be hosted over HTTPS. Opening `index.html` locally works for review, but users will need a hosted web link to add it to their phone home screen cleanly.


# Disbursing Readiness Simulator - Polished Interactive App

This folder merges the working prototype logic with the mobile redesign direction.

## Open Locally

Open:

`index.html`

This works as a local browser app. Some PWA install/offline features only work after the files are hosted over `https://`.

## What This Version Includes

- Mobile-first interface.
- Required prototype notice/disclaimer gate.
- Briefing Room.
- Training Bay.
- Mission Board.
- TCCC/operational inject screen.
- Closeout Table.
- AAR Room.
- Local profile.
- Scenario data in `data.js`.
- Live mission ledger.
- Cash drawer.
- Voucher packet.
- DD 1081/DD 2665-style closeout fields.
- Structured AAR findings.
- Local storage.
- PWA manifest and service worker for hosted use.
- Same-device team setup and role rotation.
- Unit training day guide.

## Free Phone Method

Host this folder as a free static site using GitHub Pages, Netlify, or Cloudflare Pages.

Once hosted:

1. Open the web link on a phone.
2. iPhone: Safari > Share > Add to Home Screen.
3. Android: Chrome > menu > Add to Home screen or Install app.

This gives users an app-like icon without App Store or Google Play costs.

## Under-$200 App Store Method

If you want it in the stores later:

- Apple Developer Program: about $99/year.
- Google Play Console: one-time $25 registration fee.

That stays under $200 before any optional hosting or paid developer tools.

The current polished web app should be validated first before paying for store release.

## Training Day Use

Use:

`unit_training_day_guide.md`

Recommended flow:

1. Individual Training Bay.
2. Team setup.
3. Team mission.
4. Closeout.
5. AAR and feedback.

const CACHE_NAME = "drs-polished-v1";
const FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./data.js",
  "./app.js",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES)));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});

:root {
  --bg: #e7ece9;
  --ink: #16211e;
  --muted: #687571;
  --panel: #fff;
  --line: #d6dfdb;
  --soft: #f4f7f5;
  --green: #1f6f5b;
  --lime: #9fb34b;
  --amber: #b56b13;
  --red: #a63131;
}

* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font-family: Arial, Helvetica, sans-serif; }
button, input, select, textarea { font: inherit; }
button { cursor: pointer; }

.app { max-width: 520px; min-height: 100vh; margin: 0 auto; background: var(--panel); box-shadow: 0 0 70px rgba(22,33,30,.18); padding-bottom: 78px; }
.disclaimer-gate { position: fixed; inset: 0; z-index: 100; background: rgba(22,33,30,.94); display: grid; place-items: center; padding: 18px; }
.disclaimer-gate.hidden { display: none; }
.disclaimer-card { width: min(100%, 520px); background: #fff; border: 1px solid var(--line); padding: 22px; box-shadow: 0 24px 80px rgba(0,0,0,.32); }
.disclaimer-card h1 { margin: 10px 0; }
.disclaimer-card p { color: var(--muted); line-height: 1.5; }
.notice-list { display: grid; gap: 8px; margin: 14px 0; }
.notice-list div { background: var(--soft); border: 1px solid var(--line); padding: 10px; color: var(--muted); }
.ack-line { display: flex; gap: 10px; align-items: center; color: var(--ink); text-transform: none; font-size: 14px; margin: 12px 0; }
.ack-line input { width: auto; }
.screen { display: none; padding: 18px; min-height: calc(100vh - 78px); }
.active-screen { display: flex; flex-direction: column; gap: 14px; }

.hero, .dark-card, .event-card, .alert-card { background: #16211e; color: #f6faf8; border: 1px solid #2c3c38; padding: 18px; }
.hero h1, .mission-card h2, .event-card h2, .alert-card h2, .lesson-hero h2, .drawer-card h2 { margin: 8px 0; line-height: 1.08; }
.hero p, .dark-card p, .event-card p, .alert-card p { color: #c9d8d4; line-height: 1.45; }
.prototype-banner { margin: 12px 0; border: 1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.08); padding: 10px; color: #d9e4e1; line-height: 1.4; font-weight: 700; }

.status-pill, .eyebrow { display: inline-block; color: var(--green); font-size: 12px; font-weight: 800; text-transform: uppercase; }
.status-pill { background: rgba(31,111,91,.14); border: 1px solid rgba(31,111,91,.25); padding: 7px 9px; }
.hero .status-pill, .dark-card .status-pill, .event-card .status-pill, .alert-card .status-pill { color: #dbe8e4; border-color: rgba(255,255,255,.2); background: rgba(255,255,255,.08); }
.status-pill.amber { color: #ffd99d; }
.status-pill.red { color: #ffb9b9; }

.primary, .secondary { width: 100%; border: 0; padding: 14px 16px; font-weight: 800; }
.primary { background: var(--green); color: #fff; }
.secondary { background: #e8eeec; color: var(--ink); border: 1px solid var(--line); }

.card, .lesson-hero, .drawer-card, .aar-result { background: var(--panel); border: 1px solid var(--line); padding: 14px; }
.team-setup-card { background: #f7faf9; border: 1px solid #bfd5ce; padding: 16px; }
.team-setup-card h2 { margin: 8px 0; }
.team-setup-card p { color: var(--muted); line-height: 1.45; }
.role-input-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.role-input-grid label { margin: 0; text-transform: none; color: var(--ink); font-size: 13px; }
.learn-first-card { background: #e9f2ee; border: 1px solid #bfd5ce; padding: 16px; }
.learn-first-card h2 { margin: 8px 0; }
.learn-first-card p { color: var(--muted); line-height: 1.45; }
.learn-first-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin: 12px 0; }
.learn-first-list div { background: #fff; border: 1px solid var(--line); padding: 10px; font-weight: 800; font-size: 13px; }
.muted, .feedback { color: var(--muted); line-height: 1.45; }
label { display: block; margin: 10px 0 6px; color: var(--muted); font-size: 12px; font-weight: 800; text-transform: uppercase; }
input, select, textarea { width: 100%; border: 1px solid var(--line); background: #fff; padding: 12px; color: var(--ink); }
textarea { resize: vertical; }

.screen-header, .compact-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.screen-header strong { padding-top: 7px; }

.accountability-stack { background: #16211e; color: #f6faf8; padding: 14px; border: 1px solid #2c3c38; }
.accountability-stack > span { color: var(--lime); font-size: 12px; font-weight: 800; text-transform: uppercase; }
.accountability-stack div { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,.12); padding: 9px 0; }
.accountability-stack div:last-child { border-bottom: 0; }
.accountability-stack em { color: #c9d8d4; font-style: normal; }

.choice-list { display: grid; gap: 8px; margin-top: 10px; }
.choice-list button { border: 1px solid var(--line); background: var(--soft); padding: 12px; text-align: left; font-weight: 800; }
.choice-list button.risky { background: #fff4de; border-color: #e2b25d; }

.lesson-blocks { display: grid; gap: 8px; }
.lesson-blocks article { border: 1px solid var(--line); background: var(--soft); padding: 12px; }
.lesson-blocks .warning { background: #fff4de; border-color: #e2b25d; }
.lesson-blocks span { color: var(--green); font-size: 12px; font-weight: 800; text-transform: uppercase; }
.lesson-blocks p { color: var(--muted); line-height: 1.4; margin: 5px 0 0; }

.segmented, .currency-tabs { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; margin: 10px 0; }
.currency-tabs { grid-template-columns: repeat(2,1fr); }
.segmented button, .currency-tabs button { border: 1px solid var(--line); background: var(--soft); padding: 10px; font-weight: 800; }
.segmented .selected, .currency-tabs .selected { background: var(--green); color: #fff; }

.mission-status, .ledger-totals, .debrief-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
.mission-status { grid-template-columns: repeat(4,1fr); }
.mission-status div, .ledger-totals div, .debrief-grid div { border: 1px solid var(--line); background: var(--soft); padding: 10px; }
.mission-status span, .ledger-totals span, .debrief-grid span, .variance-row span { display: block; color: var(--muted); font-size: 11px; font-weight: 800; text-transform: uppercase; }
.mission-status strong, .ledger-totals strong { display: block; margin-top: 5px; font-size: 13px; }

.timeline { display: flex; gap: 6px; flex-wrap: wrap; }
.dot { width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid var(--line); background: var(--soft); font-weight: 800; color: var(--muted); }
.dot.done { background: #e4f3e9; border-color: #9ecfaf; color: var(--green); }
.dot.error { background: #f8e7e7; border-color: #d48c8c; color: var(--red); }

.ledger-history { display: grid; gap: 7px; margin-top: 10px; }
.ledger-row { border-bottom: 1px solid var(--line); padding: 8px 0; color: var(--muted); font-size: 13px; }
.ledger-row strong { color: var(--ink); display: block; }

.check-grid { display: grid; gap: 8px; }
.check-grid label { margin: 0; color: var(--ink); text-transform: none; font-size: 14px; background: var(--soft); border: 1px solid var(--line); padding: 10px; display: flex; gap: 8px; align-items: center; }
.check-grid input { width: auto; }
.active-role-panel { background: #16211e; color: #f6faf8; border: 1px solid #2c3c38; padding: 14px; margin-bottom: 10px; }
.active-role-panel span { color: var(--lime); font-size: 12px; font-weight: 800; text-transform: uppercase; }
.active-role-panel h2 { margin: 6px 0; }
.active-role-panel p { color: #c9d8d4; line-height: 1.4; }
.role-progress { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 10px; }
.role-progress div { height: 8px; background: var(--line); }
.role-progress .done { background: var(--green); }

.stepper { display: grid; grid-template-columns: repeat(5,1fr); gap: 6px; }
.stepper span { height: 8px; background: var(--line); }
.stepper .done { background: var(--green); }
.stepper .active { background: var(--lime); }

.drawer-pane { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; }
.hidden { display: none; }
.denom { border: 1px solid var(--line); background: var(--soft); padding: 10px; }
.denom span { display: block; color: var(--muted); font-size: 12px; font-weight: 800; }
.denom input { margin-top: 6px; }
.variance-row { display: flex; justify-content: space-between; border-bottom: 1px solid var(--line); padding: 10px 0; }

.packet-list { display: grid; gap: 8px; }
.packet-item { border: 1px solid var(--line); background: var(--soft); padding: 10px; }
.packet-item.missing { background: #fff4de; border-color: #e2b25d; }

.form-stack { display: grid; gap: 10px; }
.form-card { border: 1px solid var(--line); background: var(--soft); padding: 12px; }
.form-card span { color: var(--green); font-size: 12px; font-weight: 800; text-transform: uppercase; }

.aar-result { background: #e9f2ee; border-color: #bfd5ce; }
.aar-result span { color: var(--green); font-size: 12px; font-weight: 800; text-transform: uppercase; }
.aar-result h2 { margin: 6px 0; }
.debrief-grid .green { background: #e4f3e9; }
.debrief-grid .amber { background: #fff4de; }
.debrief-grid .red { background: #f8e7e7; }
pre { white-space: pre-wrap; color: var(--muted); font-family: Arial, Helvetica, sans-serif; }

.bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: min(100%, 520px); display: grid; grid-template-columns: repeat(6,1fr); background: #16211e; border-top: 1px solid #2c3c38; z-index: 30; }
.bottom-nav button { border: 0; background: transparent; color: #d9e4e1; padding: 12px 2px; font-size: 12px; font-weight: 800; }
.bottom-nav .active { background: var(--lime); color: #16211e; }

@media (max-width: 380px) {
  .screen { padding: 14px; }
  .mission-status { grid-template-columns: repeat(2,1fr); }
  .learn-first-list { grid-template-columns: 1fr; }
  .role-input-grid { grid-template-columns: 1fr; }
}

# Unit Training Day Guide

Purpose: Run a controlled feedback session using the Disbursing Readiness Simulator polished PWA prototype.

## Required Framing

Read this before the session:

```text
This is a prototype training simulator. It uses fictional scenarios, simplified form logic, and training-only currency. It does not replace official policy, local SOP, instructor judgment, or TCCC certification. Today we are testing whether this approach helps finance members learn and practice deployed disbursing accountability.
```

## Recommended Flow

### Phase 1: Individual Learning

Time: 20 to 30 minutes

Each member:

1. Opens the app.
2. Accepts the prototype notice.
3. Goes to Training Bay.
4. Completes the lessons and object labs.
5. Practices the accountability stack, DD 1081, DD 2665, and packet concepts.

Instructor observes:

- Where users hesitate.
- Which concepts need more explanation.
- Whether users understand money/documents/authority/explanation.

### Phase 2: Team Setup

Time: 5 minutes

Teams assign:

- Cashier.
- Recorder.
- Reviewer.
- Team chief.
- TCCC/safety lead.

One device can be used per team.

### Phase 3: Team Mission

Time: 20 to 30 minutes

Team:

1. Reviews OPORD.
2. Marks briefing reviewed.
3. Executes mission decisions.
4. Handles FRAGO.
5. Handles Vendor C missing support.
6. Completes inject checklist.
7. Completes role rotation and team handoff.
8. Goes to Closeout.

Instructor watches:

- Are roles actually talking?
- Does the team challenge bad assumptions?
- Does someone separate cash balance from support?
- Does the team escalate to DDO correctly?

### Phase 4: Closeout

Time: 15 to 20 minutes

Team:

1. Counts USD.
2. Counts ZD.
3. Reviews packet.
4. Completes DD 1081-style returned accountability.
5. Completes DD 2665-style classification.
6. Selects structured findings.
7. Types AAR explanation.

### Phase 5: AAR

Time: 10 to 15 minutes

Discuss:

- Was intermediate readiness achieved?
- What did the team get right?
- What critical findings appeared?
- What remediation was assigned?
- What did the app fail to teach clearly?

## Feedback Questions

Ask each tester:

- Did the learning section prepare you for the mission?
- Did the team roles feel useful?
- Did the mission feel realistic enough for deployed finance training?
- Did the TCCC inject feel connected to paying agent movement?
- Did closeout help you understand DD 1081/DD 2665 logic?
- Did the AAR tell you what to fix?
- What wording felt wrong?
- What would make this more useful for your unit?

## What Not To Claim

Do not claim:

- This is official training.
- This certifies TCCC.
- This replaces Silver Flag.
- This is policy-complete.
- This is ready for career-field-wide release.

## What To Claim

You can claim:

- This is a working prototype.
- It tests a scenario-based approach to disbursing readiness.
- It is offline-first and phone-friendly.
- It gives safe reps before real deployed disbursing tasks.
- It needs SME feedback before formal use.

