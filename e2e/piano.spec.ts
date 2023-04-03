import { test, expect } from "@playwright/test";

// See here how to get started:
// https://playwright.dev/docs/intro

test("displays a piano at the root url", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("div.piano")).toBeVisible();
});

test("displays three full octaves and a single note in the last octave in the piano", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("div.piano")).toBeVisible();
  await expect(page.locator("div.octave")).toHaveCount(4);
  await expect(page.locator("div.note")).toHaveCount(37);
});

test("clicking on a key plays the corresponding note", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("div.piano")).toBeVisible();
  await expect(page.locator("div.octave")).toHaveCount(4);
  await expect(page.locator("div.note")).toHaveCount(37);
  await page.click("div.note[data-note='C4']");
  await expect(page.locator("audio[data-note='C4']")).toBeVisible();
});
