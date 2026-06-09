const { test, expect } = require("@playwright/test");

async function enterApp(page) {
  await page.goto("/?testUnified=1");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const acknowledgement = page.locator("#disclaimerAck");
  if (await acknowledgement.isVisible().catch(() => false)) {
    await acknowledgement.check();
    await page.locator("#acceptDisclaimer").click();
  }

  await expect(page.locator("body")).toBeVisible();
}

test("app loads without JavaScript errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await enterApp(page);
  await expect(page.locator("body")).toBeVisible();
  expect(errors).toEqual([]);
});

test("Training Bay presents one mastery module at a time", async ({ page }) => {
  await enterApp(page);
  await page.locator('[data-nav="training"]:visible').first().click();

  await expect(page.locator("#training")).toHaveClass(/active/);
  await expect(page.locator("#unifiedTrainingPath")).toBeVisible();
  await expect(page.locator(".unified-module")).toHaveCount(1);
  await expect(page.locator(".unified-readiness strong")).toHaveText(/0\/9|[1-9]\/9/);
  await expect(page.locator(".unified-module-track button")).toHaveCount(9);
  await expect(page.locator(".unified-module-track button small")).toHaveCount(0);
  await expect(page.locator(".unified-why")).toContainText(
    "mission should not begin with cash changing hands"
  );
  await expect(page.locator(".unified-example")).toContainText(
    "cashier reports for duty"
  );
  await expect(page.locator(".unified-form-map")).toContainText(
    "Appointing authority"
  );
  await expect(page.locator(".unified-form-map")).toContainText(
    "Appointed duty"
  );
  await expect(page.locator(".unified-learn")).toContainText(
    "Disbursing Officer"
  );
  await expect(page.locator(".unified-learn")).toContainText("Cashier");
  await expect(
    page.locator('#unifiedPracticalMount [data-practical="dd577"]:visible')
  ).toHaveCount(1);
  await expect(
    page.locator('[data-unified-action="continue"]')
  ).toBeDisabled();
});

test("mobile progress rail stays compact and lesson content remains readable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterApp(page);
  await page.locator('[data-nav="training"]:visible').first().click();

  const rail = page.locator(".unified-module-track");
  await expect(rail).toBeVisible();
  await expect(page.locator(".unified-track-caption")).toContainText(
    "Roles, Authority, and DD Form 577"
  );

  const circles = await rail.locator("button").evaluateAll((buttons) =>
    buttons.map((button) => {
      const box = button.getBoundingClientRect();
      return { width: box.width, height: box.height };
    })
  );

  expect(circles).toHaveLength(9);
  for (const circle of circles) {
    expect(circle.width).toBeLessThanOrEqual(48);
    expect(circle.height).toBeLessThanOrEqual(48);
  }
});

test("balance discrepancy field accepts a negative value", async ({ page }) => {
  await enterApp(page);

  await page.evaluate(() => {
    localStorage.setItem(
      "drsUnifiedTrainingV2",
      JSON.stringify({
        current: 5,
        completed: [
          "roles-577",
          "advance-1081",
          "drawer-count",
          "agent-2665",
          "currency-branch",
        ],
        answers: {},
      })
    );
  });
  await page.reload();
  await page.locator('[data-nav="training"]:visible').first().click();

  const discrepancy = page.locator(
    '#unifiedPracticalMount [data-practical="balance"]:visible [data-practical-field="discrepancy"]'
  );
  await expect(discrepancy).toBeVisible();
  await discrepancy.fill("-15");
  await expect(discrepancy).toHaveValue("-15");
});
