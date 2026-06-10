(function () {
  "use strict";

  const STORAGE_KEY = "drsUnitPilotFeedback";
  let state = loadState();

  function defaultState() {
    return {
      responses: [],
      draft: {
        perspective: "learner",
        journey: "individual-and-team",
        clarity: 0,
        difficulty: 0,
        realism: 0,
        forms: 0,
        confidence: 0,
        confusionPoint: "",
        strongestMoment: "",
        technicalIssue: "",
        recommendation: ""
      }
    };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return saved && Array.isArray(saved.responses)
        ? Object.assign(defaultState(), saved)
        : defaultState();
    } catch (error) {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function escapeText(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function scale(name, label, low, high) {
    const current = Number(state.draft[name] || 0);
    const buttons = [1, 2, 3, 4, 5].map((value) =>
      '<button type="button" class="feedback-score' + (current === value ? " is-selected" : "") + '" data-feedback-score="' + name + '" data-score-value="' + value + '" aria-pressed="' + (current === value ? "true" : "false") + '">' + value + "</button>"
    ).join("");
    return (
      '<fieldset class="feedback-scale">' +
        "<legend>" + label + "</legend>" +
        '<div class="feedback-score-row">' + buttons + "</div>" +
        '<div class="feedback-scale-labels"><span>' + low + "</span><span>" + high + "</span></div>" +
      "</fieldset>"
    );
  }

  function draftComplete() {
    const draft = state.draft;
    return ["clarity", "difficulty", "realism", "forms", "confidence"].every((key) => Number(draft[key]) > 0) &&
      draft.confusionPoint.trim().length >= 8 &&
      draft.recommendation.trim().length >= 8;
  }

  function submitResponse() {
    if (!draftComplete()) {
      showMessage("Complete all five ratings and describe the confusion point and recommendation.", "error");
      return;
    }
    state.responses.push(Object.assign({}, state.draft, {
      id: "feedback-" + Date.now(),
      submittedAt: new Date().toISOString()
    }));
    state.draft = defaultState().draft;
    saveState();
    render();
    showMessage("Feedback saved locally. No personal information was collected.", "success");
  }

  function clearResponses() {
    state = defaultState();
    saveState();
    render();
    showMessage("Local feedback records cleared.", "success");
  }

  function updateDraft(field, value) {
    state.draft[field] = value;
    saveState();
  }

  function average(field) {
    if (!state.responses.length) return 0;
    const total = state.responses.reduce((sum, response) => sum + Number(response[field] || 0), 0);
    return total / state.responses.length;
  }

  function frictionThemes() {
    const text = state.responses
      .map((response) => [response.confusionPoint, response.technicalIssue, response.recommendation].join(" "))
      .join(" ")
      .toLowerCase();
    const themes = [
      { label: "navigation", terms: ["navigation", "find", "where", "screen", "button", "next"] },
      { label: "forms", terms: ["form", "1081", "2665", "577", "block", "field"] },
      { label: "calculations", terms: ["math", "calculate", "calculation", "rate", "balance", "difference"] },
      { label: "mission brief", terms: ["mission", "opord", "frago", "brief", "task"] },
      { label: "team handoff", terms: ["team", "role", "handoff", "pass", "cashier", "ddo"] },
      { label: "technical", terms: ["load", "crash", "slow", "install", "offline", "keyboard"] }
    ];
    return themes.map((theme) => ({
      label: theme.label,
      count: theme.terms.reduce((count, term) => count + (text.split(term).length - 1), 0)
    })).filter((theme) => theme.count > 0).sort((a, b) => b.count - a.count);
  }

  function analysisText() {
    const themes = frictionThemes();
    return [
      "UNIT PILOT FEEDBACK SUMMARY",
      "Responses: " + state.responses.length,
      "",
      "Average clarity: " + average("clarity").toFixed(1) + "/5",
      "Average difficulty: " + average("difficulty").toFixed(1) + "/5",
      "Average realism: " + average("realism").toFixed(1) + "/5",
      "Average form usefulness: " + average("forms").toFixed(1) + "/5",
      "Average confidence gain: " + average("confidence").toFixed(1) + "/5",
      "",
      "Recurring friction themes: " + (themes.length ? themes.map((theme) => theme.label + " (" + theme.count + ")").join(", ") : "No themes yet"),
      "",
      state.responses.map((response, index) => [
        "Response " + (index + 1),
        "Perspective: " + response.perspective,
        "Journey: " + response.journey,
        "Confusion point: " + response.confusionPoint,
        "Strongest moment: " + (response.strongestMoment || "Not provided"),
        "Technical issue: " + (response.technicalIssue || "None reported"),
        "Recommendation: " + response.recommendation
      ].join("\n")).join("\n\n")
    ].join("\n");
  }

  async function copyAnalysis() {
    const text = analysisText();
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
    showMessage("Feedback summary copied.", "success");
  }

  function showMessage(message, type) {
    const node = document.querySelector("[data-feedback-message]");
    if (!node) return;
    node.textContent = message;
    node.dataset.type = type || "info";
  }

  function dashboard() {
    const themes = frictionThemes().slice(0, 4);
    const metrics = [
      ["Clarity", average("clarity")],
      ["Difficulty", average("difficulty")],
      ["Realism", average("realism")],
      ["Forms", average("forms")],
      ["Confidence", average("confidence")]
    ];
    return (
      '<div class="feedback-dashboard">' +
        '<div class="feedback-response-count"><strong>' + state.responses.length + '</strong><span>local responses</span></div>' +
        '<div class="feedback-metrics">' +
          metrics.map((metric) =>
            '<div><span>' + metric[0] + '</span><strong>' + (state.responses.length ? metric[1].toFixed(1) : "-") + "</strong></div>"
          ).join("") +
        "</div>" +
        '<div class="feedback-themes"><span>Friction themes</span><p>' +
          (themes.length ? themes.map((theme) => theme.label + " " + theme.count).join(" | ") : "No themes recorded yet.") +
        "</p></div>" +
      "</div>"
    );
  }

  function markup() {
    const draft = state.draft;
    return (
      '<section id="pilotFeedback" class="pilot-feedback" aria-labelledby="feedbackTitle">' +
        '<div class="feedback-heading">' +
          "<div>" +
            '<p class="feedback-eyebrow">UNIT PILOT DEBRIEF</p>' +
            '<h2 id="feedbackTitle">What helped, what confused, what changes next</h2>' +
            "<p>Use one response per participant or observer. Do not enter names, units, operational details, or sensitive financial data.</p>" +
          "</div>" +
        "</div>" +
        dashboard() +
        '<div class="feedback-context">' +
          '<label><span>Perspective</span><select data-feedback-field="perspective">' +
            '<option value="learner"' + (draft.perspective === "learner" ? " selected" : "") + ">Learner</option>" +
            '<option value="team-lead"' + (draft.perspective === "team-lead" ? " selected" : "") + ">Team lead</option>" +
            '<option value="facilitator"' + (draft.perspective === "facilitator" ? " selected" : "") + ">Facilitator</option>" +
            '<option value="observer"' + (draft.perspective === "observer" ? " selected" : "") + ">Observer</option>" +
          "</select></label>" +
          '<label><span>Journey completed</span><select data-feedback-field="journey">' +
            '<option value="individual"' + (draft.journey === "individual" ? " selected" : "") + ">Individual only</option>" +
            '<option value="team"' + (draft.journey === "team" ? " selected" : "") + ">Team only</option>" +
            '<option value="individual-and-team"' + (draft.journey === "individual-and-team" ? " selected" : "") + ">Individual and team</option>" +
          "</select></label>" +
        "</div>" +
        '<div class="feedback-scales">' +
          scale("clarity", "Instruction clarity", "Confusing", "Clear") +
          scale("difficulty", "Challenge level", "Too easy", "Demanding") +
          scale("realism", "Mission realism", "Artificial", "Operational") +
          scale("forms", "Form practice usefulness", "Not useful", "Transferable") +
          scale("confidence", "Confidence gained", "No gain", "Strong gain") +
        "</div>" +
        '<div class="feedback-prompts">' +
          '<label><span>Exact confusion point</span><textarea rows="3" data-feedback-field="confusionPoint" placeholder="Name the screen, instruction, form field, calculation, or mission step.">' + escapeText(draft.confusionPoint) + "</textarea></label>" +
          '<label><span>Strongest learning moment</span><textarea rows="3" data-feedback-field="strongestMoment" placeholder="What made the concept click or feel operational?">' + escapeText(draft.strongestMoment) + "</textarea></label>" +
          '<label><span>Technical friction</span><textarea rows="3" data-feedback-field="technicalIssue" placeholder="Describe loading, keyboard, scrolling, install, or navigation trouble.">' + escapeText(draft.technicalIssue) + "</textarea></label>" +
          '<label><span>One change before the next training day</span><textarea rows="3" data-feedback-field="recommendation" placeholder="State the most important improvement.">' + escapeText(draft.recommendation) + "</textarea></label>" +
        "</div>" +
        '<div class="feedback-actions">' +
          '<button type="button" class="button button-primary" data-feedback-action="submit">Save anonymous response</button>' +
          '<button type="button" class="button button-secondary" data-feedback-action="copy">Copy facilitator summary</button>' +
          '<button type="button" class="button button-secondary" data-feedback-action="clear">Clear local responses</button>' +
        "</div>" +
        '<p class="feedback-message" data-feedback-message aria-live="polite">Responses stay in this browser until copied or cleared.</p>' +
      "</section>"
    );
  }

  function mount() {
    const aar = document.getElementById("aar");
    if (!aar || document.getElementById("pilotFeedback")) return;
    aar.insertAdjacentHTML("beforeend", markup());
  }

  function render() {
    const existing = document.getElementById("pilotFeedback");
    if (existing) existing.remove();
    mount();
  }

  document.addEventListener("click", function (event) {
    const score = event.target.closest("[data-feedback-score]");
    if (score) {
      updateDraft(score.dataset.feedbackScore, Number(score.dataset.scoreValue));
      render();
      return;
    }
    const action = event.target.closest("[data-feedback-action]");
    if (!action) return;
    if (action.dataset.feedbackAction === "submit") submitResponse();
    if (action.dataset.feedbackAction === "copy") copyAnalysis();
    if (action.dataset.feedbackAction === "clear") clearResponses();
  });

  document.addEventListener("input", function (event) {
    if (event.target.matches("textarea[data-feedback-field]")) {
      updateDraft(event.target.dataset.feedbackField, event.target.value);
    }
  });

  document.addEventListener("change", function (event) {
    if (event.target.matches("select[data-feedback-field]")) {
      updateDraft(event.target.dataset.feedbackField, event.target.value);
    }
  });

  document.addEventListener("DOMContentLoaded", mount);
  const observer = new MutationObserver(mount);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
