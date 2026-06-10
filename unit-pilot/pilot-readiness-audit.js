(function () {
  "use strict";

  const assets = [
    "unit-pilot-v2.html",
    "unit-pilot-v2.css",
    "unit-pilot-v2.js",
    "facilitator-runbook.css",
    "facilitator-runbook.js",
    "facilitator-assignment-board.css",
    "facilitator-assignment-board.js",
    "facilitator-observation-rubric.css",
    "facilitator-observation-rubric.js",
    "unit-pilot-polish.css",
    "pilot-feedback.css",
    "pilot-feedback.js",
    "manifest-v2.json",
    "service-worker-v2.js"
  ];

  let lastResults = [];

  function result(id, label, status, detail) {
    return { id, label, status, detail };
  }

  function count(selector) {
    return document.querySelectorAll(selector).length;
  }

  function missionRecordCount() {
    const text = document.body ? document.body.textContent || "" : "";
    const found = new Set();
    const matches = text.match(/M-0[1-7]/g) || [];
    matches.forEach((match) => found.add(match));
    return found.size;
  }

  function localStorageCheck() {
    const key = "drsPilotAuditProbe";
    try {
      localStorage.setItem(key, "ready");
      const readable = localStorage.getItem(key) === "ready";
      localStorage.removeItem(key);
      return readable;
    } catch (error) {
      return false;
    }
  }

  function assignmentCheck() {
    try {
      const state = JSON.parse(localStorage.getItem("drsUnitPilotAssignments") || "null");
      if (!state || !Array.isArray(state.teams)) {
        return result("assignments", "Team assignments", "warning", "No team launch board has been prepared on this device.");
      }
      const named = state.teams.filter((team) => team.name && team.name.trim());
      if (!named.length) {
        return result("assignments", "Team assignments", "warning", "Enter team names and assign routes before the event.");
      }
      const unassigned = named.filter((team) => !team.missionId);
      const missionIds = named.map((team) => team.missionId).filter(Boolean);
      const duplicates = missionIds.filter((missionId, index) => missionIds.indexOf(missionId) !== index);
      if (unassigned.length) {
        return result("assignments", "Team assignments", "fail", unassigned.length + " named team(s) do not have a mission.");
      }
      if (named.length <= 7 && duplicates.length) {
        return result("assignments", "Team assignments", "fail", "Mission routes repeat even though seven or fewer teams are named.");
      }
      return result("assignments", "Team assignments", "pass", named.length + " team(s) have mission routes" + (state.locked ? " and the board is locked." : "; lock the board after final review."));
    } catch (error) {
      return result("assignments", "Team assignments", "fail", "The saved assignment record cannot be read.");
    }
  }

  function observationCheck() {
    try {
      const state = JSON.parse(localStorage.getItem("drsUnitPilotObservations") || "null");
      if (!state || !state.records || !Object.keys(state.records).length) {
        return result("observations", "Observation records", "warning", "No facilitator observation has been started. This is expected before team execution.");
      }
      const incomplete = Object.values(state.records).filter((record) => {
        const ratings = record && record.ratings ? record.ratings : {};
        return ["control", "forms", "calculation", "handoff", "explanation"].some((id) => !Number(ratings[id]));
      });
      return incomplete.length
        ? result("observations", "Observation records", "warning", incomplete.length + " team observation(s) are incomplete.")
        : result("observations", "Observation records", "pass", "Every started observation includes all five behaviors.");
    } catch (error) {
      return result("observations", "Observation records", "fail", "The saved observation record cannot be read.");
    }
  }

  async function assetChecks() {
    if (location.protocol === "file:") {
      return [
        result("assets", "Offline asset requests", "warning", "Asset fetch verification requires the hosted PWA or local web server; file mode cannot prove cache delivery.")
      ];
    }
    const responses = await Promise.all(assets.map(async (asset) => {
      try {
        const response = await fetch(asset, { cache: "no-store" });
        return { asset, ok: response.ok };
      } catch (error) {
        return { asset, ok: false };
      }
    }));
    const missing = responses.filter((response) => !response.ok).map((response) => response.asset);
    return missing.length
      ? [result("assets", "Offline asset requests", "fail", "Unavailable: " + missing.join(", "))]
      : [result("assets", "Offline asset requests", "pass", assets.length + " required files responded successfully.")];
  }

  function staticChecks() {
    const checks = [];
    const views = ["home", "training", "mission", "aar", "facilitator"];
    const missingViews = views.filter((id) => !document.getElementById(id));
    checks.push(
      missingViews.length
        ? result("views", "Core training views", "fail", "Missing view(s): " + missingViews.join(", "))
        : result("views", "Core training views", "pass", "Dashboard, Academy, Mission, AAR, and Facilitator views are present.")
    );

    checks.push(
      count("[data-practical]") >= 4
        ? result("practice", "Interactive form practice", "pass", count("[data-practical]") + " practical work areas are present.")
        : result("practice", "Interactive form practice", "fail", "Fewer than four practical work areas were found.")
    );

    const missionCount = missionRecordCount();
    checks.push(
      missionCount >= 7
        ? result("missions", "Mission variety", "pass", missionCount + " distinct mission routes are present.")
        : result("missions", "Mission variety", "fail", "Fewer than seven mission records were found.")
    );

    checks.push(
      document.getElementById("facilitatorRunbook") &&
      document.getElementById("facilitatorAssignmentBoard") &&
      document.getElementById("facilitatorObservationRubric")
        ? result("facilitator-tools", "Facilitator controls", "pass", "Run-of-show, assignment board, and observation rubric are mounted.")
        : result("facilitator-tools", "Facilitator controls", "fail", "One or more facilitator tools did not mount.")
    );

    const signedInput = document.querySelector('[data-practical="balance"] [data-practical-field="discrepancy"]');
    const permitsNegative = signedInput && signedInput.type === "number" && signedInput.min !== "0";
    checks.push(
      permitsNegative
        ? result("signed-input", "Signed balance entry", "pass", "The discrepancy field accepts negative values.")
        : result("signed-input", "Signed balance entry", "fail", "The discrepancy field may block shortages.")
    );

    checks.push(
      localStorageCheck()
        ? result("storage", "Local persistence", "pass", "This browser can store learner and facilitator state locally.")
        : result("storage", "Local persistence", "fail", "Local storage is unavailable in this browser.")
    );

    checks.push(
      "serviceWorker" in navigator
        ? result("pwa", "Offline capability", "pass", "This browser supports service workers.")
        : result("pwa", "Offline capability", "warning", "This browser does not expose service-worker support.")
    );

    checks.push(
      document.querySelector('meta[name="viewport"]')
        ? result("mobile", "Mobile viewport", "pass", "A mobile viewport declaration is present.")
        : result("mobile", "Mobile viewport", "fail", "The mobile viewport declaration is missing.")
    );

    checks.push(assignmentCheck());
    checks.push(observationCheck());
    return checks;
  }

  function summary(results) {
    const counts = { pass: 0, warning: 0, fail: 0 };
    results.forEach((item) => {
      counts[item.status] += 1;
    });
    return counts;
  }

  function renderResults(results) {
    const panel = document.querySelector("[data-audit-results]");
    const summaryNode = document.querySelector("[data-audit-summary]");
    if (!panel || !summaryNode) return;
    const counts = summary(results);
    summaryNode.innerHTML =
      '<span data-status="pass">' + counts.pass + " pass</span>" +
      '<span data-status="warning">' + counts.warning + " warning</span>" +
      '<span data-status="fail">' + counts.fail + " fail</span>";
    panel.innerHTML = results.map((item) =>
      '<article class="audit-result" data-status="' + item.status + '">' +
        '<span class="audit-icon" aria-hidden="true">' + (item.status === "pass" ? "OK" : item.status === "warning" ? "!" : "X") + "</span>" +
        "<div><strong>" + item.label + "</strong><p>" + item.detail + "</p></div>" +
      "</article>"
    ).join("");
  }

  async function runAudit() {
    const button = document.querySelector('[data-audit-action="run"]');
    if (button) {
      button.disabled = true;
      button.textContent = "Running checks...";
    }
    const results = staticChecks().concat(await assetChecks());
    lastResults = results;
    renderResults(results);
    if (button) {
      button.disabled = false;
      button.textContent = "Run readiness audit";
    }
  }

  function reportText() {
    if (!lastResults.length) return "Readiness audit has not been run.";
    const counts = summary(lastResults);
    return [
      "DISBURSING READINESS SIMULATOR - UNIT PILOT AUDIT",
      "Run: " + new Date().toLocaleString(),
      "Result: " + counts.pass + " pass, " + counts.warning + " warning, " + counts.fail + " fail",
      "",
      lastResults.map((item) => "[" + item.status.toUpperCase() + "] " + item.label + "\n" + item.detail).join("\n\n")
    ].join("\n");
  }

  async function copyReport() {
    const text = reportText();
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    const note = document.querySelector("[data-audit-note]");
    if (note) note.textContent = "Audit report copied.";
  }

  function markup() {
    return (
      '<section id="pilotReadinessAudit" class="pilot-audit" aria-labelledby="auditTitle">' +
        '<div class="audit-heading">' +
          "<div>" +
            '<p class="audit-eyebrow">BEFORE THE ROOM ARRIVES</p>' +
            '<h2 id="auditTitle">Unit pilot readiness audit</h2>' +
            "<p>Run one device-level check before training. Resolve every failure; review warnings with the facilitator.</p>" +
          "</div>" +
          '<div class="audit-summary" data-audit-summary><span>Not run</span></div>' +
        "</div>" +
        '<div class="audit-actions">' +
          '<button type="button" class="button button-primary" data-audit-action="run">Run readiness audit</button>' +
          '<button type="button" class="button button-secondary" data-audit-action="copy">Copy audit report</button>' +
        "</div>" +
        '<div class="audit-results" data-audit-results><p>Select Run readiness audit to check this device and current event setup.</p></div>' +
        '<p class="audit-note" data-audit-note aria-live="polite">The audit does not submit data or change learner progress.</p>' +
      "</section>"
    );
  }

  function mount() {
    const facilitator = document.getElementById("facilitator");
    if (!facilitator || document.getElementById("pilotReadinessAudit")) return;
    const rubric = document.getElementById("facilitatorObservationRubric");
    if (rubric) {
      rubric.insertAdjacentHTML("afterend", markup());
    } else {
      facilitator.insertAdjacentHTML("beforeend", markup());
    }
  }

  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-audit-action]");
    if (!button) return;
    if (button.dataset.auditAction === "run") runAudit();
    if (button.dataset.auditAction === "copy") copyReport();
  });

  document.addEventListener("DOMContentLoaded", mount);
  const observer = new MutationObserver(mount);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
