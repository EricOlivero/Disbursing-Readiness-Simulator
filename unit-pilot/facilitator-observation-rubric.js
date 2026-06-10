(function () {
  "use strict";

  const STORAGE_KEY = "drsUnitPilotObservations";
  const ASSIGNMENT_KEY = "drsUnitPilotAssignments";
  const dimensions = [
    {
      id: "control",
      label: "Control of funds",
      watch: "Counts before acceptance, safeguards accountability, and stops when evidence is incomplete."
    },
    {
      id: "forms",
      label: "Form reasoning",
      watch: "Explains what the record proves and connects entries to the accountable event."
    },
    {
      id: "calculation",
      label: "Calculation accuracy",
      watch: "Builds the book balance, counts physical funds, uses signed differences, and selects the correct rate branch."
    },
    {
      id: "handoff",
      label: "Role handoff",
      watch: "States who transfers what, to whom, under which authority, with which evidence."
    },
    {
      id: "explanation",
      label: "Balance explanation",
      watch: "States balanced, shortage, overage, or noncash adjustment and identifies the next control action."
    }
  ];

  let state = loadState();

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return saved && saved.records ? saved : { selectedTeam: "", records: {} };
    } catch (error) {
      return { selectedTeam: "", records: {} };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function assignmentTeams() {
    try {
      const assignment = JSON.parse(localStorage.getItem(ASSIGNMENT_KEY) || "null");
      if (!assignment || !Array.isArray(assignment.teams)) return [];
      return assignment.teams
        .filter((team) => team.name && team.name.trim())
        .map((team) => ({
          id: team.id,
          name: team.name.trim(),
          missionId: team.missionId || ""
        }));
    } catch (error) {
      return [];
    }
  }

  function teams() {
    const assigned = assignmentTeams();
    if (assigned.length) return assigned;
    return [{ id: "unassigned-team", name: "Training Team", missionId: "" }];
  }

  function selectedTeam() {
    const available = teams();
    const selected = available.find((team) => team.id === state.selectedTeam);
    return selected || available[0];
  }

  function teamRecord(teamId) {
    if (!state.records[teamId]) {
      state.records[teamId] = {
        ratings: {},
        evidence: {},
        retraining: "",
        strength: "",
        decision: "observe",
        updatedAt: null
      };
    }
    return state.records[teamId];
  }

  function score(record) {
    return dimensions.reduce((total, dimension) => total + Number(record.ratings[dimension.id] || 0), 0);
  }

  function completedDimensions(record) {
    return dimensions.filter((dimension) => Number(record.ratings[dimension.id] || 0) > 0).length;
  }

  function readiness(record) {
    const total = score(record);
    const complete = completedDimensions(record);
    const explanation = Number(record.ratings.explanation || 0);
    const control = Number(record.ratings.control || 0);
    if (complete < dimensions.length) {
      return { label: "Observation incomplete", className: "incomplete", action: "Score all five behaviors before making a readiness decision." };
    }
    if (total >= 13 && explanation >= 3 && control >= 2) {
      return { label: "Ready to lead with oversight", className: "ready", action: "Use a harder variation or assign a leadership role." };
    }
    if (total >= 10 && explanation >= 2 && control >= 2) {
      return { label: "Ready with normal supervision", className: "ready", action: "Proceed and reinforce the lowest-rated behavior during AAR." };
    }
    return { label: "Targeted remediation required", className: "remediate", action: "Repeat a worked example and re-demonstrate the lowest-rated behavior." };
  }

  function ratingButtons(dimension, current) {
    const labels = [
      { value: 1, label: "Needs coaching" },
      { value: 2, label: "Performs" },
      { value: 3, label: "Explains and adapts" }
    ];
    return labels.map((item) =>
      '<button type="button" class="rubric-rating' + (Number(current) === item.value ? " is-selected" : "") + '" data-rubric-rating="' + dimension.id + '" data-rating-value="' + item.value + '" aria-pressed="' + (Number(current) === item.value ? "true" : "false") + '">' +
        '<strong>' + item.value + "</strong><span>" + item.label + "</span>" +
      "</button>"
    ).join("");
  }

  function dimensionCards(record) {
    return dimensions.map((dimension, index) =>
      '<article class="rubric-dimension">' +
        '<div class="rubric-dimension-heading">' +
          '<span class="rubric-number">' + (index + 1) + "</span>" +
          "<div><h3>" + dimension.label + "</h3><p>" + dimension.watch + "</p></div>" +
        "</div>" +
        '<div class="rubric-ratings" role="group" aria-label="' + dimension.label + ' rating">' +
          ratingButtons(dimension, record.ratings[dimension.id]) +
        "</div>" +
        '<label class="rubric-evidence"><span>Observed evidence</span><textarea rows="2" data-rubric-evidence="' + dimension.id + '" placeholder="Record the behavior, statement, or calculation you observed.">' + escapeText(record.evidence[dimension.id] || "") + "</textarea></label>" +
      "</article>"
    ).join("");
  }

  function escapeText(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function teamOptions() {
    const current = selectedTeam();
    return teams().map((team) =>
      '<option value="' + team.id + '"' + (team.id === current.id ? " selected" : "") + ">" + escapeText(team.name) + "</option>"
    ).join("");
  }

  function summaryText() {
    const team = selectedTeam();
    const record = teamRecord(team.id);
    const result = readiness(record);
    const details = dimensions.map((dimension) => {
      const rating = record.ratings[dimension.id] || "not scored";
      const evidence = record.evidence[dimension.id] || "No observation recorded";
      return dimension.label + ": " + rating + "/3\nEvidence: " + evidence;
    }).join("\n\n");
    return [
      "TEAM OBSERVATION: " + team.name,
      "Readiness: " + result.label,
      "Score: " + score(record) + "/15",
      "",
      details,
      "",
      "Demonstrated strength: " + (record.strength || "Not recorded"),
      "Required retraining: " + (record.retraining || "Not recorded"),
      "Facilitator decision: " + record.decision
    ].join("\n");
  }

  async function copySummary() {
    const text = summaryText();
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
    showMessage("Observation summary copied.");
  }

  function clearCurrent() {
    const team = selectedTeam();
    delete state.records[team.id];
    saveState();
    render();
    showMessage("Observation record cleared for " + team.name + ".");
  }

  function showMessage(message) {
    const target = document.querySelector("[data-rubric-message]");
    if (!target) return;
    target.textContent = message;
  }

  function recordUpdate(field, value) {
    const team = selectedTeam();
    const record = teamRecord(team.id);
    record[field] = value;
    record.updatedAt = new Date().toISOString();
    saveState();
    updateResult();
  }

  function updateResult() {
    const team = selectedTeam();
    const record = teamRecord(team.id);
    const result = readiness(record);
    const scoreNode = document.querySelector("[data-rubric-score]");
    const readinessNode = document.querySelector("[data-rubric-readiness]");
    const actionNode = document.querySelector("[data-rubric-action]");
    if (scoreNode) scoreNode.textContent = score(record) + "/15";
    if (readinessNode) {
      readinessNode.textContent = result.label;
      readinessNode.dataset.status = result.className;
    }
    if (actionNode) actionNode.textContent = result.action;
  }

  function markup() {
    const team = selectedTeam();
    state.selectedTeam = team.id;
    const record = teamRecord(team.id);
    const result = readiness(record);
    saveState();
    return (
      '<section id="facilitatorObservationRubric" class="observation-rubric" aria-labelledby="rubricTitle">' +
        '<div class="rubric-heading">' +
          "<div>" +
            '<p class="rubric-eyebrow">FACILITATOR OBSERVATION</p>' +
            '<h2 id="rubricTitle">Performance evidence rubric</h2>' +
            "<p>Score observable behavior, capture evidence, and leave the AAR with a specific retraining decision.</p>" +
          "</div>" +
          '<label class="rubric-team"><span>Observe team</span><select data-rubric-team>' + teamOptions() + "</select></label>" +
        "</div>" +
        '<div class="rubric-scale" aria-label="Rating scale">' +
          "<span><strong>1</strong> Needs coaching</span>" +
          "<span><strong>2</strong> Performs</span>" +
          "<span><strong>3</strong> Explains and adapts</span>" +
        "</div>" +
        '<div class="rubric-grid">' + dimensionCards(record) + "</div>" +
        '<div class="rubric-conclusion">' +
          '<div class="rubric-result">' +
            '<span>Observed score</span><strong data-rubric-score>' + score(record) + "/15</strong>" +
            '<b data-rubric-readiness data-status="' + result.className + '">' + result.label + "</b>" +
            '<p data-rubric-action>' + result.action + "</p>" +
          "</div>" +
          '<div class="rubric-notes">' +
            '<label><span>Demonstrated strength</span><textarea rows="2" data-rubric-field="strength" placeholder="What should the team repeat next time?">' + escapeText(record.strength) + "</textarea></label>" +
            '<label><span>Required retraining</span><textarea rows="2" data-rubric-field="retraining" placeholder="State one observable behavior to practice again.">' + escapeText(record.retraining) + "</textarea></label>" +
            '<label><span>Facilitator decision</span><select data-rubric-field="decision">' +
              '<option value="observe"' + (record.decision === "observe" ? " selected" : "") + ">Continue observation</option>" +
              '<option value="proceed"' + (record.decision === "proceed" ? " selected" : "") + ">Proceed</option>" +
              '<option value="remediate"' + (record.decision === "remediate" ? " selected" : "") + ">Remediate before next mission</option>" +
              '<option value="lead"' + (record.decision === "lead" ? " selected" : "") + ">Ready for team lead role</option>" +
            "</select></label>" +
          "</div>" +
        "</div>" +
        '<div class="rubric-actions">' +
          '<button type="button" class="button button-primary" data-rubric-action-button="copy">Copy observation summary</button>' +
          '<button type="button" class="button button-secondary" data-rubric-action-button="clear">Clear current team</button>' +
        "</div>" +
        '<p class="rubric-message" data-rubric-message aria-live="polite">Observations are saved only on this device.</p>' +
      "</section>"
    );
  }

  function mount() {
    const facilitator = document.getElementById("facilitator");
    if (!facilitator || document.getElementById("facilitatorObservationRubric")) return;
    const assignment = document.getElementById("facilitatorAssignmentBoard");
    if (assignment) {
      assignment.insertAdjacentHTML("afterend", markup());
    } else {
      facilitator.insertAdjacentHTML("beforeend", markup());
    }
  }

  function render() {
    const rubric = document.getElementById("facilitatorObservationRubric");
    if (rubric) rubric.remove();
    mount();
  }

  document.addEventListener("click", function (event) {
    const rating = event.target.closest("[data-rubric-rating]");
    if (rating) {
      const team = selectedTeam();
      const record = teamRecord(team.id);
      record.ratings[rating.dataset.rubricRating] = Number(rating.dataset.ratingValue);
      record.updatedAt = new Date().toISOString();
      saveState();
      render();
      return;
    }
    const action = event.target.closest("[data-rubric-action-button]");
    if (!action) return;
    if (action.dataset.rubricActionButton === "copy") copySummary();
    if (action.dataset.rubricActionButton === "clear") clearCurrent();
  });

  document.addEventListener("input", function (event) {
    if (event.target.matches("[data-rubric-evidence]")) {
      const team = selectedTeam();
      const record = teamRecord(team.id);
      record.evidence[event.target.dataset.rubricEvidence] = event.target.value;
      record.updatedAt = new Date().toISOString();
      saveState();
      return;
    }
    if (event.target.matches('[data-rubric-field="strength"], [data-rubric-field="retraining"]')) {
      recordUpdate(event.target.dataset.rubricField, event.target.value);
    }
  });

  document.addEventListener("change", function (event) {
    if (event.target.matches("[data-rubric-team]")) {
      state.selectedTeam = event.target.value;
      saveState();
      render();
      return;
    }
    if (event.target.matches('[data-rubric-field="decision"]')) {
      recordUpdate("decision", event.target.value);
    }
  });

  document.addEventListener("DOMContentLoaded", mount);
  window.addEventListener("storage", function (event) {
    if (event.key === ASSIGNMENT_KEY || event.key === STORAGE_KEY) {
      state = loadState();
      render();
    }
  });
  const observer = new MutationObserver(mount);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
