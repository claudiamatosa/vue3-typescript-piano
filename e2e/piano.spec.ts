import { test, expect } from "@playwright/test";

// See here how to get started:
// https://playwright.dev/docs/intro

test("displays a piano at the root url", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("div.piano")).toBeVisible();
});

test("displays three full octaves and a single note in the last octave in the piano", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".piano")).toBeVisible();
  await expect(page.locator(".octave")).toHaveCount(4);
  await expect(page.locator(".key")).toHaveCount(37);
});

test("clicking on a key makes the corresponding note", async ({ page }) => {
  await page.goto("/");

  page.locator(".key[data-note='C4']").click({ delay: 2000 });
  await expect(page.locator(".key[data-note='C4']")).toHaveClass("key active");
  await expect(page.locator(".key[data-note='C4']")).toHaveClass("key");
});
