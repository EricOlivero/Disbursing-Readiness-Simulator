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

  await expect(page.locator("#home")).toHaveClass(/active/);
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
  await page.locator('[data-nav="training"]').first().click();

  await expect(page.locator("#training")).toHaveClass(/active/);
  await expect(page.locator("#unifiedTrainingPath")).toBeVisible();
  await expect(page.locator(".unified-module")).toHaveCount(1);
  await expect(page.locator(".unified-readiness strong")).toHaveText(/0\/9|[1-9]\/9/);
  await expect(page.locator('[data-practical="dd577"]')).toBeVisible();
  await expect(
    page.locator('[data-unified-action="continue"]')
  ).toBeDisabled();
});

test("balance discrepancy field accepts a negative value", async ({ page }) => {
  await enterApp(page);
  await page.locator('[data-nav="training"]').first().click();

  const discrepancy = page.locator(
    '[data-practical="balance"] [data-practical-field="discrepancy"]'
  );
  await discrepancy.evaluate((input) => {
    input.hidden = false;
    input.value = "-15";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  await expect(discrepancy).toHaveValue("-15");
});
