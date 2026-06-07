const { test, expect } = require("@playwright/test");

async function enterSimulator(page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator("#disclaimerAck").check();
  await page.locator("#acceptDisclaimer").click();
  await expect(page.locator("#home")).toHaveClass(/active/);
}

async function openTraining(page) {
  await page.locator('.bottom-nav [data-nav="training"]').click();
  await expect(page.locator("#training")).toHaveClass(/active/);
  await expect(page.locator("#formQualification")).toBeVisible();
  await expect(page.locator(".form-practical")).toHaveCount(4);
  await expect(page.locator(".form-brief")).toHaveCount(4);
  await expect(page.locator(".form-practical:visible")).toHaveCount(1);
}

async function completeFormPracticals(page) {
  const dd577 = page.locator('[data-practical="dd577"]');
  await dd577.locator('[data-practical-field="appointingRole"]').fill("Disbursing Officer");
  await dd577.locator('[data-practical-field="appointedRole"]').fill("Cashier");
  await dd577.locator('[data-practical-field="appointmentPurpose"]').fill(
    "The appointment authorizes the cashier role and records acceptance of accountability and responsibility."
  );
  await dd577.locator('[data-practical-key="dd577"]').click();
  await expect(dd577).toHaveClass(/is-complete/);
  await page.locator('[data-overnight-action="qualification-next"]').click();

  const dd1081 = page.locator('[data-practical="dd1081"]');
  await expect(dd1081).toBeVisible();
  await dd1081.locator('[data-practical-field="advanceAmount"]').fill("4000");
  await dd1081.locator('[data-practical-field="physicalCount"]').fill("4000");
  await dd1081.locator('[data-practical-field="advanceExplanation"]').fill(
    "I independently counted the physical bills and the count reconciles to the advance before accepting accountability."
  );
  await dd1081.locator('[data-practical-key="dd1081"]').click();
  await expect(dd1081).toHaveClass(/is-complete/);
  await page.locator('[data-overnight-action="qualification-next"]').click();

  const dd2665 = page.locator('[data-practical="dd2665"]');
  await expect(dd2665).toBeVisible();
  await dd2665.locator('[data-practical-field="rateBranch"]').fill("Average Purchase Rate");
  await dd2665.locator('[data-practical-field="rateCalculation"]').fill("100638 / 3000 = 33.546");
  await dd2665.locator('[data-practical-field="rateExplanation"]').fill(
    "Average Purchase Rate applies because currency was purchased locally without a Treasury prevailing rate; revaluation loss is a separate process."
  );
  await dd2665.locator('[data-practical-key="dd2665"]').click();
  await expect(dd2665).toHaveClass(/is-complete/);
  await page.locator('[data-overnight-action="qualification-next"]').click();

  const balance = page.locator('[data-practical="balance"]');
  await expect(balance).toBeVisible();
  await balance.locator('[data-practical-field="bookBalance"]').fill("3275");
  await balance.locator('[data-practical-field="discrepancy"]').fill("15 shortage");
  await balance.locator('[data-practical-field="balanceExplanation"]').fill(
    "The physical cash is $15 short of the book balance, so I will stop, recount, review the support, and document the unresolved discrepancy."
  );
  await balance.locator('[data-practical-key="balance"]').click();
  await expect(balance).toHaveClass(/is-complete/);
}

test.describe("evidence-backed overnight improvements", () => {
  const scenarioIds = [
    "cashier-standup",
    "market",
    "exchange-point",
    "revaluation-loss",
    "average-purchase-rate",
    "duplicate-payment",
    "continuity"
  ];

  test("shows seven distinct team missions and produces unique assignments", async ({ page }) => {
    await enterSimulator(page);
    await expect(page.locator("#scenarioSelect option")).toHaveCount(7);
    await expect(page.locator(".scenario-card")).toHaveCount(7);
    await expect(page.locator("#scenarioIntegrityAlert")).toHaveCount(0);
    await page.locator('[data-overnight-action="assign-teams"]').first().click();
    await expect(page.locator(".assignment-list article")).toHaveCount(7);
    const missionNames = await page.locator(".assignment-list article span").allTextContents();
    expect(new Set(missionNames).size).toBe(7);
    await page.locator('[data-overnight-action="run-diagnostics"]').click();
    await expect(page.locator(".diagnostic-grid > div")).toHaveCount(8);
  });

  test("keeps all scenario records complete, unique, and on approved role terminology", async ({ page }) => {
    await enterSimulator(page);
    const audit = await page.evaluate(() => {
      const scenarios = window.DRS_DATA.scenarios;
      const roles = scenarios.flatMap(item => Array.isArray(item.roles) ? item.roles : []);
      return {
        ids: scenarios.map(item => item.id),
        eventCounts: scenarios.map(item => item.events.length),
        accountabilities: scenarios.map(item => Number(item.accountabilityUsd)),
        containsCertifierRole: roles.some(role => String(role).toLowerCase() === "certifier"),
        hasRevaluation: scenarios.some(item => item.id === "revaluation-loss"),
        hasApr: scenarios.some(item => item.id === "average-purchase-rate")
      };
    });
    expect(new Set(audit.ids).size).toBe(7);
    expect(audit.eventCounts.every(count => count >= 2)).toBe(true);
    expect(audit.accountabilities.every(value => Number.isFinite(value) && value > 0)).toBe(true);
    expect(audit.containsCertifierRole).toBe(false);
    expect(audit.hasRevaluation).toBe(true);
    expect(audit.hasApr).toBe(true);
  });

  test("keeps public scenario data free of restricted identifiers and security details", async ({ page }) => {
    await enterSimulator(page);
    const violations = await page.evaluate(() => {
      const text = JSON.stringify(window.DRS_DATA.scenarios).toLowerCase();
      const forbidden = [
        "social security number",
        "ssn",
        "dssn",
        "routing number",
        "bank account number",
        "real vendor",
        "signature block"
      ];
      const findings = forbidden.filter(term => text.includes(term));
      if (/\b\d{3}-\d{2}-\d{4}\b/.test(text)) findings.push("SSN-formatted number");
      if (/\b(?:routing|aba)\D{0,12}\d{9}\b/.test(text)) findings.push("routing-number pattern");
      if (/\bcombination\D{0,12}\d{3,}\b/.test(text)) findings.push("combination-number pattern");
      return findings;
    });
    expect(violations).toEqual([]);
  });

  test("includes the scenario and enhancement layers in the offline application shell", async ({ page }) => {
    await enterSimulator(page);
    const workerSource = await page.evaluate(async () => {
      const response = await fetch("./service-worker.js", { cache: "no-store" });
      return response.text();
    });
    expect(workerSource).toContain("./scenarios.js");
    expect(workerSource).toContain("./overnight-enhancements.js");
    await expect(page.locator("#connectivityStatus")).toContainText("progress remains");
  });

  for (const scenarioId of scenarioIds) {
    test(`${scenarioId} renders a mission standard, physical issue, and handoff station`, async ({ page }) => {
      await enterSimulator(page);
      const result = await page.evaluate(id => {
        loadScenario(id, false);
        showView("mission");
        renderMission();
        const current = scenario();
        return {
          id: current.id,
          accountabilityUsd: Number(current.accountabilityUsd)
        };
      }, scenarioId);
      expect(result.id).toBe(scenarioId);
      await expect(page.locator("#missionStandards")).toBeVisible();
      await expect(page.locator("#missionOrder")).toBeVisible();
      await expect(page.locator("#missionOrder .order-sections > section > h3")).toHaveCount(5);
      await expect(page.locator(".frago-strip")).toBeVisible();
      await expect(page.locator(".mission-packet section")).toHaveCount(2);
      expect(await page.locator(".mission-packet li").count()).toBeGreaterThanOrEqual(7);
      await expect(page.locator("#roleBoard")).toBeVisible();
      expect(await page.locator("#roleBoard [data-role-brief]").count()).toBeGreaterThanOrEqual(3);
      await expect(page.locator("#drawerIssuePanel")).toBeVisible();
      await expect(page.locator("#handoffWorkbench")).toBeVisible();
      await expect(page.locator("#decisionRationale")).toBeVisible();
      expect(Number(await page.locator('[data-overnight-action="verify-drawer-issue"]').getAttribute("data-expected")))
        .toBeCloseTo(result.accountabilityUsd, 2);
    });
  }

  test("switching missions refreshes OPORD and initial accountability without stale records", async ({ page }) => {
    await enterSimulator(page);
    await page.evaluate(() => {
      loadScenario("cashier-standup", false);
      showView("mission");
      renderMission();
    });
    await expect(page.locator("#missionOrder")).toHaveAttribute("data-scenario-id", "cashier-standup");
    await page.evaluate(() => {
      state.drawerIssueCheck = {
        passed: true,
        scenarioId: "cashier-standup",
        total: 3000,
        explanation: "Prior mission record"
      };
      loadScenario("duplicate-payment", false);
      renderMission();
    });
    await expect(page.locator("#missionOrder")).toHaveAttribute("data-scenario-id", "duplicate-payment");
    await expect(page.locator("#drawerIssuePanel")).toHaveAttribute("data-scenario-id", "duplicate-payment");
    await expect(page.locator("#drawerIssuePanel")).not.toHaveClass(/is-complete/);
  });

  test("persists scenario-specific team role brief confirmations", async ({ page }) => {
    await enterSimulator(page);
    await page.evaluate(() => {
      loadScenario("cashier-standup", false);
      showView("mission");
      renderMission();
    });
    const role = await page.locator("#roleBoard [data-role-brief]").first().getAttribute("data-role-brief");
    await page.locator("#roleBoard [data-role-brief]").first().check();
    expect(await page.evaluate(([scenarioId, roleName]) => {
      return state.roleBriefs[scenarioId]?.[roleName];
    }, ["cashier-standup", role])).toBe(true);
  });

  test("rejects weak DD1081 work and accepts a reconciled constructed response", async ({ page }) => {
    await enterSimulator(page);
    await openTraining(page);
    const station = page.locator('[data-practical="dd1081"]');
    await station.locator('[data-practical-field="advanceAmount"]').fill("4000");
    await station.locator('[data-practical-field="physicalCount"]').fill("3900");
    await station.locator('[data-practical-field="advanceExplanation"]').fill("It looks close enough.");
    await station.locator('[data-practical-key="dd1081"]').click();
    await expect(station).not.toHaveClass(/is-complete/);
    await expect(station.locator("[data-practical-feedback]")).toContainText("Needs revision");
    expect(await page.evaluate(() => state.remediationLog.some(entry => entry.station === "qualification-dd1081"))).toBe(true);
    await station.locator('[data-practical-key="dd1081"]').click();
    await expect(station.locator("[data-practical-feedback]")).toContainText("Method:");

    await station.locator('[data-practical-field="physicalCount"]').fill("4000");
    await station.locator('[data-practical-field="advanceExplanation"]').fill(
      "I independently counted the physical bills and the count reconciles to the advance before accepting accountability."
    );
    await station.locator('[data-practical-key="dd1081"]').click();
    await expect(station).toHaveClass(/is-complete/);
    await page.evaluate(() => loadScenario("duplicate-payment", false));
    expect(await page.evaluate(() => state.remediationLog.some(entry =>
      entry.station === "qualification-dd1081" && entry.scenarioId === null
    ))).toBe(true);
  });

  test("requires qualification practicals and persists all four mastery records", async ({ page }) => {
    await enterSimulator(page);
    await page.evaluate(() => {
      window.__DRS_ENFORCE_QUALIFICATION__ = true;
    });
    await page.evaluate(() => {
      document.querySelector('.bottom-nav [data-nav="mission"]').dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true })
      );
    });
    await expect(page.locator("#training")).toHaveClass(/active/);
    await completeFormPracticals(page);
    const masteryCount = await page.evaluate(() => {
      for (let index = 0; index < localStorage.length; index += 1) {
        const value = localStorage.getItem(localStorage.key(index));
        try {
          const parsed = JSON.parse(value);
          if (parsed && parsed.formMastery) return Object.keys(parsed.formMastery).length;
        } catch {
          // Ignore non-JSON local storage values.
        }
      }
      return 0;
    });
    expect(masteryCount).toBe(4);
  });

  test("production start is gated while the automated baseline remains compatible", async ({ page }) => {
    await enterSimulator(page);
    await page.evaluate(() => {
      window.__DRS_ENFORCE_QUALIFICATION__ = true;
    });
    await page.locator('[data-action="start-demo"]').click();
    await expect(page.locator("#training")).toHaveClass(/active/);
    await expect(page.locator("#formQualification")).toBeVisible();
  });

  test("records a defensible role handoff and displays it in the mission record", async ({ page }) => {
    await enterSimulator(page);
    await page.evaluate(() => {
      showView("mission");
      renderMission();
    });
    await expect(page.locator("#handoffWorkbench")).toBeVisible();
    await page.locator("#handoffFrom").selectOption({ label: "Cashier" });
    await page.locator("#handoffTo").selectOption({ label: "Deputy Disbursing Officer" });
    await page.locator("#handoffAmount").fill("$4,000 drawer and DD Form 1081");
    await page.locator("#handoffExplanation").fill(
      "I counted the physical drawer, reconciled it to DD Form 1081, and transferred custody with the accountability balance verified."
    );
    await page.locator('[data-overnight-action="submit-handoff"]').click();
    await expect(page.locator(".handoff-record")).toHaveCount(1);
    await expect(page.locator("#handoffFeedback")).toContainText("Handoff recorded");
  });

  test("escapes learner-entered handoff markup when rendering the record", async ({ page }) => {
    await enterSimulator(page);
    await page.evaluate(() => {
      showView("mission");
      renderMission();
    });
    await page.locator("#handoffAmount").fill("$4,000 <img src=x onerror=alert(1)>");
    await page.locator("#handoffExplanation").fill(
      "I counted and reconciled the accountability balance with the supporting form before custody transfer. <script>window.bad=true</script>"
    );
    await page.locator('[data-overnight-action="submit-handoff"]').click();
    await expect(page.locator(".handoff-record script")).toHaveCount(0);
    await expect(page.locator(".handoff-record img")).toHaveCount(0);
    expect(await page.evaluate(() => window.bad)).toBeUndefined();
  });

  test("requires denomination-level reconciliation before accepting the initial issue", async ({ page }) => {
    await enterSimulator(page);
    await page.evaluate(() => {
      loadScenario("market", false);
      showView("mission");
      renderMission();
    });
    const panel = page.locator("#drawerIssuePanel");
    await expect(panel).toBeVisible();
    expect(await panel.locator(".denomination-table [role='row']").count()).toBeGreaterThan(1);
    await page.locator("#drawerIssueTotal").fill("3999");
    await page.locator("#drawerIssueExplanation").fill("I counted the physical denominations and the drawer is probably close.");
    await page.locator('[data-overnight-action="verify-drawer-issue"]').click();
    await expect(panel).not.toHaveClass(/is-complete/);

    await page.locator("#drawerIssueTotal").fill("4000");
    await page.locator("#drawerIssueExplanation").fill(
      "I independently extended every physical denomination, applied the directed rate, and reconciled the result to the accountability balance."
    );
    await page.locator('[data-overnight-action="verify-drawer-issue"]').click();
    await expect(panel).toHaveClass(/is-complete/);
  });

  test("blocks an unexplained decision and records a defensible rationale", async ({ page }) => {
    await enterSimulator(page);
    await page.evaluate(() => {
      window.__DRS_ENFORCE_REASONING__ = true;
      loadScenario("cashier-standup", false);
      showView("mission");
      renderMission();
    });
    await expect(page.locator("#decisionRationale")).toBeVisible();

    const before = await page.evaluate(() => state.decisionRationales.length);
    await page.evaluate(() => {
      const currentEvent = scenario().events[state.eventIndex];
      chooseEvent(currentEvent.choices[0].id);
    });
    const afterWeak = await page.evaluate(() => state.decisionRationales.length);
    expect(afterWeak).toBe(before);

    await page.locator("#decisionRationale").fill(
      "I will verify the appointment and physical count because accepting accountability requires support and reconciliation."
    );
    await page.evaluate(() => {
      const currentEvent = scenario().events[state.eventIndex];
      chooseEvent(currentEvent.choices[0].id);
    });
    const afterStrong = await page.evaluate(() => state.decisionRationales.length);
    expect(afterStrong).toBe(before + 1);
  });

  test("blocks mission decisions until the initial cash issue is accepted", async ({ page }) => {
    await enterSimulator(page);
    await page.evaluate(() => {
      window.__DRS_ENFORCE_WORKFLOW_INTEGRITY__ = true;
      loadScenario("cashier-standup", false);
      showView("mission");
      renderMission();
    });
    await page.locator("#decisionRationale").fill(
      "I will verify the appointment and reconcile accountability before accepting the cashier advance."
    );
    await page.evaluate(() => {
      const currentEvent = scenario().events[state.eventIndex];
      chooseEvent(currentEvent.choices[0].id);
    });
    expect(await page.evaluate(() => state.decisionRationales.length)).toBe(0);
    await expect(page.locator("#drawerIssueFeedback")).toBeVisible();
  });

  test("blocks team decisions until every assigned role is briefed", async ({ page }) => {
    await enterSimulator(page);
    await page.evaluate(() => {
      window.__DRS_ENFORCE_WORKFLOW_INTEGRITY__ = true;
      state.mode = "Team";
      loadScenario("cashier-standup", false);
      showView("mission");
      renderMission();
    });
    await page.locator("#decisionRationale").fill(
      "I will verify the appointment evidence before accepting accountability because this control prevents an unauthorized cash transfer."
    );
    await page.evaluate(() => {
      const currentEvent = scenario().events[state.eventIndex];
      chooseEvent(currentEvent.choices[0].id);
    });
    expect(await page.evaluate(() => state.decisionRationales.length)).toBe(0);
    await expect(page.locator("#roleBoard")).toBeVisible();
  });

  test("locks a team AAR until an accountable handoff is recorded", async ({ page }) => {
    await enterSimulator(page);
    await page.evaluate(() => {
      window.__DRS_ENFORCE_WORKFLOW_INTEGRITY__ = true;
      state.mode = "Team";
      state.handoffs = [];
      showView("mission");
      renderMission();
      const aar = document.querySelector('[data-nav="aar"]');
      aar?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    });
    await expect(page.locator("#mission")).toHaveClass(/active/);
    await expect(page.locator("#handoffWorkbench")).toBeVisible();
  });

  test("requires a substantive AAR reflection and persists the team replay plan", async ({ page }) => {
    await enterSimulator(page);
    await page.evaluate(() => {
      showView("aar");
      renderAar();
    });
    await expect(page.locator("#aarReflection")).toBeVisible();
    await page.locator("#aarBalanceExplanation").fill("It balanced.");
    await page.locator("#aarControlExplanation").fill("We checked it.");
    await page.locator("#aarReplayPlan").fill("Do better.");
    await page.locator('[data-overnight-action="save-aar-reflection"]').click();
    await expect(page.locator("#aarReflectionFeedback")).toContainText("needs revision");

    await page.locator("#aarBalanceExplanation").fill(
      "The physical cash by denomination reconciled to the book accountability after every supported payment and final return."
    );
    await page.locator("#aarControlExplanation").fill(
      "The pre-payment support review prevented the greatest risk because the voucher and receipt evidence exposed a duplicate payment."
    );
    await page.locator("#aarReplayPlan").fill(
      "On replay the team will assign the reviewer earlier, verify support before cash movement, and brief the handoff aloud."
    );
    await page.locator('[data-overnight-action="save-aar-reflection"]').click();
    await expect(page.locator("#aarReflectionFeedback")).toContainText("AAR reflection saved");
    expect(await page.evaluate(() => state.aarReflection?.scenarioId)).toBeTruthy();
  });

  test("new qualification and scenario surfaces fit a phone viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await enterSimulator(page);
    await expect(page.locator("#scenarioCatalog")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await openTraining(page);
    await expect(page.locator("#formQualification")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.evaluate(() => {
      loadScenario("continuity", false);
      showView("mission");
      renderMission();
    });
    await expect(page.locator("#missionOrder")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  });
});
