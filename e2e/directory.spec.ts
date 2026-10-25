import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // External fonts are optional and should not determine whether tests pass.
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) =>
    route.abort(),
  );
  await page.goto("/");
});

test("starts with ten users, name-only sorting, and the full directory overview", async ({
  page,
}) => {
  await expect(
    page.getByRole("heading", { name: "User directory" }),
  ).toBeVisible();
  await expect(page.getByRole("columnheader")).toHaveText([
    "Name",
    "Role",
    "Status",
  ]);
  await expect(page.getByLabel("Rows per page")).toHaveValue("10");
  await expect(page.getByLabel("Rows per page").locator("option")).toHaveText([
    "10",
    "20",
    "30",
  ]);
  await expect(page.getByLabel("Sort users").locator("option")).toHaveText([
    "Name: A–Z",
    "Name: Z–A",
  ]);
  await expect(page.locator("tbody tr")).toHaveCount(10);
  await expect(page.locator(".table-footer > p")).toHaveText(
    "Showing 1–10 of 24 users",
  );
  await expect(
    page.getByRole("button", { name: "Previous page" }),
  ).toBeDisabled();

  const overview = page.getByRole("region", { name: "Directory overview" });
  const stats = [
    ["Total users", "24"],
    ["Active users", "18"],
    ["Inactive users", "06"],
    ["Unique roles", "06"],
  ] as const;
  for (const [label, count] of stats) {
    const card = overview
      .getByRole("article")
      .filter({ has: page.getByText(label, { exact: true }) });
    await expect(card.getByText(count, { exact: true })).toBeVisible();
  }
});

test("navigates all pages and disables navigation at the boundaries", async ({
  page,
}) => {
  const next = page.getByRole("button", { name: "Next page" });
  const previous = page.getByRole("button", { name: "Previous page" });
  await next.click();
  await expect(page.locator("tbody tr")).toHaveCount(10);
  await expect(page.locator("tbody tr").first()).toContainText("Keiko Tanaka");
  await expect(page.locator(".table-footer > p")).toHaveText(
    "Showing 11–20 of 24 users",
  );
  await next.click();
  await expect(page.locator("tbody tr")).toHaveCount(4);
  await expect(page.locator("tbody tr").first()).toContainText("Uma Iyer");
  await expect(page.locator(".table-footer > p")).toHaveText(
    "Showing 21–24 of 24 users",
  );
  await expect(next).toBeDisabled();
  await previous.click();
  await previous.click();
  await expect(page.locator("tbody tr").first()).toContainText("Aisha Khan");
  await expect(previous).toBeDisabled();
});

test("supports twenty and thirty rows and resets the page when the size changes", async ({
  page,
}) => {
  await page.getByLabel("Rows per page").selectOption("20");
  await expect(page.locator("tbody tr")).toHaveCount(20);
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(4);
  await page.getByLabel("Rows per page").selectOption("30");
  await expect(page.locator("tbody tr")).toHaveCount(24);
  await expect(page.locator(".table-footer > p")).toHaveText(
    "Showing 1–24 of 24 users",
  );
  await expect(
    page.getByRole("button", { name: "Previous page" }),
  ).toBeDisabled();
  await expect(page.getByRole("button", { name: "Next page" })).toBeDisabled();
  await page.getByLabel("Rows per page").selectOption("10");
  await expect(page.locator("tbody tr")).toHaveCount(10);
});

test("finds names regardless of case and surrounding spaces", async ({
  page,
}) => {
  await page
    .getByRole("searchbox", { name: "Search users by name" })
    .fill("  aIsHa  ");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody tr")).toContainText("Aisha Khan");
  await expect(page.getByRole("status")).toHaveText(
    "1 of 24 users match your filters",
  );
});

for (const query of ["Developer", "24"]) {
  test(`does not search roles or IDs: ${query}`, async ({ page }) => {
    await page.getByRole("searchbox").fill(query);
    await expect(
      page.getByRole("heading", { name: "No users found" }),
    ).toBeVisible();
    await expect(page.locator(".table-footer > p")).toHaveText(
      "Showing 0–0 of 0 users",
    );
    await expect(
      page.getByRole("button", { name: "Next page" }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();
  });
}

test("combines name, role, and status filters without changing overview totals", async ({
  page,
}) => {
  await page.getByLabel("Filter by role").selectOption("Developer");
  await page.getByLabel("Filter by status").selectOption("inactive");
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await expect(page.locator("tbody tr")).toContainText([
    "Ben Smith",
    "Liam Murphy",
  ]);
  await page.getByRole("searchbox").fill("ben");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody tr")).toContainText("Ben Smith");
  await expect(
    page
      .getByRole("region", { name: "Directory overview" })
      .getByRole("article")
      .first(),
  ).toContainText("24");
  await page.getByRole("searchbox").fill("");
  await page.getByLabel("Filter by status").selectOption("active");
  await expect(page.locator("tbody tr")).toHaveCount(5);
  await expect(page.locator("tbody tr td:nth-child(3)")).toHaveText(
    Array(5).fill("Active"),
  );
});

for (const change of ["search", "role", "status", "sort"] as const) {
  test(`returns to page one when ${change} changes`, async ({ page }) => {
    await page.getByRole("button", { name: "Next page" }).click();
    switch (change) {
      case "search":
        await page.getByRole("searchbox").fill("Aisha");
        break;
      case "role":
        await page.getByLabel("Filter by role").selectOption("Designer");
        break;
      case "status":
        await page.getByLabel("Filter by status").selectOption("inactive");
        break;
      case "sort":
        await page.getByLabel("Sort users").selectOption("name-desc");
        await expect(page.locator("tbody tr").first()).toContainText(
          "Zara Okafor",
        );
        break;
    }
    await expect(
      page.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();
    await expect(page.locator(".table-footer > p")).toHaveText(/^Showing 1–/);
    await expect(page.locator("tbody tr").first()).toBeVisible();
  });
}

test("resets filters and sorting while preserving the selected page size", async ({
  page,
}) => {
  await page.getByLabel("Rows per page").selectOption("20");
  await page.getByLabel("Filter by role").selectOption("Developer");
  await page.getByLabel("Filter by status").selectOption("active");
  await page.getByLabel("Sort users").selectOption("name-desc");
  await page.getByRole("searchbox").fill("Daniel");
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await expect(page.getByLabel("Filter by role")).toHaveValue("");
  await expect(page.getByLabel("Filter by status")).toHaveValue("all");
  await expect(page.getByLabel("Sort users")).toHaveValue("name-asc");
  await expect(page.getByLabel("Rows per page")).toHaveValue("20");
  await expect(page.locator("tbody tr")).toHaveCount(20);
  await expect(page.locator("tbody tr").first()).toContainText("Aisha Khan");
  await expect(
    page.getByRole("button", { name: "Reset filters" }),
  ).toBeDisabled();
});

test("recovers from an empty result using Clear filters", async ({ page }) => {
  await page.getByLabel("Filter by role").selectOption("Designer");
  await page.getByLabel("Filter by status").selectOption("inactive");
  await page.getByRole("searchbox").fill("No such person");
  await expect(
    page.getByRole("heading", { name: "No users found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await expect(page.getByLabel("Filter by role")).toHaveValue("");
  await expect(page.getByLabel("Filter by status")).toHaveValue("all");
  await expect(page.locator("tbody tr")).toHaveCount(10);
});

test("uses bold active names, green active status, and red inactive status", async ({
  page,
}) => {
  const active = page.getByRole("row").filter({ hasText: "Aisha Khan" });
  const inactive = page.getByRole("row").filter({ hasText: "Ben Smith" });
  await expect(active.locator(".person-name")).toHaveCSS("font-weight", "700");
  await expect(inactive.locator(".person-name")).toHaveCSS(
    "font-weight",
    "550",
  );
  await expect(active.getByText("Active", { exact: true })).toHaveCSS(
    "color",
    "rgb(21, 128, 61)",
  );
  await expect(inactive.getByText("Inactive", { exact: true })).toHaveCSS(
    "color",
    "rgb(185, 28, 28)",
  );
});

test("keeps all three columns visible without horizontal page overflow", async ({
  page,
}) => {
  const firstRow = page.locator("tbody tr").first();
  await firstRow.scrollIntoViewIfNeeded();
  await expect(firstRow.getByText("Aisha Khan")).toBeInViewport();
  await expect(firstRow.getByText("Admin", { exact: true })).toBeInViewport();
  await expect(firstRow.getByText("Active", { exact: true })).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
