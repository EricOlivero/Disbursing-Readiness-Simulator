const { test, expect } = require("@playwright/test");

const MODULE_IDS = [
  "roles-577",
  "advance-1081",
  "drawer-count",
  "agent-2665",
  "currency-branch",
  "manual-balance",
  "voucher-controls",
  "team-handoff",
  "qualification",
];

const profiles = [
  ...Array.from({ length: 75 }, (_, index) => ({
    type: "inexperienced",
    number: index + 1,
    completed: 0,
    current: 0,
  })),
  ...Array.from({ length: 75 }, (_, index) => ({
    type: "intermediate",
    number: index + 1,
    completed: 4,
    current: 4,
  })),
  ...Array.from({ length: 50 }, (_, index) => ({
    type: "experienced",
    number: index + 1,
    completed: 9,
    current: 8,
  })),
  ...Array.from({ length: 50 }, (_, index) => ({
    type: "rushed-careless",
    number: index + 1,
    completed: 0,
    current: 0,
  })),
  ...Array.from({ length: 25 }, (_, index) => ({
    type: "mobile",
    number: index + 1,
    completed: 3,
    current: 3,
    mobile: true,
  })),
  ...Array.from({ length: 25 }, (_, index) => ({
    type: "team-based",
    number: index + 1,
    completed: 7,
    current: 7,
  })),
];

async function enterApp(page) {
  await page.goto("/?testUnified=1");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const acknowledgement = page.locator("#disclaimerAck");
  if (await acknowledgement.isVisible().catch(() => false)) {
    await acknowledgement.check();
    await page.locator("#acceptDisclaimer").click();
  }
}

async function seedUnifiedProgress(page, profile) {
  await page.evaluate(
    ({ moduleIds, completed, current }) => {
      localStorage.setItem(
        "drsUnifiedTrainingV1",
        JSON.stringify({
          current,
          completed: moduleIds.slice(0, completed),
          answers: {},
        })
      );
    },
    {
      moduleIds: MODULE_IDS,
      completed: profile.completed,
      current: profile.current,
    }
  );
  await page.reload();
}

for (const [index, profile] of profiles.entries()) {
  test(
    `${String(index + 1).padStart(3, "0")} ${profile.type} unified session ${
      profile.number
    }`,
    async ({ page }) => {
      const pageErrors = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));

      if (profile.mobile) {
        await page.setViewportSize({ width: 390, height: 844 });
      }

      await enterApp(page);
      await seedUnifiedProgress(page, profile);

      await page.locator('[data-nav="training"]').first().click();
      await expect(page.locator("#training")).toHaveClass(/active/);
      await expect(page.locator("#unifiedTrainingPath")).toBeVisible();
      await expect(page.locator(".unified-module")).toHaveCount(1);
      await expect(page.locator(".unified-readiness strong")).toHaveText(
        `${profile.completed}/9`
      );

      if (profile.type === "inexperienced") {
        await expect(
          page.locator(
            '#unifiedPracticalMount [data-practical="dd577"]:visible'
          )
        ).toHaveCount(1);
        await expect(
          page.locator('[data-unified-module="1"]')
        ).toBeDisabled();
      }

      if (profile.type === "intermediate") {
        await expect(page.locator(".unified-module-heading h2")).toContainText(
          "Correct Currency Process"
        );
      }

      if (profile.type === "rushed-careless") {
        const mission = page.locator('[data-nav="mission"]').first();
        await expect(mission).toBeDisabled();
        await expect(page.locator("#mission")).not.toHaveClass(/active/);
      }

      if (profile.type === "mobile") {
        await expect(page.locator(".unified-training-header")).toBeVisible();
        await expect(page.locator(".unified-module-actions")).toBeVisible();
        await expect(page.locator(".unified-module-track")).toBeVisible();
      }

      if (profile.type === "team-based") {
        await expect(page.locator(".unified-module-heading h2")).toContainText(
          "Accountable Team Handoff"
        );
        await expect(page.locator("#mission")).not.toHaveClass(/active/);
      }

      if (profile.type === "experienced") {
        const mission = page.locator('[data-nav="mission"]').first();
        await expect(mission).toBeEnabled();
        await mission.click();
        await expect(page.locator("#mission")).toHaveClass(/active/);
      }

      expect(pageErrors).toEqual([]);
    }
  );
}

test.describe("matrix integrity", () => {
  test("contains exactly 300 learner sessions", () => {
    expect(profiles).toHaveLength(300);
  });
});
