import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(cleanup);

describe("directory interactions", () => {
  it("paginates and returns to the first page when a filter changes", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText("Aisha Khan")).toBeDefined();
    expect(
      (screen.getByLabelText("Rows per page") as HTMLSelectElement).value,
    ).toBe("10");
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(
      11,
    );
    expect(screen.queryByText("Keiko Tanaka")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("Keiko Tanaka")).toBeDefined();
    await user.selectOptions(
      screen.getByLabelText("Filter by status"),
      "inactive",
    );
    expect(screen.getByText("Ben Smith")).toBeDefined();
    expect(
      (
        screen.getByRole("button", {
          name: "Previous page",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(
      7,
    );
  });

  it("combines filters and clears an empty search", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(
      screen.getByLabelText("Filter by role"),
      "Developer",
    );
    await user.selectOptions(
      screen.getByLabelText("Filter by status"),
      "inactive",
    );
    expect(screen.getByText("Ben Smith")).toBeDefined();
    expect(screen.queryByText("Daniel Brown")).toBeNull();
    await user.type(screen.getByRole("searchbox"), "no such person");
    expect(
      screen.getByRole("heading", { name: "No users found" }),
    ).toBeDefined();
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByText("Aisha Khan")).toBeDefined();
    expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("");
    expect(
      (screen.getByLabelText("Filter by status") as HTMLSelectElement).value,
    ).toBe("all");
    expect(
      (screen.getByLabelText("Filter by role") as HTMLSelectElement).value,
    ).toBe("");
  });

  it("changes page size and sorts the displayed rows", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(
      screen.getAllByRole("columnheader").map((header) => header.textContent),
    ).toEqual(["Name", "Role", "Status"]);
    expect(
      within(screen.getByLabelText("Sort users"))
        .getAllByRole("option")
        .map((option) => option.textContent),
    ).toEqual(["Name: A–Z", "Name: Z–A"]);
    await user.selectOptions(screen.getByLabelText("Rows per page"), "20");
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(
      21,
    );
    expect(
      (screen.getByRole("button", { name: "Next page" }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
    await user.selectOptions(screen.getByLabelText("Rows per page"), "30");
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(
      25,
    );
    expect(
      (screen.getByRole("button", { name: "Next page" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    await user.selectOptions(screen.getByLabelText("Sort users"), "name-desc");
    expect(
      within(screen.getByRole("table")).getAllByRole("row")[1]?.textContent,
    ).toContain("Zara Okafor");
    await user.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(
      within(screen.getByRole("table")).getAllByRole("row")[1]?.textContent,
    ).toContain("Aisha Khan");
  });
});
