(function () {
  "use strict";

  const STORAGE_KEY = "drsUnitPilotAssignments";
  const missions = [
    { id: "cashier-standup", code: "M-01", name: "Cashier Stand-Up", focus: "DD 1081 and opening accountability" },
    { id: "paying-agent-market", code: "M-02", name: "Paying Agent Market", focus: "Payment execution and overage" },
    { id: "exchange-point", code: "M-03", name: "Exchange Point", focus: "Exchange controls and balanced closeout" },
    { id: "revaluation-shift", code: "M-04", name: "Revaluation Shift", focus: "Revaluation loss decision" },
    { id: "average-purchase-rate", code: "M-05", name: "Average Purchase Rate", focus: "APR calculation and documentation" },
    { id: "voucher-control-cell", code: "M-06", name: "Voucher Control Cell", focus: "Duplicate control and shortage" },
    { id: "accountability-interruption", code: "M-07", name: "Accountability Interruption", focus: "Continuity and witnessed transfer" }
  ];

  let state = loadState();

  function defaultTeams() {
    return missions.map((mission, index) => ({
      id: "team-" + (index + 1),
      name: "",
      experience: index < 3 ? "mixed" : "developing",
      missionId: ""
    }));
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved || !Array.isArray(saved.teams)) {
        return { teams: defaultTeams(), locked: false, assignedAt: null };
      }
      return {
        teams: saved.teams,
        locked: Boolean(saved.locked),
        assignedAt: saved.assignedAt || null
      };
    } catch (error) {
      return { teams: defaultTeams(), locked: false, assignedAt: null };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function missionFor(id) {
    return missions.find((mission) => mission.id === id);
  }

  function normalizedTeams() {
    return state.teams.filter((team) => team.name.trim());
  }

  function rotate(list, amount) {
    const offset = ((amount % list.length) + list.length) % list.length;
    return list.slice(offset).concat(list.slice(0, offset));
  }

  function assignmentSeed() {
    return normalizedTeams()
      .map((team) => team.name.toLowerCase().trim())
      .join("|")
      .split("")
      .reduce((total, character) => total + character.charCodeAt(0), 0);
  }

  function autoAssign() {
    const active = normalizedTeams();
    if (!active.length) {
      showMessage("Enter at least one team name before assigning missions.", "error");
      return;
    }
    const orderedMissions = rotate(missions, assignmentSeed());
    let developingIndex = 0;
    let experiencedIndex = orderedMissions.length - 1;

    state.teams = state.teams.map((team) => {
      if (!team.name.trim()) return Object.assign({}, team, { missionId: "" });
      let mission;
      if (team.experience === "experienced" && active.length <= missions.length) {
        mission = orderedMissions[experiencedIndex];
        experiencedIndex = Math.max(developingIndex, experiencedIndex - 1);
      } else {
        mission = orderedMissions[developingIndex % orderedMissions.length];
        developingIndex += 1;
      }
      return Object.assign({}, team, { missionId: mission.id });
    });
    state.locked = false;
    state.assignedAt = new Date().toISOString();
    saveState();
    render();
    showMessage(
      active.length > missions.length
        ? "Missions assigned. Some repeats are necessary because there are more than seven teams."
        : "Seven-route assignment complete with no repeated mission.",
      "success"
    );
  }

  function lockAssignments() {
    const active = normalizedTeams();
    if (!active.length || active.some((team) => !team.missionId)) {
      showMessage("Assign a mission to every named team before locking the launch board.", "error");
      return;
    }
    state.locked = true;
    saveState();
    render();
    showMessage("Launch board locked on this device.", "success");
  }

  function unlockAssignments() {
    state.locked = false;
    saveState();
    render();
    showMessage("Launch board unlocked for facilitator changes.", "success");
  }

  function clearAssignments() {
    state = { teams: defaultTeams(), locked: false, assignedAt: null };
    saveState();
    render();
    showMessage("Team assignment board cleared.", "success");
  }

  function addTeam() {
    const nextNumber = state.teams.length + 1;
    state.teams.push({
      id: "team-" + Date.now(),
      name: "",
      experience: "mixed",
      missionId: ""
    });
    saveState();
    render();
    window.setTimeout(() => {
      const inputs = document.querySelectorAll("[data-team-name]");
      const input = inputs[inputs.length - 1];
      if (input) {
        input.placeholder = "Team " + nextNumber;
        input.focus();
      }
    }, 0);
  }

  function removeTeam(teamId) {
    if (state.teams.length <= 1) return;
    state.teams = state.teams.filter((team) => team.id !== teamId);
    saveState();
    render();
  }

  function updateTeam(teamId, field, value) {
    state.teams = state.teams.map((team) => {
      if (team.id !== teamId) return team;
      return Object.assign({}, team, { [field]: value });
    });
    state.locked = false;
    saveState();
  }

  function duplicateWarnings() {
    const used = {};
    normalizedTeams().forEach((team) => {
      if (!team.missionId) return;
      used[team.missionId] = (used[team.missionId] || 0) + 1;
    });
    return Object.keys(used).filter((missionId) => used[missionId] > 1);
  }

  function launchSummary() {
    const active = normalizedTeams();
    if (!active.length) return "No teams assigned.";
    return active.map((team, index) => {
      const mission = missionFor(team.missionId);
      return [
        String(index + 1) + ". " + team.name,
        mission ? mission.code + " " + mission.name : "MISSION NOT ASSIGNED",
        "Focus: " + (mission ? mission.focus : "Assign before launch"),
        "Experience mix: " + team.experience
      ].join("\n");
    }).join("\n\n");
  }

  async function copySummary() {
    const text = launchSummary();
    try {
      await navigator.clipboard.writeText(text);
      showMessage("Launch list copied.", "success");
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      showMessage("Launch list copied.", "success");
    }
  }

  function showMessage(text, type) {
    const message = document.querySelector("[data-assignment-message]");
    if (!message) return;
    message.textContent = text;
    message.dataset.type = type || "info";
  }

  function missionOptions(selectedId) {
    const options = ['<option value="">Select mission</option>'];
    missions.forEach((mission) => {
      options.push(
        '<option value="' + mission.id + '"' + (mission.id === selectedId ? " selected" : "") + ">" +
          mission.code + " " + mission.name +
        "</option>"
      );
    });
    return options.join("");
  }

  function teamRows() {
    return state.teams.map((team, index) => {
      const mission = missionFor(team.missionId);
      return (
        '<div class="assignment-row" data-assignment-row="' + team.id + '">' +
          '<span class="assignment-number">' + (index + 1) + "</span>" +
          '<label><span>Team name</span><input type="text" data-team-name="' + team.id + '" value="' + escapeAttribute(team.name) + '" placeholder="Team ' + (index + 1) + '"' + (state.locked ? " disabled" : "") + "></label>" +
          '<label><span>Experience</span><select data-team-experience="' + team.id + '"' + (state.locked ? " disabled" : "") + ">" +
            '<option value="developing"' + (team.experience === "developing" ? " selected" : "") + ">Developing</option>" +
            '<option value="mixed"' + (team.experience === "mixed" ? " selected" : "") + ">Mixed</option>" +
            '<option value="experienced"' + (team.experience === "experienced" ? " selected" : "") + ">Experienced</option>" +
          "</select></label>" +
          '<label><span>Mission</span><select data-team-mission="' + team.id + '"' + (state.locked ? " disabled" : "") + ">" + missionOptions(team.missionId) + "</select></label>" +
          '<div class="assignment-focus"><span>Focus</span><strong>' + (mission ? mission.focus : "Not assigned") + "</strong></div>" +
          '<button type="button" class="assignment-remove" data-remove-team="' + team.id + '" aria-label="Remove Team ' + (index + 1) + '"' + (state.locked ? " disabled" : "") + ">Remove</button>" +
        "</div>"
      );
    }).join("");
  }

  function escapeAttribute(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function boardMarkup() {
    const duplicates = duplicateWarnings();
    const activeCount = normalizedTeams().length;
    return (
      '<section id="facilitatorAssignmentBoard" class="assignment-board" aria-labelledby="assignmentTitle">' +
        '<div class="assignment-heading">' +
          "<div>" +
            '<p class="assignment-eyebrow">TEAM LAUNCH CONTROL</p>' +
            '<h2 id="assignmentTitle">Seven-route mission assignment</h2>' +
            "<p>Separate nearby teams across distinct decisions, calculations, and closeout outcomes.</p>" +
          "</div>" +
          '<div class="assignment-stat"><strong>' + activeCount + '</strong><span>named teams</span></div>' +
        "</div>" +
        '<div class="assignment-status">' +
          '<span class="assignment-lock" data-locked="' + (state.locked ? "true" : "false") + '">' + (state.locked ? "Locked for launch" : "Draft assignment") + "</span>" +
          (duplicates.length ? '<span class="assignment-warning">Repeated missions: ' + duplicates.length + "</span>" : '<span class="assignment-clear">No repeated mission among named teams</span>') +
        "</div>" +
        '<div class="assignment-table" role="group" aria-label="Team mission assignments">' + teamRows() + "</div>" +
        '<div class="assignment-actions">' +
          '<button type="button" class="button button-primary" data-assignment-action="auto"' + (state.locked ? " disabled" : "") + ">Auto-assign routes</button>" +
          '<button type="button" class="button button-secondary" data-assignment-action="add"' + (state.locked ? " disabled" : "") + ">Add team</button>" +
          '<button type="button" class="button button-secondary" data-assignment-action="' + (state.locked ? "unlock" : "lock") + '">' + (state.locked ? "Unlock board" : "Lock for launch") + "</button>" +
          '<button type="button" class="button button-secondary" data-assignment-action="copy">Copy launch list</button>' +
          '<button type="button" class="button button-secondary" data-assignment-action="clear">Clear</button>' +
        "</div>" +
        '<p class="assignment-message" data-assignment-message aria-live="polite">Enter team names, choose the experience mix, then auto-assign.</p>' +
        '<details class="assignment-preview"><summary>Preview facilitator launch list</summary><pre>' + escapeAttribute(launchSummary()) + "</pre></details>" +
        '<p class="assignment-note">Assignments remain on this device. Mission content stays locked behind individual readiness gates on each learner device.</p>' +
      "</section>"
    );
  }

  function mount() {
    const facilitator = document.getElementById("facilitator");
    if (!facilitator || document.getElementById("facilitatorAssignmentBoard")) return;
    const runbook = document.getElementById("facilitatorRunbook");
    if (runbook) {
      runbook.insertAdjacentHTML("afterend", boardMarkup());
    } else {
      facilitator.insertAdjacentHTML("afterbegin", boardMarkup());
    }
  }

  function render() {
    const board = document.getElementById("facilitatorAssignmentBoard");
    if (board) board.remove();
    mount();
  }

  document.addEventListener("input", function (event) {
    if (event.target.matches("[data-team-name]")) {
      updateTeam(event.target.dataset.teamName, "name", event.target.value);
    }
  });

  document.addEventListener("change", function (event) {
    if (event.target.matches("[data-team-experience]")) {
      updateTeam(event.target.dataset.teamExperience, "experience", event.target.value);
      return;
    }
    if (event.target.matches("[data-team-mission]")) {
      updateTeam(event.target.dataset.teamMission, "missionId", event.target.value);
      render();
    }
  });

  document.addEventListener("click", function (event) {
    const remove = event.target.closest("[data-remove-team]");
    if (remove) {
      removeTeam(remove.dataset.removeTeam);
      return;
    }
    const button = event.target.closest("[data-assignment-action]");
    if (!button) return;
    const action = button.dataset.assignmentAction;
    if (action === "auto") autoAssign();
    if (action === "add") addTeam();
    if (action === "lock") lockAssignments();
    if (action === "unlock") unlockAssignments();
    if (action === "copy") copySummary();
    if (action === "clear") clearAssignments();
  });

  document.addEventListener("DOMContentLoaded", mount);
  const observer = new MutationObserver(mount);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
