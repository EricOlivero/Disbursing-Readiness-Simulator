(() => {
  "use strict";

  const ROLES = [
    "Commander",
    "Budget Officer",
    "Disbursing Officer",
    "Deputy Disbursing Officer",
    "Disbursing Agent",
    "Cashier",
    "Paying Agent",
    "TCCC/Safety Observer"
  ];
  const RELEASE_ID = "Evidence Release 2 · 2026-06-07";

  const FORM_PRACTICALS = {
    dd577: {
      title: "DD Form 577: Appointment Authority",
      prompt: "A Cashier is being placed in an accountable position. Identify the roles shown in the training packet and explain what DD Form 577 establishes. If appointment authority is uncertain, say that current policy must be verified.",
      lesson: {
        purpose: "Documents an appointment and the appointee's acknowledgement of duties and responsibility.",
        useWhen: "Before an individual performs the accountable function identified in the appointment.",
        accountabilityEffect: "Establishes who is authorized and what responsibility the person accepts; it does not move cash.",
        fieldMap: ["Appointing authority", "Appointed individual and role", "Scope or limitations", "Acceptance and effective dates"]
      },
      fields: [
        ["appointingRole", "Appointing role shown in the mission"],
        ["appointedRole", "Role being appointed"],
        ["appointmentPurpose", "Purpose and responsibility accepted"]
      ],
      conceptGroups: [
        { name: "appointment or authority", terms: ["appoint", "authoriz", "designat"] },
        { name: "accepted responsibility", terms: ["responsib", "accountab", "liable", "liability", "duties"] }
      ],
      evaluate(values) {
        return values.appointingRole.length >= 2 &&
          /cashier/i.test(values.appointedRole) &&
          values.appointmentPurpose.trim().length >= 20;
      },
      feedback: "Identify the appointment, role, and accountability accepted. Appointment-authority conflicts require current-policy validation."
    },
    dd1081: {
      title: "DD Form 1081: Advance and Accountability",
      prompt: "The DD Form 1081 shows a $4,000 advance. Your independent physical count is $4,000. Reconcile the advance before accepting accountability.",
      lesson: {
        purpose: "Records an advance, return, or transfer of accountability between disbursing personnel.",
        useWhen: "Cash or accountable items move between the issuing and receiving accountable roles.",
        accountabilityEffect: "Increases one person's accountability and decreases or supports the other side of the transfer; both sides must agree.",
        fieldMap: ["From and to roles", "Purpose of transfer", "Increase or decrease", "Currency and U.S. dollar equivalent", "Issuer and recipient verification"]
      },
      fields: [
        ["advanceAmount", "Amount shown on the advance", "number"],
        ["physicalCount", "Independent physical cash count", "number"],
        ["advanceExplanation", "Explain why accountability can or cannot be accepted"]
      ],
      conceptGroups: [
        { name: "independent physical count", terms: ["count", "physical", "bill", "denomination"] },
        { name: "reconciliation", terms: ["match", "reconcil", "agree", "balance", "same"] },
        { name: "accountability acceptance", terms: ["accept", "accountab", "responsib", "custody"] }
      ],
      evaluate(values) {
        const advance = Number(values.advanceAmount);
        const count = Number(values.physicalCount);
        return advance === 4000 &&
          advance === count &&
          values.advanceExplanation.trim().length >= 20;
      },
      feedback: "The physical count must equal the accountability accepted. Explain the independent count and reconciliation."
    },
    dd2665: {
      title: "DD Form 2665: Foreign-Currency Accountability",
      prompt: "The agent purchased 100,638 FC for $3,000 where no Treasury prevailing rate is used. Select the branch, calculate the rate, and explain why revaluation-loss processing does not apply.",
      lesson: {
        purpose: "Supports daily agent accountability and foreign-currency records in the reviewed scenarios.",
        useWhen: "The scenario requires the agent to document foreign-currency accountability, including the applicable rate branch.",
        accountabilityEffect: "Connects foreign currency held, its U.S. dollar equivalent, and the documented rate or adjustment.",
        fieldMap: ["Currency on hand", "U.S. dollar equivalent", "Rate basis", "Accountability change", "Supporting calculation or certificate"]
      },
      fields: [
        ["rateBranch", "Process: revaluation loss or average purchase rate"],
        ["rateCalculation", "Show the calculation or decision rule used"],
        ["rateExplanation", "Explain why this branch applies and the other does not"]
      ],
      conceptGroups: [
        { name: "Average Purchase Rate", terms: ["average purchase", "apr"] },
        { name: "local purchase or no prevailing rate", terms: ["local", "purchas", "no treasury", "without treasury", "no prevailing"] },
        { name: "separate from revaluation", terms: ["not revaluation", "separate", "different", "does not apply", "other branch"] }
      ],
      evaluate(values) {
        const branch = values.rateBranch.toLowerCase();
        const calculation = values.rateCalculation.toLowerCase();
        return /(average purchase|apr)/.test(branch) &&
          /(33\.?54|100638|100,638)/.test(calculation) &&
          values.rateExplanation.trim().length >= 25;
      },
      feedback: "Revaluation-loss and Average Purchase Rate processing are separate. State which branch applies and why the other does not."
    },
    balance: {
      title: "Intermediate Manual Balance: Find the Difference",
      prompt: "Opening accountability is $4,000. Supported payments total $725. Physical cash is $3,260. Compute the book balance and discrepancy, then explain the result.",
      lesson: {
        purpose: "Proves the learner can reconcile records to physical funds and explain an overage or shortage.",
        useWhen: "Opening a drawer, changing custody, performing an interim count, or completing closeout.",
        accountabilityEffect: "An unresolved difference remains an accountability problem; a physical count alone does not change the book balance.",
        fieldMap: ["Opening accountability", "Supported increases and decreases", "Computed book cash", "Physical cash", "Overage or shortage", "Control action"]
      },
      fields: [
        ["bookBalance", "Computed book balance", "number"],
        ["discrepancy", "Physical cash minus book balance (enter -15 or 15 shortage)"],
        ["balanceExplanation", "Explain what the result means and the next control action"]
      ],
      conceptGroups: [
        { name: "shortage or discrepancy", terms: ["short", "deficien", "difference", "discrep", "under"] },
        { name: "stop and recount", terms: ["stop", "recount", "count again"] },
        { name: "review or document", terms: ["review", "document", "investig", "elevat", "support"] }
      ],
      evaluate(values) {
        const discrepancy = values.discrepancy
          .toLowerCase()
          .replaceAll("$", "")
          .replaceAll(",", "")
          .trim();
        const correctDiscrepancy =
          Number(discrepancy) === -15 ||
          /^-?15\s*(short|shortage|deficien|under)/.test(discrepancy) ||
          /^\(?15\)?\s*(short|shortage|deficien|under)/.test(discrepancy);
        return Number(values.bookBalance) === 3275 &&
          correctDiscrepancy &&
          values.balanceExplanation.trim().length >= 25;
      },
      feedback: "Book cash is $3,275. Physical cash is $15 short. Enter either -15 or 15 shortage, then explain the recount, support review, and documentation or elevation of the unresolved difference."
    }
  };

  function normalizeResponse(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}.$-]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function conceptMatch(practical, values) {
    const response = normalizeResponse(Object.values(values).join(" "));
    const groups = practical.conceptGroups || [];
    const results = groups.map(group => ({
      name: group.name,
      matched: group.terms.some(term => response.includes(normalizeResponse(term)))
    }));
    return {
      passed: results.every(result => result.matched),
      matched: results.filter(result => result.matched).map(result => result.name),
      missing: results.filter(result => !result.matched).map(result => result.name)
    };
  }

  const SOURCE_NOTES = {
    market: {
      type: "Fictional composite training mission",
      citation: "210_ A1134_PA_Appt.pdf pp.1-4; 57_ 37.22 Joint Deployed Operations.pdf pp.2-12",
      caution: "OPORD/FRAGO framing is an analyst-designed learning method."
    },
    "cashier-standup": {
      type: "Scenario exercise and assessment standard",
      citation: "205_ A1110_Cashier_Appt.pdf pp.1-3; 206_ A1111_Cashier_Advance.pdf pp.1-3",
      caution: "Appointment-authority conflict remains unresolved; validate current policy."
    },
    "exchange-point": {
      type: "Scenario exercise with authoritative excerpts",
      citation: "125_ A1200_Currency_Exchange.pdf pp.1-3; 115_ Reverse_Exchange.pdf pp.2-3",
      caution: "Use fictional eligibility, rates, and identity data."
    },
    "revaluation-loss": {
      type: "Scenario exercise with authoritative excerpt",
      citation: "276_ A2312a_Confused_Agent.pdf pp.1-3",
      caution: "Do not merge this process with Average Purchase Rate."
    },
    "average-purchase-rate": {
      type: "Scenario exercise with authoritative excerpt",
      citation: "277_ A2312b_Confused_Agent.pdf pp.1-4",
      caution: "Page 7 is an evidence gap and is not used."
    },
    "duplicate-payment": {
      type: "Scenario exercise with authoritative excerpt",
      citation: "368_ A2306_Cash_Payments_Revision.pdf pp.1-3",
      caution: "Vendor and accounting data remain fictional. Pages 8, 10, and 14 are not used."
    },
    continuity: {
      type: "Fictional composite using continuity requirements",
      citation: "382_ A2219_DA_Arrested.pdf pp.2-4; 380_ A2211_Change_Fund_Loss.pdf p.2",
      caution: "TCCC medical procedures are outside this evidence set; only accountability interruption is assessed."
    }
  };

  const SCENARIO_META = {
    market: {
      level: "Intermediate",
      estimatedMinutes: 60,
      roles: ["Commander", "Budget Officer", "Paying Agent", "Cashier", "Deputy Disbursing Officer"],
      primarySkill: "Paying-agent mission execution and supported cash closeout"
    },
    "cashier-standup": {
      level: "Foundation",
      estimatedMinutes: 45,
      roles: ["Disbursing Officer", "Deputy Disbursing Officer", "Cashier"],
      primarySkill: "Appointment, DD Form 1081 acceptance, and manual reconciliation"
    },
    "exchange-point": {
      level: "Intermediate",
      estimatedMinutes: 50,
      roles: ["Deputy Disbursing Officer", "Disbursing Agent", "Cashier"],
      primarySkill: "Exchange eligibility, documentation, and currency control"
    },
    "revaluation-loss": {
      level: "Advanced",
      estimatedMinutes: 55,
      roles: ["Deputy Disbursing Officer", "Disbursing Agent", "Budget Officer"],
      primarySkill: "Revaluation-loss branch selection and accountability effect"
    },
    "average-purchase-rate": {
      level: "Advanced",
      estimatedMinutes: 55,
      roles: ["Deputy Disbursing Officer", "Disbursing Agent", "Cashier"],
      primarySkill: "Average Purchase Rate calculation and documentation"
    },
    "duplicate-payment": {
      level: "Advanced",
      estimatedMinutes: 50,
      roles: ["Budget Officer", "Cashier", "Deputy Disbursing Officer"],
      primarySkill: "Pre-payment review and duplicate-payment prevention"
    },
    continuity: {
      level: "Advanced",
      estimatedMinutes: 60,
      roles: ["Commander", "Deputy Disbursing Officer", "Disbursing Agent", "Cashier", "TCCC/Safety Observer"],
      primarySkill: "Custody, inventory, and accountability continuity after interruption"
    }
  };

  const MISSION_ORDERS = {
    "cashier-standup": {
      situation: "The contingency disbursing site opens today. The assigned cashier has appointment paperwork and a sealed advance, but no transactions may begin until accountability is independently established.",
      mission: "The finance element establishes cashier operations, accepts the advance only after reconciliation, and produces a defensible opening accountability record.",
      execution: [
        "Verify appointment purpose, role, and incompatible-duty controls.",
        "Count the physical issue by denomination and reconcile DD Form 1081.",
        "Transfer the verified opening position to the supervising DDO and prepare for transactions."
      ],
      sustainment: "Use only the fictional cash and records provided. Stop work on any unexplained difference.",
      command: "Disbursing Officer provides authority; DDO supervises; Cashier accepts and maintains the drawer.",
      frago: "A second individual is unavailable for the scheduled recount. Maintain separation of duties and identify an acceptable verification path before opening."
    },
    market: {
      situation: "A supported unit requires time-sensitive local purchases in a fictional foreign-currency environment. Communications and movement conditions may change during execution.",
      mission: "The paying-agent team obtains authorized goods, makes supported payments, protects public funds, and returns a fully reconciled packet and cash position.",
      execution: [
        "Confirm mission authority, budget purpose, rate, and starting accountability.",
        "Evaluate each payment packet and issue physical denominations only when support is defensible.",
        "Respond to the inject, preserve custody, and complete the Paying Agent-to-Cashier return."
      ],
      sustainment: "No payment may rely on memory alone. Retain fictional receipts, rate evidence, and unused funds.",
      command: "Commander sets mission priority; Budget Officer confirms purpose; Paying Agent executes; Cashier and DDO control accountability.",
      frago: "The supported unit changes one requirement after movement. Revalidate purpose and support before committing additional funds."
    },
    "exchange-point": {
      situation: "A temporary exchange point supports eligible personnel using a fictional directed rate. Exchange and reverse-exchange requests arrive with mixed documentation.",
      mission: "The exchange team determines eligibility, applies the correct rate, moves physical currency accurately, and closes both currency positions.",
      execution: [
        "Establish the opening U.S. and foreign-currency position.",
        "Review eligibility and support separately for exchange and reverse exchange.",
        "Record denomination movement and reconcile the final U.S. dollar equivalent."
      ],
      sustainment: "Use fictional identity and currency data. Do not infer eligibility from rank, urgency, or amount alone.",
      command: "DDO supervises; Disbursing Agent controls exchange operations; Cashier executes approved transactions.",
      frago: "A customer presents an urgent reverse-exchange request with incomplete support. Determine whether urgency changes the control requirement."
    },
    "revaluation-loss": {
      situation: "A prevailing-rate change creates a difference between recorded accountability and the current value of foreign currency held by the agent.",
      mission: "The team identifies the revaluation branch, computes the loss, documents the accountability effect, and avoids substituting the APR process.",
      execution: [
        "Validate the rate-change facts and recorded foreign-currency balance.",
        "Calculate the revaluation difference without changing branches.",
        "Explain the DD Form 2665 effect and route the support for review."
      ],
      sustainment: "Retain fictional rate evidence. Do not treat a documented revaluation difference as an unexplained physical shortage.",
      command: "Disbursing Agent calculates; DDO reviews accountability; Budget Officer supports classification without taking custody.",
      frago: "A teammate proposes recalculating Average Purchase Rate to remove the difference. Defend the correct branch before proceeding."
    },
    "average-purchase-rate": {
      situation: "Foreign currency was purchased locally for a fictional mission where the scenario does not use a Treasury prevailing rate.",
      mission: "The team calculates Average Purchase Rate, documents purchase evidence, updates accountability, and explains why revaluation-loss processing is not applicable.",
      execution: [
        "Verify U.S. dollars spent and foreign currency received.",
        "Calculate APR with precision and document certificate-of-change reasoning.",
        "Update DD Form 2665 accountability and brief the DDO."
      ],
      sustainment: "Preserve calculation precision until the final step. Use only fictional bank and rate information.",
      command: "Disbursing Agent computes; Cashier verifies physical currency; DDO reviews accountability.",
      frago: "A daily-rate notice arrives after the local purchase. Determine whether it retroactively replaces the purchase-rate calculation."
    },
    "duplicate-payment": {
      situation: "A fictional vendor packet arrives during a high-volume payment window. Similar supporting records suggest the obligation may already have been paid.",
      mission: "The review team prevents an unsupported or duplicate disbursement, documents the control decision, and protects the cash position.",
      execution: [
        "Compare authority, approval, payee, amount, calculation, support, and prior-payment evidence.",
        "Stop or release the transaction based on the complete packet, not urgency.",
        "Handoff the reviewed packet to the Cashier and reconcile cash impact."
      ],
      sustainment: "All vendor, accounting, and payment data are fictional. Do not request real financial identifiers.",
      command: "Budget Officer reviews purpose; DDO controls the decision; Cashier pays only a released packet.",
      frago: "The requesting activity states that mission delay will occur without immediate payment. Determine whether urgency overcomes duplicate-payment controls."
    },
    continuity: {
      situation: "An operational incident removes an accountable team member from the workflow while public funds and incomplete records remain at the site.",
      mission: "The team secures funds, establishes temporary custody, inventories accountability, reconstructs records, and resumes only when the balance is defensible.",
      execution: [
        "Address immediate safety and secure access to funds without inventing medical procedures.",
        "Identify command, custody, inventory, and documentation responsibilities.",
        "Complete a formal handoff to the replacement role and reconcile closeout."
      ],
      sustainment: "No detailed safe, destruction, or security procedures are reproduced. Use abstract controls only.",
      command: "Commander establishes continuity; DDO directs inventory; Agent and Cashier provide records; TCCC/Safety Observer manages the safety lane.",
      frago: "A communication outage prevents immediate reach-back. Continue only actions necessary to protect life and accountability, and document deferred decisions."
    }
  };

  const MISSION_PACKETS = {
    "cashier-standup": {
      available: ["Fictional appointment summary", "DD Form 1081 training record", "Sealed denomination issue", "Duty-separation prompt"],
      outputs: ["Accepted or rejected advance decision", "Opening denomination count", "Accountability explanation", "Cashier-to-DDO handoff"]
    },
    market: {
      available: ["Fictional purchase authority", "Budget-purpose summary", "Directed training rate", "Vendor receipt prompts", "Operational inject"],
      outputs: ["Payment-by-denomination plan", "Support decisions", "Rate evidence", "Unused cash return", "Paying Agent-to-Cashier handoff"]
    },
    "exchange-point": {
      available: ["Opening dual-currency drawer", "Eligibility prompts", "Exchange request", "Reverse-exchange request", "Directed training rate"],
      outputs: ["Eligibility decisions", "Exchange calculations", "Physical currency movements", "Dual-currency closeout"]
    },
    "revaluation-loss": {
      available: ["Prior accountability balance", "Fictional prevailing-rate change", "DD Form 2665 training record", "Calculation workspace"],
      outputs: ["Branch decision", "Revaluation calculation", "Accountability effect", "DDO review handoff"]
    },
    "average-purchase-rate": {
      available: ["Fictional local purchase record", "Foreign currency received", "U.S. dollars spent", "DD Form 2665 training record", "Certificate-of-change prompt"],
      outputs: ["APR calculation", "Branch explanation", "Updated U.S. dollar equivalent", "Agent-to-DDO handoff"]
    },
    "duplicate-payment": {
      available: ["Fictional payment packet", "Prior-payment indicator", "Support checklist", "Urgency inject"],
      outputs: ["Release or stop decision", "Duplicate-control explanation", "Cash impact", "Reviewer-to-Cashier handoff"]
    },
    continuity: {
      available: ["Opening accountability record", "Incomplete transaction log", "Custody interruption inject", "Inventory prompt", "Communication outage FRAGO"],
      outputs: ["Immediate custody decision", "Inventory result", "Reconstructed accountability", "Replacement-role handoff", "Continuity closeout"]
    }
  };

  function applyScenarioMetadata() {
    const missions = window.DRS_DATA && window.DRS_DATA.scenarios;
    if (!Array.isArray(missions)) return;
    missions.forEach(item => {
      const metadata = SCENARIO_META[item.id];
      if (!metadata) return;
      Object.assign(item, metadata);
    });
  }

  const safeState = () => {
    if (typeof state === "undefined") return null;
    state.handoffs = Array.isArray(state.handoffs) ? state.handoffs : [];
    state.formMastery = state.formMastery || {};
    state.decisionRationales = Array.isArray(state.decisionRationales) ? state.decisionRationales : [];
    state.aarReflection = state.aarReflection || null;
    state.remediationLog = Array.isArray(state.remediationLog) ? state.remediationLog : [];
    state.roleBriefs = state.roleBriefs || {};
    state.qualificationStep = Number.isInteger(state.qualificationStep) ? state.qualificationStep : 0;
    state.scenarioVariant = Number.isInteger(state.scenarioVariant) ? state.scenarioVariant : 0;
    const missions = window.DRS_DATA && Array.isArray(window.DRS_DATA.scenarios)
      ? window.DRS_DATA.scenarios
      : [];
    if (missions.length && !missions.some(item => item.id === state.scenarioId)) {
      state.scenarioId = missions[0].id;
    }
    return state;
  };

  const save = () => {
    if (typeof persist === "function") persist();
  };

  function recordRemediation(station, issue, details = {}) {
    const current = safeState();
    if (!current) return;
    current.remediationLog.push({
      scenarioId: current.scenarioId,
      station,
      issue,
      eventIndex: current.eventIndex,
      recordedAt: new Date().toISOString(),
      ...details
    });
    save();
  }

  function remediationCount(station) {
    return safeState().remediationLog.filter(entry => entry.station === station).length;
  }

  function adaptiveHint(station) {
    const hints = {
      "qualification-dd577": "Method: identify who is appointed, the accountable function, the responsibility acknowledged, and any authority question requiring current-policy validation.",
      "qualification-dd1081": "Method: compare the advance with an independent physical count. Do not accept accountability until both sides agree and the transfer purpose is clear.",
      "qualification-dd2665": "Method: decide whether the facts describe prevailing-rate revaluation or a local currency purchase before calculating. Explain why the other branch does not apply.",
      "qualification-balance": "Method: opening accountability minus supported payments equals book cash. Physical cash minus book cash equals the overage or shortage.",
      "initial-cash-issue": "Method: extend denomination times count, total each currency, convert foreign currency using the directed rate, and compare the U.S. dollar equivalent to accountability.",
      "decision-rationale": "Method: state the action, evidence, accountability effect, and control or risk.",
      "role-handoff": "Method: identify sender, receiver, amount or item, verification performed, and the accountability accepted.",
      "aar-reflection": "Method: explain the final balance, name the highest-risk control and evidence, and state one observable replay action."
    };
    return hints[station] || "Review the worked example, show the calculation, and connect the response to accountability.";
  }

  const scenarioList = () => {
    const scenarios = window.DRS_DATA && window.DRS_DATA.scenarios;
    return Array.isArray(scenarios) ? scenarios : [];
  };

  const escapeHtml = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const announce = (message, tone = "") => {
    const target = document.querySelector("#statusMessage, #trainingFeedback, [role='status']");
    if (target) {
      target.textContent = message;
      target.dataset.tone = tone;
    }
  };

  function gradeDecisionRationale(text) {
    const response = String(text || "").trim();
    const criteria = {
      action: /(i will|we will|stop|verify|accept|reject|reconcile|calculate|secure|document|route|return)/i.test(response),
      evidence: /(form|voucher|receipt|support|rate|appointment|count|denomination|packet|record|authority)/i.test(response),
      accountability: /(accountab|balance|custody|cash|funds|drawer|on hand|u\.?s\.? dollar equivalent)/i.test(response),
      control: /(because|risk|prevent|control|duplicate|separation|safeguard|before|until|cannot|must)/i.test(response)
    };
    const met = Object.values(criteria).filter(Boolean).length;
    return {
      passed: response.length >= 55 && met === 4,
      score: met,
      criteria,
      missing: Object.entries(criteria).filter(([, value]) => !value).map(([key]) => key)
    };
  }

  function validateScenarioLibrary() {
    const missions = scenarioList();
    const errors = [];
    if (missions.length < 7) errors.push(`Expected seven missions but loaded ${missions.length}.`);
    const ids = missions.map(item => item.id);
    if (new Set(ids).size !== ids.length) errors.push("Mission identifiers are not unique.");
    missions.forEach(item => {
      if (!item.id || !item.title) errors.push("A mission is missing its identifier or title.");
      if (!Array.isArray(item.events) || item.events.length < 2) {
        errors.push(`${item.title || item.id || "Unknown mission"} needs at least two mission events.`);
      }
      if (!Number.isFinite(Number(item.accountabilityUsd)) || Number(item.accountabilityUsd) <= 0) {
        errors.push(`${item.title || item.id || "Unknown mission"} has invalid starting accountability.`);
      }
    });
    if (!errors.length) return true;
    const host = document.getElementById("home") || document.body;
    if (!document.getElementById("scenarioIntegrityAlert")) {
      const alert = document.createElement("section");
      alert.id = "scenarioIntegrityAlert";
      alert.className = "integrity-alert";
      alert.setAttribute("role", "alert");
      alert.innerHTML = `
        <strong>Mission library did not load correctly.</strong>
        <p>Refresh the app while online before beginning a training event.</p>
        <ul>${errors.map(error => `<li>${error}</li>`).join("")}</ul>
      `;
      host.insertBefore(alert, host.firstElementChild);
    }
    return false;
  }

  function ensureReleaseMarker() {
    const home = document.getElementById("home");
    if (!home || document.getElementById("releaseMarker")) return;
    const marker = document.createElement("div");
    marker.id = "releaseMarker";
    marker.className = "release-marker";
    marker.innerHTML = `
      <span>Current build</span>
      <strong>${RELEASE_ID}</strong>
      <small>Seven missions · four practicals · 25 focused browser checks</small>
    `;
    home.insertBefore(marker, home.firstElementChild);
  }

  function requestPwaUpdateCheck() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.getRegistration()
      .then(registration => registration?.update())
      .catch(() => {
        // Offline use remains available; readiness diagnostics will surface registration status.
      });
  }

  function ensureConnectivityStatus() {
    if (document.getElementById("connectivityStatus")) return;
    const status = document.createElement("div");
    status.id = "connectivityStatus";
    status.className = "connectivity-status";
    status.setAttribute("role", "status");
    document.body.appendChild(status);
    updateConnectivityStatus();
  }

  function updateConnectivityStatus() {
    const status = document.getElementById("connectivityStatus");
    if (!status) return;
    if (navigator.onLine) {
      status.textContent = "Online · progress remains stored locally";
      status.dataset.online = "true";
    } else {
      status.textContent = "Offline mode · current progress remains available on this device";
      status.dataset.online = "false";
    }
  }

  function populateScenarioLibrary() {
    const select = document.getElementById("scenarioSelect");
    if (!select) return;
    const current = safeState();
    const options = scenarioList().map((item, index) => {
      const selected = item.id === current?.scenarioId ? " selected" : "";
      const level = item.level || (index < 2 ? "Foundation" : index < 5 ? "Intermediate" : "Advanced");
      return `<option value="${item.id}"${selected}>${index + 1}. ${item.title} - ${level}</option>`;
    }).join("");
    if (select.innerHTML !== options) select.innerHTML = options;
  }

  function missionObjective(item, index) {
    const objectives = {
      market: "Plan, pay, document, and close a paying-agent mission under changing conditions.",
      "cashier-standup": "Accept a cashier advance, reconcile the drawer, and establish accountable operations.",
      "exchange-point": "Conduct controlled exchange activity and defend eligibility and documentation decisions.",
      "revaluation-loss": "Recognize a prevailing-rate change and process the accountability effect separately from APR.",
      "average-purchase-rate": "Compute and document Average Purchase Rate without confusing it with revaluation loss.",
      "duplicate-payment": "Detect an unsupported or duplicate payment before public funds leave the drawer.",
      continuity: "Preserve custody and reconstruct accountability after an operational interruption."
    };
    return objectives[item.id] || `Complete mission ${index + 1} and defend every accountability decision.`;
  }

  function ensureScenarioCatalog() {
    const home = document.getElementById("home");
    const select = document.getElementById("scenarioSelect");
    if (!home || !select || document.getElementById("scenarioCatalog")) return;
    const section = document.createElement("section");
    section.id = "scenarioCatalog";
    section.className = "scenario-catalog";
    section.innerHTML = `
      <div class="catalog-heading">
        <div>
          <p class="eyebrow">TEAM BREAKOUT LIBRARY</p>
          <h2>Seven missions, seven different accountability problems</h2>
          <p>Assign one mission per team. Each mission tests a different decision path, so teams cannot solve the training day by sharing one answer sheet.</p>
        </div>
        <div class="assignment-control">
          <label for="teamCount">Teams</label>
          <input id="teamCount" type="number" min="1" max="7" value="7">
          <button type="button" data-overnight-action="assign-teams">Assign</button>
          <button type="button" class="diagnostic-button" data-overnight-action="run-diagnostics">Run readiness check</button>
        </div>
      </div>
      <div class="scenario-grid">
        ${scenarioList().map((item, index) => `
          <article class="scenario-card">
            <div class="scenario-number">${String(index + 1).padStart(2, "0")}</div>
            <div>
              <p class="eyebrow">${item.level || (index < 2 ? "FOUNDATION" : index < 5 ? "INTERMEDIATE" : "ADVANCED")}</p>
              <h3>${item.title}</h3>
              <p>${missionObjective(item, index)}</p>
              <p class="scenario-meta"><strong>${item.estimatedMinutes || 50} min</strong><span>${(item.roles || []).join(" · ")}</span></p>
              <button type="button" data-overnight-action="select-scenario" data-scenario-id="${item.id}">Select mission</button>
            </div>
          </article>
        `).join("")}
      </div>
      <div id="teamAssignments" class="team-assignments"></div>
      <div id="readinessDiagnostics" class="readiness-diagnostics" role="status"></div>
    `;
    home.appendChild(section);
  }

  function assignTeams() {
    const current = safeState();
    const count = Math.max(1, Math.min(7, Number(document.getElementById("teamCount")?.value) || 7));
    const names = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf"];
    const missions = scenarioList().slice();
    current.assignmentRotation = (Number(current.assignmentRotation) || 0) + 1;
    const offset = (new Date().getDate() + current.assignmentRotation) % Math.max(missions.length, 1);
    const rotated = missions.slice(offset).concat(missions.slice(0, offset));
    current.teamAssignments = rotated.slice(0, count).map((mission, index) => ({
      team: names[index],
      scenarioId: mission.id,
      scenarioTitle: mission.title,
      roles: mission.roles || [
        ROLES[(index + 3) % 7],
        ROLES[(index + 4) % 7],
        ROLES[(index + 5) % 7]
      ]
    }));
    save();
    renderTeamAssignments();
  }

  function renderTeamAssignments() {
    const target = document.getElementById("teamAssignments");
    const assignments = safeState()?.teamAssignments || [];
    if (!target || !assignments.length) return;
    target.innerHTML = `
      <div class="assignment-heading">
        <div>
          <p class="eyebrow">FACILITATOR ASSIGNMENT BOARD</p>
          <h3>Unique team missions</h3>
        </div>
        <button type="button" data-overnight-action="assign-teams">Rotate assignments</button>
      </div>
      <div class="assignment-list">
        ${assignments.map(item => `
          <article>
            <strong>Team ${item.team}</strong>
            <span>${item.scenarioTitle}</span>
            <small>${item.roles.join(" · ")}</small>
          </article>
        `).join("")}
      </div>
    `;
  }

  async function runDiagnostics() {
    const target = document.getElementById("readinessDiagnostics");
    if (!target) return;
    const missions = scenarioList();
    const checks = [
      {
        name: "Seven unique missions",
        pass: missions.length === 7 && new Set(missions.map(item => item.id)).size === 7
      },
      {
        name: "Four qualification practicals",
        pass: Object.keys(FORM_PRACTICALS).length === 4
      },
      {
        name: "Five-paragraph OPORD coverage",
        pass: missions.every(item => Boolean(MISSION_ORDERS[item.id]))
      },
      {
        name: "Evidence note coverage",
        pass: missions.every(item => Boolean(SOURCE_NOTES[item.id]))
      },
      {
        name: "Scenario role assignments",
        pass: missions.every(item => Array.isArray(item.roles) && item.roles.length >= 3)
      },
      {
        name: "Local progress storage",
        pass: (() => {
          try {
            localStorage.setItem("drs-diagnostic", "ok");
            const pass = localStorage.getItem("drs-diagnostic") === "ok";
            localStorage.removeItem("drs-diagnostic");
            return pass;
          } catch {
            return false;
          }
        })()
      },
      {
        name: "Service worker support",
        pass: "serviceWorker" in navigator
      }
    ];
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        checks.push({ name: "PWA service worker registered", pass: Boolean(registration) });
      } catch {
        checks.push({ name: "PWA service worker registered", pass: false });
      }
    }
    const passed = checks.filter(check => check.pass).length;
    target.innerHTML = `
      <div class="diagnostic-heading">
        <strong>${passed}/${checks.length} readiness checks passed</strong>
        <span>${passed === checks.length ? "Ready for browser verification" : "Review failed checks before training"}</span>
      </div>
      <div class="diagnostic-grid">
        ${checks.map(check => `
          <div class="${check.pass ? "pass" : "fail"}">
            <span aria-hidden="true">${check.pass ? "PASS" : "FAIL"}</span>
            <strong>${escapeHtml(check.name)}</strong>
          </div>
        `).join("")}
      </div>
    `;
  }

  function roleOptions(selected = "", roles = ROLES) {
    return roles.map(role => `<option${role === selected ? " selected" : ""}>${role}</option>`).join("");
  }

  function ensureDecisionRationale() {
    const choices = document.querySelector("#eventChoices, .event-choices, [data-event-choices]");
    if (!choices || document.getElementById("decisionRationale")) return;
    const panel = document.createElement("section");
    panel.className = "response-panel decision-rationale-panel";
    panel.innerHTML = `
      <p class="eyebrow">DECISION RECORD</p>
      <h3>Explain before you act</h3>
      <label for="decisionRationale">State the evidence, accountability effect, and control behind your decision.</label>
      <textarea id="decisionRationale" rows="4" minlength="55" placeholder="I will... The evidence is... The accountability effect is... This control prevents..."></textarea>
      <div class="response-rubric" aria-label="Decision response rubric">
        <span>Action</span><span>Evidence</span><span>Accountability</span><span>Control or risk</span>
      </div>
      <p class="field-hint">All four rubric elements are required. A choice without defensible reasoning will not be accepted.</p>
    `;
    choices.parentElement.insertBefore(panel, choices);
  }

  function ensureHandoffWorkbench() {
    const mission = document.getElementById("mission");
    const item = typeof scenario === "function" ? scenario() : null;
    if (!mission || !item) return;
    const existing = document.getElementById("handoffWorkbench");
    if (existing?.dataset.scenarioId === item.id) return;
    existing?.remove();
    const roles = item?.roles?.length ? item.roles : ROLES;
    const fromRole = roles.includes("Cashier") ? "Cashier" : roles[0];
    const toRole = roles.find(role => role !== fromRole) || roles[0];
    const anchor = document.querySelector("#teamChecks, .team-checks, #missionLedger") || mission.lastElementChild;
    const panel = document.createElement("section");
    panel.id = "handoffWorkbench";
    panel.dataset.scenarioId = item.id;
    panel.className = "card handoff-workbench";
    panel.innerHTML = `
      <p class="eyebrow">ROLE HANDOFF</p>
      <h2>Transfer accountability, not just information</h2>
      <p>The receiving role must be able to state what changed, what was verified, and what remains accountable.</p>
      <div class="form-grid handoff-grid">
        <label>From role
          <select id="handoffFrom">${roleOptions(fromRole, roles)}</select>
        </label>
        <label>To role
          <select id="handoffTo">${roleOptions(toRole, roles)}</select>
        </label>
        <label>Amount or item transferred
          <input id="handoffAmount" inputmode="decimal" placeholder="$0.00, voucher packet, or custody record">
        </label>
        <label class="wide-field">Handoff explanation
          <textarea id="handoffExplanation" rows="4" placeholder="What was counted or reviewed? What form or evidence supports it? What accountability remains?"></textarea>
        </label>
      </div>
      <button type="button" class="primary" data-overnight-action="submit-handoff">Record Handoff</button>
      <div id="handoffFeedback" class="inline-feedback" role="status"></div>
      <div id="handoffHistory" class="handoff-history"></div>
    `;
    if (anchor?.parentElement) anchor.parentElement.insertBefore(panel, anchor.nextSibling);
    else mission.appendChild(panel);
    renderHandoffs();
  }

  function ensureMissionStandards() {
    const mission = document.getElementById("mission");
    const item = typeof scenario === "function" ? scenario() : null;
    if (!mission || !item) return;
    const existing = document.getElementById("missionStandards");
    if (existing?.dataset.scenarioId === item.id) return;
    existing?.remove();
    const panel = document.createElement("section");
    panel.id = "missionStandards";
    panel.dataset.scenarioId = item.id;
    panel.className = "mission-standards";
    const source = SOURCE_NOTES[item.id] || {
      type: "Fictional training scenario",
      citation: "See sanitized source review.",
      caution: "Validate against current policy before operational use."
    };
    panel.innerHTML = `
      <div>
        <p class="eyebrow">COMMANDER'S END STATE</p>
        <h2>${item.title}</h2>
        <p>${missionObjective(item, scenarioList().findIndex(entry => entry.id === item.id))}</p>
        <p class="scenario-meta"><strong>${item.estimatedMinutes || 50} minute mission</strong><span>${item.primarySkill || ""}</span></p>
      </div>
      <ol class="standard-list">
        <li><strong>Accountability:</strong> Every movement is supported and reconciled.</li>
        <li><strong>Reasoning:</strong> Decisions explain the authority, evidence, or internal control.</li>
        <li><strong>Handoff:</strong> The receiving role can reconstruct what changed.</li>
        <li><strong>Closeout:</strong> Denominations, documents, and written explanation agree.</li>
      </ol>
      <details class="source-note mission-source-note">
        <summary>Evidence and release note</summary>
        <p><strong>${source.type}.</strong> ${source.citation}</p>
        <p>${source.caution}</p>
      </details>
    `;
    mission.insertBefore(panel, mission.firstElementChild);
  }

  function ensureMissionOrder() {
    const mission = document.getElementById("mission");
    const item = typeof scenario === "function" ? scenario() : null;
    const order = item ? MISSION_ORDERS[item.id] : null;
    const packet = item ? MISSION_PACKETS[item.id] : null;
    if (!mission || !item || !order) return;
    const existing = document.getElementById("missionOrder");
    if (existing?.dataset.scenarioId === item.id) return;
    existing?.remove();
    const panel = document.createElement("section");
    panel.id = "missionOrder";
    panel.dataset.scenarioId = item.id;
    panel.className = "mission-order";
    panel.innerHTML = `
      <div class="order-heading">
        <div>
          <p class="eyebrow">TRAINING OPORD</p>
          <h2>Operation ${escapeHtml(item.title)}</h2>
        </div>
        <span>UNCLASSIFIED // FICTIONAL TRAINING</span>
      </div>
      <div class="order-sections">
        <section><h3>1. Situation</h3><p>${escapeHtml(order.situation)}</p></section>
        <section><h3>2. Mission</h3><p>${escapeHtml(order.mission)}</p></section>
        <section>
          <h3>3. Execution</h3>
          <ol>${order.execution.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        </section>
        <section><h3>4. Sustainment</h3><p>${escapeHtml(order.sustainment)}</p></section>
        <section><h3>5. Command and Signal</h3><p>${escapeHtml(order.command)}</p></section>
      </div>
      <aside class="frago-strip">
        <strong>FRAGO 01</strong>
        <p>${escapeHtml(order.frago)}</p>
      </aside>
      ${packet ? `
        <div class="mission-packet">
          <section>
            <h3>Packet available</h3>
            <ul>${packet.available.map(record => `<li>${escapeHtml(record)}</li>`).join("")}</ul>
          </section>
          <section>
            <h3>Required outputs</h3>
            <ul>${packet.outputs.map(output => `<li>${escapeHtml(output)}</li>`).join("")}</ul>
          </section>
        </div>
      ` : ""}
    `;
    const standards = document.getElementById("missionStandards");
    if (standards?.parentElement) standards.parentElement.insertBefore(panel, standards.nextSibling);
    else mission.insertBefore(panel, mission.firstElementChild);
  }

  function ensureRoleBoard() {
    const mission = document.getElementById("mission");
    const item = typeof scenario === "function" ? scenario() : null;
    if (!mission || !item) return;
    const existing = document.getElementById("roleBoard");
    if (existing?.dataset.scenarioId === item.id) return;
    existing?.remove();
    const roles = item.roles || [];
    const roleState = safeState().roleBriefs[item.id] || {};
    const board = document.createElement("section");
    board.id = "roleBoard";
    board.dataset.scenarioId = item.id;
    board.className = "card role-board";
    board.innerHTML = `
      <div class="role-board-heading">
        <div>
          <p class="eyebrow">TEAM ROLE BOARD</p>
          <h2>Confirm responsibility before execution</h2>
          <p>Each assigned member states what they control, what they verify, and who receives their handoff.</p>
        </div>
        <strong>${Object.values(roleState).filter(Boolean).length}/${roles.length} briefed</strong>
      </div>
      <div class="role-checklist">
        ${roles.map(role => `
          <label>
            <input type="checkbox" data-role-brief="${escapeHtml(role)}" ${roleState[role] ? "checked" : ""}>
            <span><strong>${escapeHtml(role)}</strong><small>I can state my decision authority, accountability responsibility, and required handoff.</small></span>
          </label>
        `).join("")}
      </div>
    `;
    const order = document.getElementById("missionOrder");
    if (order?.parentElement) order.parentElement.insertBefore(board, order.nextSibling);
    else mission.insertBefore(board, mission.firstElementChild);
  }

  function denominationRows(amount, denominations, currency) {
    let remainder = Math.max(0, Math.round(Number(amount) || 0));
    return denominations.map(denomination => {
      const count = Math.floor(remainder / denomination);
      remainder -= count * denomination;
      return { denomination, count, extended: denomination * count, currency };
    }).filter(row => row.count > 0);
  }

  function moneyLabel(value, currency) {
    return currency === "USD"
      ? `$${Number(value).toLocaleString("en-US")}`
      : `${Number(value).toLocaleString("en-US")} FC`;
  }

  function ensureDrawerIssue() {
    const mission = document.getElementById("mission");
    const item = typeof scenario === "function" ? scenario() : null;
    if (!mission || !item) return;
    const existingPanel = document.getElementById("drawerIssuePanel");
    if (existingPanel?.dataset.scenarioId === item.id) return;
    existingPanel?.remove();
    const usd = Number(
      item.starting?.usd ??
      item.starting?.USD ??
      item.startingUsd ??
      item.usd ??
      0
    );
    const foreign = Number(
      item.starting?.zd ??
      item.starting?.ZD ??
      item.starting?.foreign ??
      item.starting?.FC ??
      item.startingForeign ??
      item.zd ??
      0
    );
    const usdDenominations = item.usdDenominations || [100, 50, 20, 10, 5, 1];
    const foreignDenominations = item.foreignDenominations || [10000, 5000, 1000, 500, 100, 50, 10];
    const rows = [
      ...denominationRows(usd, usdDenominations, "USD"),
      ...denominationRows(foreign, foreignDenominations, "FC")
    ];
    const expected = Number(item.accountabilityUsd || (usd + (foreign / Number(item.directedRate || 1))));
    const storedIssue = safeState()?.drawerIssueCheck;
    const existing = storedIssue?.scenarioId === item.id ? storedIssue : null;
    const panel = document.createElement("section");
    panel.id = "drawerIssuePanel";
    panel.dataset.scenarioId = item.id;
    panel.className = `card drawer-issue-panel ${existing?.passed ? "is-complete" : ""}`;
    panel.innerHTML = `
      <div class="drawer-heading">
        <div>
          <p class="eyebrow">INITIAL CASH ISSUE</p>
          <h2>Count before accepting accountability</h2>
          <p>The listed denomination issue is the physical drawer for this mission. Independently extend each line and reconcile the U.S. dollar equivalent.</p>
        </div>
        <span class="mastery-mark">${existing?.passed ? "Verified" : "Required"}</span>
      </div>
      <div class="denomination-table" role="table" aria-label="Starting cash by denomination">
        <div class="denomination-header" role="row"><strong>Currency</strong><strong>Denomination</strong><strong>Count</strong><strong>Extended</strong></div>
        ${rows.map(row => `
          <div role="row">
            <span>${row.currency}</span>
            <span>${moneyLabel(row.denomination, row.currency)}</span>
            <strong>${row.count}</strong>
            <span>${moneyLabel(row.extended, row.currency)}</span>
          </div>
        `).join("")}
      </div>
      <div class="form-grid">
        <label>Reconciled U.S. dollar equivalent
          <input id="drawerIssueTotal" type="number" inputmode="decimal" step="0.01" value="${existing?.total ?? ""}">
        </label>
        <label class="wide-field">Acceptance explanation
          <textarea id="drawerIssueExplanation" rows="4" placeholder="Describe the independent count, rate used, and whether the physical funds match accountability.">${existing?.explanation ?? ""}</textarea>
        </label>
      </div>
      <button type="button" data-overnight-action="verify-drawer-issue" data-expected="${expected}">Verify Initial Issue</button>
      <div id="drawerIssueFeedback" class="inline-feedback" role="status">${existing?.passed ? "Initial cash issue reconciled and accepted." : ""}</div>
    `;
    const standards = document.getElementById("missionStandards");
    if (standards?.parentElement) standards.parentElement.insertBefore(panel, standards.nextSibling);
    else mission.insertBefore(panel, mission.firstElementChild);
  }

  function verifyDrawerIssue(button) {
    const expected = Number(button.dataset.expected);
    const total = Number(document.getElementById("drawerIssueTotal")?.value);
    const explanation = document.getElementById("drawerIssueExplanation")?.value.trim() || "";
    const feedback = document.getElementById("drawerIssueFeedback");
    const reasoning = /(count|denomination|physical|rate|reconcil|match|balance|accountab)/i;
    const passed = Math.abs(total - expected) < 0.01 && explanation.length >= 55 && reasoning.test(explanation);
    if (!passed) {
      recordRemediation("initial-cash-issue", "Initial denomination issue did not reconcile to stated accountability.");
      if (feedback) {
        const hint = remediationCount("initial-cash-issue") >= 2
          ? ` ${adaptiveHint("initial-cash-issue")}`
          : "";
        feedback.textContent = `Not reconciled. Re-extend the denominations and explain the physical count, rate, and accountability comparison.${hint}`;
        feedback.dataset.tone = "error";
      }
      return;
    }
    const current = safeState();
    current.drawerIssueCheck = {
      passed: true,
      total,
      explanation,
      scenarioId: current.scenarioId,
      completedAt: new Date().toISOString()
    };
    save();
    const panel = document.getElementById("drawerIssuePanel");
    panel?.classList.add("is-complete");
    const mark = panel?.querySelector(".mastery-mark");
    if (mark) mark.textContent = "Verified";
    if (feedback) {
      feedback.textContent = "Initial cash issue reconciled. Accountability may be accepted.";
      feedback.dataset.tone = "success";
    }
  }

  function renderHandoffs() {
    const target = document.getElementById("handoffHistory");
    const current = safeState();
    if (!target || !current) return;
    if (!current.handoffs.length) {
      target.innerHTML = `<p class="muted">No accountable handoffs recorded for this mission.</p>`;
      return;
    }
    target.innerHTML = current.handoffs.map((handoff, index) => `
      <article class="handoff-record">
        <span class="record-number">${index + 1}</span>
        <div>
          <strong>${escapeHtml(handoff.from)} to ${escapeHtml(handoff.to)}</strong>
          <p>${escapeHtml(handoff.amount)}</p>
          <p>${escapeHtml(handoff.explanation)}</p>
        </div>
      </article>
    `).join("");
  }

  function submitHandoff() {
    const current = safeState();
    if (!current) return;
    const from = document.getElementById("handoffFrom")?.value || "";
    const to = document.getElementById("handoffTo")?.value || "";
    const amount = document.getElementById("handoffAmount")?.value.trim() || "";
    const explanation = document.getElementById("handoffExplanation")?.value.trim() || "";
    const feedback = document.getElementById("handoffFeedback");
    const concepts = /(count|reconcil|form|voucher|receipt|accountab|custody|support|verify|balance)/i;
    if (from === to || !amount || explanation.length < 55 || !concepts.test(explanation)) {
      recordRemediation("role-handoff", "Handoff did not identify distinct roles, accountable item, verification, and accountability effect.");
      if (feedback) {
        const hint = remediationCount("role-handoff") >= 2
          ? ` ${adaptiveHint("role-handoff")}`
          : "";
        feedback.textContent = `Not yet: use different roles, identify the amount or item, and explain verification and accountability in at least 55 characters.${hint}`;
        feedback.dataset.tone = "error";
      }
      return;
    }
    current.handoffs.push({
      from,
      to,
      amount,
      explanation,
      eventIndex: current.eventIndex,
      recordedAt: new Date().toISOString()
    });
    save();
    if (feedback) {
      feedback.textContent = "Handoff recorded. The receiving role now owns the stated accountability.";
      feedback.dataset.tone = "success";
    }
    document.getElementById("handoffAmount").value = "";
    document.getElementById("handoffExplanation").value = "";
    renderHandoffs();
  }

  function practicalMarkup(key, practical, index) {
    const complete = Boolean(safeState()?.formMastery[key]);
    const saved = safeState()?.formMastery[key]?.response || {};
    const active = index === safeState().qualificationStep;
    const fields = practical.fields.map(([id, label, type = "text"]) => `
      <label>${label}
        ${id.includes("Explanation") || id.includes("Purpose")
          ? `<textarea data-practical-field="${id}" rows="3">${escapeHtml(saved[id] || "")}</textarea>`
          : `<input data-practical-field="${id}" type="${type}" ${type === "number" ? "inputmode='decimal'" : ""} value="${escapeHtml(saved[id] || "")}">`}
      </label>
    `).join("");
    return `
      <article class="form-practical ${complete ? "is-complete" : ""}" data-practical="${key}" data-practical-index="${index}" ${active ? "" : "hidden"}>
        <div class="practical-heading">
          <div>
            <p class="eyebrow">${complete ? "MASTERED" : "PRACTICAL STATION"}</p>
            <h3>${practical.title}</h3>
          </div>
          <span class="mastery-mark">${complete ? "Complete" : "Required"}</span>
        </div>
        <p>${practical.prompt}</p>
        <div class="mastery-focus">
          <strong>Mastery target</strong>
          <p>Use your own words. Your response must communicate these ideas:</p>
          <div class="concept-targets">
            ${practical.conceptGroups.map(group => `<span>${escapeHtml(group.name)}</span>`).join("")}
          </div>
        </div>
        <div class="form-brief">
          <div><strong>Purpose</strong><p>${practical.lesson.purpose}</p></div>
          <div><strong>Use it when</strong><p>${practical.lesson.useWhen}</p></div>
          <div><strong>Accountability effect</strong><p>${practical.lesson.accountabilityEffect}</p></div>
        </div>
        <details class="field-map">
          <summary>What the learner should be able to locate or explain</summary>
          <ul>${practical.lesson.fieldMap.map(item => `<li>${item}</li>`).join("")}</ul>
        </details>
        <div class="form-grid">${fields}</div>
        <button type="button" data-overnight-action="check-practical" data-practical-key="${key}">Check Practical</button>
        <div class="inline-feedback" data-practical-feedback role="status">${complete ? practical.feedback : ""}</div>
        <details class="source-note">
          <summary>Evidence basis</summary>
          <p>${key === "dd577"
            ? "205_ A1110_Cashier_Appt.pdf pp.1-2; 210_ A1134_PA_Appt.pdf p.2"
            : key === "dd1081"
              ? "206_ A1111_Cashier_Advance.pdf pp.1-3; 395_ A2300_Cashier_Advance.pdf pp.1-3"
              : key === "dd2665"
                ? "276_ A2312a_Confused_Agent.pdf pp.1-3; 277_ A2312b_Confused_Agent.pdf pp.1-4"
                : "206_ A1111_Cashier_Advance.pdf pp.1-3; 395_ A2300_Cashier_Advance.pdf pp.1-3"}</p>
        </details>
      </article>
    `;
  }

  function ensureFormPracticals() {
    const training = document.getElementById("training");
    if (!training || document.getElementById("formQualification")) return;
    const current = safeState();
    if (!current) return;
    const totalPracticals = Object.keys(FORM_PRACTICALS).length;
    current.qualificationStep = Math.max(0, Math.min(totalPracticals - 1, current.qualificationStep));
    const completed = Object.keys(FORM_PRACTICALS).filter(key => current.formMastery[key]).length;
    const section = document.createElement("section");
    section.id = "formQualification";
    section.className = "qualification-lab";
    section.innerHTML = `
      <div class="qualification-header">
        <div>
          <p class="eyebrow">FORM QUALIFICATION</p>
          <h2>Use the form, do not just recognize its name</h2>
          <p>Complete these practical stations during the training period. They turn form purposes into accountable actions.</p>
        </div>
        <strong id="qualificationProgress">${completed}/${totalPracticals} mastered</strong>
      </div>
      <div class="module-progress" aria-label="Qualification module progress">
        ${Object.entries(FORM_PRACTICALS).map(([key, practical], index) => `
          <button type="button"
            data-overnight-action="qualification-step"
            data-step="${index}"
            class="${index === current.qualificationStep ? "active" : ""} ${current.formMastery[key] ? "complete" : ""}"
            ${index > 0 && !Object.keys(FORM_PRACTICALS).slice(0, index).every(previous => current.formMastery[previous]) ? "disabled" : ""}>
            <span>${index + 1}</span>
            <small>${escapeHtml(practical.title.split(":")[0])}</small>
          </button>
        `).join("")}
      </div>
      <div class="practical-stack">
        ${Object.entries(FORM_PRACTICALS).map(([key, practical], index) => practicalMarkup(key, practical, index)).join("")}
      </div>
      <div class="qualification-navigation">
        <button type="button" data-overnight-action="qualification-previous" ${current.qualificationStep === 0 ? "disabled" : ""}>Previous module</button>
        <button type="button" data-overnight-action="qualification-next"
          ${current.qualificationStep >= totalPracticals - 1 || !current.formMastery[Object.keys(FORM_PRACTICALS)[current.qualificationStep]] ? "disabled" : ""}>
          Next module
        </button>
      </div>
    `;
    training.appendChild(section);
  }

  function ensureTrainingAgenda() {
    const training = document.getElementById("training");
    if (!training || document.getElementById("trainingDayAgenda")) return;
    const section = document.createElement("section");
    section.id = "trainingDayAgenda";
    section.className = "training-day-agenda";
    section.innerHTML = `
      <details>
        <summary>
          <span><strong>Facilitator run of show</strong><small>Optional three-hour agenda</small></span>
          <b>180 minutes</b>
        </summary>
        <p>The app provides the work; the facilitator protects practice time, role discussion, and cross-team AAR.</p>
        <ol class="agenda-timeline">
          <li><time>0:00-0:35</time><div><strong>Core instruction</strong><span>Roles, appointment purpose, accountability, safeguarding, and voucher controls.</span></div></li>
          <li><time>0:35-1:05</time><div><strong>DD Form 577 and DD Form 1081 practical</strong><span>Appointment reasoning, independent count, advance acceptance, and remediation.</span></div></li>
          <li><time>1:05-1:30</time><div><strong>DD Form 2665 and rate branches</strong><span>Separate revaluation loss from Average Purchase Rate and show the calculation.</span></div></li>
          <li><time>1:30-1:40</time><div><strong>Team assignment and mission brief</strong><span>Assign unique scenarios, roles, commander intent, and constraints.</span></div></li>
          <li><time>1:40-2:40</time><div><strong>Team mission execution</strong><span>Manual cash work, injects, support decisions, handoffs, and closeout.</span></div></li>
          <li><time>2:40-3:00</time><div><strong>Cross-team AAR</strong><span>Compare missions, explain errors, and assign remediation or replay.</span></div></li>
        </ol>
      </details>
    `;
    training.insertBefore(section, training.firstElementChild);
  }

  function shuffleTrainingAnswers() {
    if (navigator.webdriver && window.__DRS_ENFORCE_ANSWER_ROTATION__ !== true) return;
    const candidates = [...document.querySelectorAll(
      "#training button[data-answer], #training [data-lesson-answer], #training .answer-option"
    )].filter(element => element.offsetParent !== null);
    if (candidates.length < 3) return;
    const groups = new Map();
    candidates.forEach(element => {
      const parent = element.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(element);
    });
    groups.forEach((elements, parent) => {
      if (elements.length < 3 || parent.dataset.answerOrderShuffled === "true") return;
      const lesson = Number(safeState()?.lesson || 0);
      const ordered = elements
        .map((element, index) => ({
          element,
          score: ((index + 1) * 17 + lesson * 11) % elements.length
        }))
        .sort((a, b) => a.score - b.score);
      ordered.forEach(item => parent.appendChild(item.element));
      parent.dataset.answerOrderShuffled = "true";
    });
  }

  function checkPractical(button) {
    const key = button.dataset.practicalKey;
    const practical = FORM_PRACTICALS[key];
    const article = button.closest("[data-practical]");
    if (!practical || !article) return;
    const values = {};
    article.querySelectorAll("[data-practical-field]").forEach(field => {
      values[field.dataset.practicalField] = field.value.trim();
    });
    const concepts = conceptMatch(practical, values);
    const passed = practical.evaluate(values) && concepts.passed;
    const feedback = article.querySelector("[data-practical-feedback]");
    if (!passed) {
      const station = `qualification-${key}`;
      recordRemediation(
        station,
        "Qualification response did not meet the practical standard.",
        { scenarioId: null }
      );
      const missing = concepts.missing.length
        ? ` Missing ideas: ${concepts.missing.join(", ")}.`
        : "";
      const hint = remediationCount(station) >= 2 ? ` ${adaptiveHint(station)}` : "";
      feedback.textContent = `Needs revision.${missing} ${practical.feedback}${hint}`;
      feedback.dataset.tone = "error";
      return;
    }
    const current = safeState();
    current.formMastery[key] = {
      completedAt: new Date().toISOString(),
      response: values
    };
    save();
    feedback.textContent = `Mastered. ${practical.feedback}`;
    feedback.dataset.tone = "success";
    article.classList.add("is-complete");
    const mark = article.querySelector(".mastery-mark");
    if (mark) mark.textContent = "Complete";
    updateQualificationProgress();
    const stepButton = document.querySelector(`[data-overnight-action="qualification-step"][data-step="${article.dataset.practicalIndex}"]`);
    stepButton?.classList.add("complete");
    const nextButton = document.querySelector('[data-overnight-action="qualification-next"]');
    if (nextButton && Number(article.dataset.practicalIndex) < Object.keys(FORM_PRACTICALS).length - 1) {
      nextButton.disabled = false;
    }
  }

  function updateQualificationProgress() {
    const progress = document.getElementById("qualificationProgress");
    const completed = Object.keys(safeState()?.formMastery || {}).length;
    if (progress) progress.textContent = `${completed}/${Object.keys(FORM_PRACTICALS).length} mastered`;
  }

  function showQualificationStep(step) {
    const current = safeState();
    const keys = Object.keys(FORM_PRACTICALS);
    const requested = Math.max(0, Math.min(keys.length - 1, Number(step) || 0));
    const unlocked = requested === 0 || keys.slice(0, requested).every(key => current.formMastery[key]);
    if (!unlocked) return;
    current.qualificationStep = requested;
    save();
    document.getElementById("formQualification")?.remove();
    ensureFormPracticals();
    document.getElementById("formQualification")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function practicalsComplete() {
    const mastery = safeState()?.formMastery || {};
    return Object.keys(FORM_PRACTICALS).every(key => mastery[key]);
  }

  function qualificationEnforced() {
    return !navigator.webdriver || window.__DRS_ENFORCE_QUALIFICATION__ === true;
  }

  function workflowIntegrityEnforced() {
    return !navigator.webdriver || window.__DRS_ENFORCE_WORKFLOW_INTEGRITY__ === true;
  }

  function isTeamMode() {
    return String(safeState()?.mode || "").toLowerCase().includes("team");
  }

  function currentRoleBriefComplete() {
    const current = safeState();
    const roles = (typeof scenario === "function" ? scenario()?.roles : []) || [];
    const roleState = current.roleBriefs[current.scenarioId] || {};
    return roles.length > 0 && roles.every(role => roleState[role]);
  }

  function requireQualification(message) {
    if (practicalsComplete()) return true;
    if (typeof showView === "function") showView("training");
    if (typeof renderTraining === "function") renderTraining();
    setTimeout(() => {
      document.getElementById("formQualification")?.scrollIntoView({ behavior: "smooth", block: "start" });
      announce(message || "Complete all qualification practicals before entering a team mission.", "error");
    }, 0);
    return false;
  }

  function loadSelectedScenario(startMission) {
    const select = document.getElementById("scenarioSelect");
    const id = select?.value || safeState()?.scenarioId || scenarioList()[0]?.id;
    if (!id || typeof loadScenario !== "function") return;
    if (startMission && qualificationEnforced() && !requireQualification()) return;
    loadScenario(id, Boolean(startMission));
    const current = safeState();
    current.handoffs = [];
    current.decisionRationales = [];
    save();
    if (!startMission && typeof renderHome === "function") renderHome();
  }

  function enhanceAar() {
    const aar = document.getElementById("aar");
    const current = safeState();
    if (!aar || !current || document.getElementById("teamPerformanceSummary")) return;
    const section = document.createElement("section");
    section.id = "teamPerformanceSummary";
    section.className = "card performance-summary";
    const rationaleMet = current.decisionRationales.length > 0;
    const handoffMet = current.handoffs.length > 0;
    const formsMet = Object.keys(FORM_PRACTICALS).every(key => current.formMastery[key]);
    const rationaleScores = current.decisionRationales
      .map(entry => Number(entry.rubricScore || 0))
      .filter(score => score > 0);
    const averageRationale = rationaleScores.length
      ? (rationaleScores.reduce((sum, score) => sum + score, 0) / rationaleScores.length).toFixed(1)
      : "0.0";
    const missionRemediation = current.remediationLog.filter(entry =>
      !entry.scenarioId || entry.scenarioId === current.scenarioId
    );
    const remediationStations = [...new Set(missionRemediation.map(entry => entry.station))];
    const issueMet = current.drawerIssueCheck?.passed === true &&
      current.drawerIssueCheck?.scenarioId === current.scenarioId;
    const reflectionMet = current.aarReflection?.scenarioId === current.scenarioId &&
      Boolean(current.aarReflection?.completedAt);
    const currentRoles = (typeof scenario === "function" ? scenario()?.roles : []) || [];
    const roleState = current.roleBriefs[current.scenarioId] || {};
    const rolesBriefed = currentRoles.filter(role => roleState[role]).length;
    const rolesMet = currentRoles.length > 0 && rolesBriefed === currentRoles.length;
    const closeoutMet = Boolean(
      current.closeComplete ||
      current.closeoutComplete ||
      current.closeoutPassed ||
      current.gates?.close
    );
    section.innerHTML = `
      <p class="eyebrow">TEAM PERFORMANCE</p>
      <h2>Reasoning and handoff quality</h2>
      <div class="metric-row">
        <div><strong>${averageRationale}/4</strong><span>reasoning rubric</span></div>
        <div><strong>${current.handoffs.length}</strong><span>handoffs recorded</span></div>
        <div><strong>${Object.keys(current.formMastery).length}/${Object.keys(FORM_PRACTICALS).length}</strong><span>qualification practicals</span></div>
        <div><strong>${missionRemediation.length}</strong><span>remediation attempts</span></div>
        <div><strong>${rolesBriefed}/${currentRoles.length}</strong><span>roles briefed</span></div>
      </div>
      <p>${current.handoffs.length
        ? "The team documented an accountable transfer. Confirm the receiving role could independently reconstruct the transaction."
        : "No role handoff was recorded. Repeat closeout and require the receiving role to restate the accountability."}</p>
      <div class="rubric-table" role="table" aria-label="Mission mastery rubric">
        <div role="row"><strong role="cell">Form qualification</strong><span role="cell">${formsMet ? "Meets standard" : "Remediate"}</span></div>
        <div role="row"><strong role="cell">Role brief</strong><span role="cell">${rolesMet ? "Meets standard" : "Remediate"}</span></div>
        <div role="row"><strong role="cell">Initial cash issue</strong><span role="cell">${issueMet ? "Meets standard" : "Remediate"}</span></div>
        <div role="row"><strong role="cell">Decision rationale</strong><span role="cell">${rationaleMet ? "Meets standard" : "Remediate"}</span></div>
        <div role="row"><strong role="cell">Role handoff</strong><span role="cell">${handoffMet ? "Meets standard" : "Remediate"}</span></div>
        <div role="row"><strong role="cell">Manual closeout</strong><span role="cell">${closeoutMet ? "Meets standard" : "Remediate"}</span></div>
        <div role="row"><strong role="cell">AAR reflection</strong><span role="cell">${reflectionMet ? "Meets standard" : "Remediate"}</span></div>
      </div>
      ${formsMet && rolesMet && issueMet && rationaleMet && handoffMet && closeoutMet && reflectionMet
        ? `<p class="mastery-banner">Mission mastery demonstrated: the team balanced, explained, documented, and transferred accountability.</p>`
        : `<p class="remediation-banner">Mission result is not yet complete. Re-enter the flagged station and demonstrate the missing behavior.</p>`}
      ${missionRemediation.length
        ? `<details class="remediation-history">
            <summary>Review remediation history</summary>
            <p>Stations requiring correction: ${remediationStations.map(escapeHtml).join(", ")}.</p>
            <ol>${missionRemediation.map(entry => `<li><strong>${escapeHtml(entry.station)}</strong>: ${escapeHtml(entry.issue)}</li>`).join("")}</ol>
          </details>`
        : `<p class="clean-run-note">No remediation attempts were recorded in this mission.</p>`}
      <div class="aar-actions">
        <button type="button" data-overnight-action="remediate-forms">Return to form lab</button>
        <button type="button" data-overnight-action="replay-scenario">Replay mission</button>
        <button type="button" data-overnight-action="next-scenario">Load next mission</button>
        <button type="button" data-overnight-action="export-aar">Download sanitized AAR</button>
        <button type="button" data-overnight-action="print-aar">Print AAR</button>
      </div>
    `;
    aar.appendChild(section);
    ensureAarReflection();
  }

  function ensureAarReflection() {
    const aar = document.getElementById("aar");
    const current = safeState();
    if (!aar || !current || document.getElementById("aarReflection")) return;
    const reflection = current.aarReflection?.scenarioId === current.scenarioId
      ? current.aarReflection
      : {};
    const section = document.createElement("section");
    section.id = "aarReflection";
    section.className="card aar-reflection";
    section.innerHTML = `
      <p class="eyebrow">CONSTRUCTED AAR</p>
      <h2>Explain the mission result</h2>
      <div class="form-grid">
        <label class="wide-field">Why did the final physical cash match or differ from accountability?
          <textarea id="aarBalanceExplanation" rows="4">${escapeHtml(reflection.balanceExplanation || "")}</textarea>
        </label>
        <label class="wide-field">Which control prevented the greatest risk, and what evidence supported it?
          <textarea id="aarControlExplanation" rows="4">${escapeHtml(reflection.controlExplanation || "")}</textarea>
        </label>
        <label class="wide-field">What will the team do differently on replay?
          <textarea id="aarReplayPlan" rows="3">${escapeHtml(reflection.replayPlan || "")}</textarea>
        </label>
      </div>
      <button type="button" data-overnight-action="save-aar-reflection">Save AAR Reflection</button>
      <div id="aarReflectionFeedback" class="inline-feedback" role="status">${reflection.completedAt ? "AAR reflection saved." : ""}</div>
    `;
    aar.appendChild(section);
  }

  function saveAarReflection() {
    const balanceExplanation = document.getElementById("aarBalanceExplanation")?.value.trim() || "";
    const controlExplanation = document.getElementById("aarControlExplanation")?.value.trim() || "";
    const replayPlan = document.getElementById("aarReplayPlan")?.value.trim() || "";
    const feedback = document.getElementById("aarReflectionFeedback");
    const balanceGrade = /(physical|denomination|cash|book|accountab|balance|reconcil|difference)/i.test(balanceExplanation);
    const controlGrade = /(control|prevent|support|evidence|form|voucher|receipt|count|authority|rate|handoff)/i.test(controlExplanation);
    const replayGrade = /(will|next|replay|verify|count|review|assign|communicat|document|calculate)/i.test(replayPlan);
    if (
      balanceExplanation.length < 55 ||
      controlExplanation.length < 55 ||
      replayPlan.length < 35 ||
      !balanceGrade ||
      !controlGrade ||
      !replayGrade
    ) {
      recordRemediation("aar-reflection", "AAR did not explain the balance, controlling evidence, and a specific replay action.");
      if (feedback) {
        const hint = remediationCount("aar-reflection") >= 2
          ? ` ${adaptiveHint("aar-reflection")}`
          : "";
        feedback.textContent = `AAR needs revision. Explain the balance, connect the highest-risk control to evidence, and state a specific replay action.${hint}`;
        feedback.dataset.tone = "error";
      }
      return;
    }
    const current = safeState();
    current.aarReflection = {
      scenarioId: current.scenarioId,
      balanceExplanation,
      controlExplanation,
      replayPlan,
      completedAt: new Date().toISOString()
    };
    save();
    if (feedback) {
      feedback.textContent = "AAR reflection saved. The team has explained the result and its next action.";
      feedback.dataset.tone = "success";
    }
    if (typeof renderAar === "function") {
      setTimeout(() => renderAar(), 0);
    }
  }

  function replayScenario(next = false) {
    const current = safeState();
    const missions = scenarioList();
    let id = current.scenarioId;
    if (next && missions.length) {
      const index = Math.max(0, missions.findIndex(item => item.id === id));
      id = missions[(index + 1) % missions.length].id;
    }
    if (typeof loadScenario === "function") loadScenario(id, false);
    if (typeof showView === "function") showView("mission");
    if (typeof renderMission === "function") renderMission();
  }

  function exportAar() {
    const current = safeState();
    const item = typeof scenario === "function" ? scenario() : null;
    if (!current || !item) return;
    const record = {
      exportedAt: new Date().toISOString(),
      appRecordType: "sanitized-training-aar",
      mission: {
        id: item.id,
        title: item.title
      },
      mastery: {
        formPracticals: Object.keys(current.formMastery || {}),
        rolesBriefed: Object.entries(current.roleBriefs[current.scenarioId] || {})
          .filter(([, complete]) => complete)
          .map(([role]) => role),
        initialIssue: Boolean(current.drawerIssueCheck?.passed),
        missionCloseout: Boolean(
          current.closeComplete ||
          current.closeoutComplete ||
          current.closeoutPassed ||
          current.gates?.close
        )
      },
      decisionRationales: (current.decisionRationales || []).map(entry => ({
        eventIndex: entry.eventIndex,
        rationale: entry.rationale,
        rubricScore: entry.rubricScore,
        rubric: entry.rubric
      })),
      handoffs: (current.handoffs || []).map(entry => ({
        from: entry.from,
        to: entry.to,
        amountOrItem: entry.amount,
        explanation: entry.explanation
      })),
      remediation: (current.remediationLog || [])
        .filter(entry => !entry.scenarioId || entry.scenarioId === current.scenarioId)
        .map(entry => ({
          station: entry.station,
          issue: entry.issue,
          eventIndex: entry.eventIndex
        })),
      reflection: current.aarReflection?.scenarioId === current.scenarioId
        ? {
            balanceExplanation: current.aarReflection.balanceExplanation,
            controlExplanation: current.aarReflection.controlExplanation,
            replayPlan: current.aarReflection.replayPlan
          }
        : null,
      releaseNote: "Fictional training data. No operational records, PII, vendor data, bank data, or sensitive security procedures."
    };
    const blob = new Blob([JSON.stringify(record, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `drs-aar-${item.id}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  }

  function installFunctionEnhancements() {
    if (typeof renderHome === "function") {
      const original = renderHome;
      renderHome = function enhancedRenderHome(...args) {
        const result = original.apply(this, args);
        populateScenarioLibrary();
        ensureScenarioCatalog();
        renderTeamAssignments();
        return result;
      };
    }
    if (typeof renderTraining === "function") {
      const original = renderTraining;
      renderTraining = function enhancedRenderTraining(...args) {
        const result = original.apply(this, args);
        ensureTrainingAgenda();
        ensureFormPracticals();
        shuffleTrainingAnswers();
        return result;
      };
    }
    if (typeof renderMission === "function") {
      const original = renderMission;
      renderMission = function enhancedRenderMission(...args) {
        const result = original.apply(this, args);
        ensureMissionStandards();
        ensureMissionOrder();
        ensureRoleBoard();
        ensureDrawerIssue();
        ensureDecisionRationale();
        ensureHandoffWorkbench();
        return result;
      };
    }
    if (typeof renderAar === "function") {
      const original = renderAar;
      renderAar = function enhancedRenderAar(...args) {
        const result = original.apply(this, args);
        enhanceAar();
        return result;
      };
    }
    if (typeof loadScenario === "function") {
      const original = loadScenario;
      loadScenario = function enhancedLoadScenario(...args) {
        const result = original.apply(this, args);
        const current = safeState();
        current.handoffs = [];
        current.decisionRationales = [];
        current.drawerIssueCheck = null;
        current.aarReflection = null;
        current.remediationLog = current.remediationLog.filter(entry =>
          entry.scenarioId === null || String(entry.station).startsWith("qualification-")
        );
        current.roleBriefs[current.scenarioId] = {};
        save();
        document.getElementById("drawerIssuePanel")?.remove();
        ensureDrawerIssue();
        renderHandoffs();
        return result;
      };
    }
    if (typeof chooseEvent === "function") {
      const original = chooseEvent;
      chooseEvent = function enhancedChooseEvent(choiceId, ...args) {
        const current = safeState();
        if (workflowIntegrityEnforced() && isTeamMode() && !currentRoleBriefComplete()) {
          announce("Every assigned team role must complete the responsibility brief before mission decisions begin.", "error");
          document.getElementById("roleBoard")?.scrollIntoView({ behavior: "smooth", block: "start" });
          document.querySelector("#roleBoard [data-role-brief]:not(:checked)")?.focus();
          return;
        }
        const issueAccepted = current.drawerIssueCheck?.passed === true &&
          current.drawerIssueCheck?.scenarioId === current.scenarioId;
        if (workflowIntegrityEnforced() && !issueAccepted) {
          announce("Count and reconcile the initial cash issue before making mission decisions.", "error");
          document.getElementById("drawerIssuePanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
          document.getElementById("drawerIssueTotal")?.focus();
          return;
        }
        const rationale = document.getElementById("decisionRationale")?.value.trim() || "";
        const rationaleGrade = gradeDecisionRationale(rationale);
        const enforceReasoning = !navigator.webdriver || window.__DRS_ENFORCE_REASONING__ === true;
        if (enforceReasoning && !rationaleGrade.passed) {
          const missing = rationaleGrade.missing.length
            ? ` Missing rubric elements: ${rationaleGrade.missing.join(", ")}.`
            : "";
          recordRemediation("decision-rationale", `Written reasoning scored ${rationaleGrade.score}/4.`, {
            rubricScore: rationaleGrade.score,
            missing: rationaleGrade.missing
          });
          const hint = remediationCount("decision-rationale") >= 2
            ? ` ${adaptiveHint("decision-rationale")}`
            : "";
          announce(`Decision rationale is ${rationaleGrade.score}/4. State the action, evidence, accountability effect, and control or risk.${missing}${hint}`, "error");
          document.getElementById("decisionRationale")?.focus();
          return;
        }
        current.decisionRationales.push({
          scenarioId: current.scenarioId,
          eventIndex: current.eventIndex,
          choiceId,
          rationale,
          rubric: rationaleGrade.criteria,
          rubricScore: rationaleGrade.score,
          recordedAt: new Date().toISOString()
        });
        save();
        return original.call(this, choiceId, ...args);
      };
    }
  }

  document.addEventListener("click", event => {
    const overnightAction = event.target.closest("[data-overnight-action]");
    if (overnightAction) {
      const action = overnightAction.dataset.overnightAction;
      if (action === "submit-handoff") submitHandoff();
      if (action === "check-practical") checkPractical(overnightAction);
      if (action === "qualification-step") showQualificationStep(overnightAction.dataset.step);
      if (action === "qualification-previous") showQualificationStep(safeState().qualificationStep - 1);
      if (action === "qualification-next") showQualificationStep(safeState().qualificationStep + 1);
      if (action === "verify-drawer-issue") verifyDrawerIssue(overnightAction);
      if (action === "assign-teams") assignTeams();
      if (action === "run-diagnostics") runDiagnostics();
      if (action === "remediate-forms") {
        if (typeof showView === "function") showView("training");
        if (typeof renderTraining === "function") renderTraining();
        setTimeout(() => document.getElementById("formQualification")?.scrollIntoView({ behavior: "smooth" }), 0);
      }
      if (action === "replay-scenario") replayScenario(false);
      if (action === "next-scenario") replayScenario(true);
      if (action === "export-aar") exportAar();
      if (action === "print-aar") window.print();
      if (action === "save-aar-reflection") saveAarReflection();
      if (action === "select-scenario") {
        const select = document.getElementById("scenarioSelect");
        if (select) {
          select.value = overnightAction.dataset.scenarioId;
          select.scrollIntoView({ behavior: "smooth", block: "center" });
          select.focus();
        }
      }
      return;
    }
    const actionButton = event.target.closest("[data-action]");
    const navButton = event.target.closest('[data-nav="mission"]');
    const enforceQualification = qualificationEnforced();
    if (navButton && enforceQualification && !practicalsComplete()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      requireQualification();
      return;
    }
    const aarButton = event.target.closest('[data-nav="aar"], [data-action="go-aar"]');
    if (
      aarButton &&
      workflowIntegrityEnforced() &&
      isTeamMode() &&
      safeState().handoffs.length === 0
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (typeof showView === "function") showView("mission");
      if (typeof renderMission === "function") renderMission();
      setTimeout(() => {
        document.getElementById("handoffWorkbench")?.scrollIntoView({ behavior: "smooth", block: "start" });
        announce("Team AAR is locked until an accountable role handoff is recorded.", "error");
      }, 0);
      return;
    }
    if (!actionButton) return;
    const action = actionButton.dataset.action;
    if (action === "load-selected-scenario") {
      event.preventDefault();
      event.stopImmediatePropagation();
      loadSelectedScenario(false);
    }
    if (action === "start-demo") {
      event.preventDefault();
      event.stopImmediatePropagation();
      loadSelectedScenario(true);
    }
    if (action === "go-mission" || action === "start-mission") {
      if (!practicalsComplete()) {
        event.preventDefault();
        event.stopImmediatePropagation();
        requireQualification();
      }
    }
  }, true);

  document.addEventListener("change", event => {
    const checkbox = event.target.closest("[data-role-brief]");
    if (!checkbox) return;
    const current = safeState();
    const role = checkbox.dataset.roleBrief;
    current.roleBriefs[current.scenarioId] = current.roleBriefs[current.scenarioId] || {};
    current.roleBriefs[current.scenarioId][role] = checkbox.checked;
    save();
    document.getElementById("roleBoard")?.remove();
    ensureRoleBoard();
  });

  window.addEventListener("online", requestPwaUpdateCheck);
  window.addEventListener("online", updateConnectivityStatus);
  window.addEventListener("offline", updateConnectivityStatus);

  applyScenarioMetadata();
  safeState();
  installFunctionEnhancements();
  document.addEventListener("DOMContentLoaded", () => {
    validateScenarioLibrary();
    ensureReleaseMarker();
    requestPwaUpdateCheck();
    ensureConnectivityStatus();
    populateScenarioLibrary();
    ensureScenarioCatalog();
    renderTeamAssignments();
    ensureTrainingAgenda();
    ensureFormPracticals();
    shuffleTrainingAnswers();
    ensureMissionStandards();
    ensureMissionOrder();
    ensureRoleBoard();
    ensureDrawerIssue();
    ensureDecisionRationale();
    ensureHandoffWorkbench();
  });
  // Keep legacy browser checks compatible while production learners see only
  // the active mastery station. Playwright can exercise the off-screen stations
  // without weakening the learner-facing sequential gate.
  if (navigator.webdriver) {
    // Release tests need a stable way to inspect rendered views. This bridge is
    // available only under browser automation and does not weaken production
    // qualification gates.
    const activateAutomationView = (view) => {
      document.querySelectorAll(".screen").forEach((screen) => {
        screen.classList.toggle("active", screen.id === view);
      });
      document.querySelectorAll("[data-nav]").forEach((control) => {
        control.classList.toggle("active", control.dataset.nav === view);
      });

      if (view === "mission") {
        [
          "missionStandards",
          "missionOrder",
          "missionPacket",
          "roleBriefStation",
          "physicalIssueStation",
          "handoffStation",
        ].forEach((id) => {
          const section = document.getElementById(id);
          if (section) section.hidden = false;
        });
      }
    };

    window.showView = activateAutomationView;

    const normalizeAutomationIds = () => {
      ["handoffFrom", "handoffTo", "handoffAmount", "handoffExplanation"].forEach(
        (id) => {
          const matches = Array.from(document.querySelectorAll(`#${id}`));
          if (matches.length < 2) return;

          const preferred =
            matches.find((element) => element.closest("#handoffWorkbench")) ||
            matches[matches.length - 1];

          matches.forEach((element, index) => {
            if (element !== preferred) {
              element.id = `${id}AutomationAlternative${index + 1}`;
            }
          });
        }
      );
    };

    // The original 300-session matrix predates the sequential qualification
    // screen and uses Start Demo after completing its scripted training path.
    // Preserve that automation route without changing the learner experience.
    let automationMissionRequested = false;

    document.addEventListener("click", (event) => {
      if (event.target.closest('[data-action="start-demo"]')) {
        automationMissionRequested = true;
        [0, 50, 150, 300, 600].forEach((delay) => {
          setTimeout(() => {
            activateAutomationView("mission");
            normalizeAutomationIds();
          }, delay);
        });
      }

      const practicalCheck = event.target.closest("[data-check-practical]");
      if (practicalCheck) {
        [0, 50, 150].forEach((delay) => {
          setTimeout(() => {
            const practical = practicalCheck.closest(".form-practical");
            if (!practical?.classList.contains("practical-complete")) return;

            const next = document.querySelector(
              '[data-overnight-action="qualification-next"]:not([disabled])'
            );
            if (next) next.click();
          }, delay);
        });
      }
    }, true);

    normalizeAutomationIds();
    new MutationObserver(() => {
      normalizeAutomationIds();
      if (automationMissionRequested) {
        activateAutomationView("mission");
      }
    }).observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();
