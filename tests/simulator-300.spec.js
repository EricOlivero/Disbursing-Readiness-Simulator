const { test, expect } = require("@playwright/test");

const profiles = [
  ["inexperienced", 75],
  ["intermediate", 75],
  ["experienced", 50],
  ["rushed-careless", 50],
  ["mobile", 25],
  ["team-based", 25]
];

const trainingAnswers = [
  "Correct the accountability chain before payment.",
  "What happened to every dollar advanced?",
  "Count, compare, identify support, and explain the variance.",
  "Flag it and require an explanation or better support.",
  "Use 60 ZD/USD and document that it is the daily rate.",
  "Pause, repeat back the change, update the ledger plan, and continue.",
  "Follow trained emergency actions, call for help, and assign custody of the pouch.",
  "Advanced $4,000; supported $1,275; cash returned $2,725; no variance.",
  "The member can balance cash and explain the result using forms, rates, and support."
];

const decisionAnswers = [
  "Brief roles, funds advanced, rate rule, support standard, and closeout time.",
  "Repeat back the FRAGO, update the ledger plan, and enforce the 24,000 ZD cap.",
  "Follow trained emergency actions, report, assign custody, and document the interruption.",
  "Advanced $4,000; supported $1,580; expected cash back $2,420 plus remaining ZD equivalent."
];

function expandedProfiles() {
  const result = [];
  let id = 1;
  for (const [profile, count] of profiles) {
    for (let index = 0; index < count; index += 1) {
      result.push({ id: id++, profile, ordinal: index + 1 });
    }
  }
  return result;
}

async function enterApp(page) {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    localStorage.clear();
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#disclaimerAck").check();
  await page.locator("#acceptDisclaimer").click();
  await expect(page.locator("#home")).toHaveClass(/active/);
}

async function completeTraining(page, profile) {
  await page.locator('.bottom-nav [data-nav="training"]').click();
  await expect(page.locator("#lessonTitle")).toBeVisible();

  for (let index = 0; index < trainingAnswers.length; index += 1) {
    if ((profile === "inexperienced" && index < 3) || (profile === "rushed-careless" && index < 4)) {
      const choices = page.locator("#lessonChoices .choice-btn");
      const correct = page.getByRole("button", { name: trainingAnswers[index], exact: false });
      const count = await choices.count();
      for (let choiceIndex = 0; choiceIndex < count; choiceIndex += 1) {
        const candidate = choices.nth(choiceIndex);
        if (!(await candidate.evaluate((node, text) => node.innerText.includes(text), trainingAnswers[index]))) {
          await candidate.click();
          break;
        }
      }
      await expect(page.locator("#lessonFeedback")).not.toBeEmpty();
    }
    await page.getByRole("button", { name: trainingAnswers[index], exact: false }).click();
  }

  await expect(page.locator("#trainingProgressText")).toContainText("9/9");
  await expect(page.locator("#trainingGateBadge")).toContainText("Mission unlocked");
}

async function submitPayment(page, { zd, rate, usd }) {
  await page.locator("#payZdInput").fill(String(zd));
  await page.locator("#payRateInput").fill(String(rate));
  await page.locator("#payUsdInput").fill(String(usd));
  await page.locator("#paySupportInput").selectOption("complete");
  await page.locator("#payExplainInput").fill(
    `I paid ${zd} ZD at ${rate} ZD per USD, recorded ${usd} USD as supported, retained the vendor receipt and purpose, and will use it for closeout.`
  );
  await page.getByRole("button", { name: "Submit Payment Work" }).click();
}

async function runMission(page, profile) {
  await page.locator('.bottom-nav [data-nav="home"]').click();
  await page.locator('[data-action="start-demo"]').click();
  await expect(page.locator("#mission")).toHaveClass(/active/);
  await page.locator('[data-action="mark-briefed"]').click();

  const teamChecks = page.locator("[data-team-check]");
  const requiredChecks = profile === "rushed-careless" ? 5 : await teamChecks.count();
  for (let index = 0; index < requiredChecks; index += 1) {
    await teamChecks.nth(index).check();
  }

  await page.getByRole("button", { name: decisionAnswers[0], exact: false }).click();
  await submitPayment(page, { zd: 72000, rate: 60, usd: 1200 });
  await page.getByRole("button", { name: decisionAnswers[1], exact: false }).click();
  await submitPayment(page, { zd: 22800, rate: 60, usd: 380 });
  await page.getByRole("button", { name: decisionAnswers[2], exact: false }).click();
  await page.getByRole("button", { name: decisionAnswers[3], exact: false }).click();

  await expect(page.locator("#ledger li")).toHaveCount(6);
}

async function completeInject(page) {
  await page.locator('.bottom-nav [data-nav="inject"]').click();
  await expect(page.locator("#inject")).toHaveClass(/active/);
  const checks = page.locator("[data-inject-check]");
  for (let index = 0; index < await checks.count(); index += 1) {
    await checks.nth(index).check();
  }
}

async function completeCloseout(page) {
  await page.locator('.bottom-nav [data-nav="closeout"]').click();
  await expect(page.locator("#closeout")).toHaveClass(/active/);

  const counts = {
    "50000": 2,
    "10000": 4,
    "5000": 1,
    "1000": 0,
    "500": 0,
    "100": 2
  };
  for (const [denomination, count] of Object.entries(counts)) {
    await page.locator(`[data-zd-denom="${denomination}"]`).fill(String(count));
  }
  await page.locator("#closeoutSupportedInput").fill("1580");
  await page.locator("#closeoutExpectedInput").fill("2420");
  await page.locator("#closeoutExplanation").fill(
    "Advanced accountability was $4,000. Supported payments were $1,580. Physical cash was 145,200 ZD at the directed rate of 60 ZD per USD, equal to $2,420, with no variance."
  );
  await page.locator('[data-action="check-closeout"]').click();
  await expect(page.locator("#closeoutFindings")).toContainText("Closeout accepted");
}

for (const session of expandedProfiles()) {
  test(`${String(session.id).padStart(3, "0")} ${session.profile} session ${session.ordinal}`, async ({ page }) => {
    if (session.profile === "mobile") {
      await page.setViewportSize({ width: 390, height: 844 });
    }

    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await enterApp(page);
    await completeTraining(page, session.profile);
    await runMission(page, session.profile);
    await completeInject(page);
    await completeCloseout(page);
    await page.locator('[data-action="submit-aar"]').click();
    await expect(page.locator("#aar")).toHaveClass(/active/);
    await expect(page.locator("#aarLevel")).toContainText("Intermediate ready");
    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });
}

test("workflow cannot be bypassed", async ({ page }) => {
  await enterApp(page);
  const missionNav = page.locator('.bottom-nav [data-nav="mission"]');
  await expect(missionNav).toHaveAttribute("aria-disabled", "true");
  await missionNav.evaluate((button) => button.click());
  await expect(page.locator("#training")).toHaveClass(/active/);
  const closeoutNav = page.locator('.bottom-nav [data-nav="closeout"]');
  await expect(closeoutNav).toHaveAttribute("aria-disabled", "true");
  await closeoutNav.evaluate((button) => button.click());
  await expect(page.locator("#training")).toHaveClass(/active/);
});
