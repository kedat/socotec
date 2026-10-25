import { describe, expect, it } from "vitest";
import { users } from "../data/users";
import { defaultFilters, filterUsers } from "./filterUsers";

describe("user filtering", () => {
  it("preserves the original four users and supplies unique sample IDs", () => {
    expect(users).toHaveLength(24);
    expect(new Set(users.map((user) => user.id)).size).toBe(users.length);
    expect(users[0]).toEqual({
      id: 1,
      name: "Aisha Khan",
      role: "Admin",
      active: true,
    });
  });

  it("finds names without case sensitivity and trims surrounding whitespace", () => {
    expect(
      filterUsers(users, { ...defaultFilters, search: "  AISHA  " }).map(
        (user) => user.id,
      ),
    ).toEqual([1]);
  });

  it("only matches names, excluding roles and numeric IDs", () => {
    expect(
      filterUsers(users, { ...defaultFilters, search: "designer" }),
    ).toEqual([]);
    expect(filterUsers(users, { ...defaultFilters, search: "24" })).toEqual([]);
  });

  it("combines search, role, and status filters", () => {
    expect(
      filterUsers(users, {
        ...defaultFilters,
        search: "ben",
        role: "Developer",
        status: "inactive",
      }).map((user) => user.id),
    ).toEqual([2]);
    expect(
      filterUsers(users, {
        ...defaultFilters,
        search: "ben",
        role: "Developer",
        status: "active",
      }),
    ).toEqual([]);
  });

  it("treats false as an inactive status", () => {
    const result = filterUsers(users, {
      ...defaultFilters,
      status: "inactive",
    });
    expect(result).toHaveLength(6);
    expect(result.every((user) => user.active === false)).toBe(true);
  });

  it("sorts alphabetically without mutating the source", () => {
    const original = users.map((user) => user.id);
    expect(
      filterUsers(users, { ...defaultFilters, sort: "name-desc" })[0]?.name,
    ).toBe("Zara Okafor");
    expect(
      filterUsers([...users].reverse(), {
        ...defaultFilters,
        sort: "name-asc",
      })[0]?.name,
    ).toBe("Aisha Khan");
    expect(users.map((user) => user.id)).toEqual(original);
  });

  it("handles an empty dataset", () => {
    expect(filterUsers([], defaultFilters)).toEqual([]);
  });

  it("treats whitespace-only search as an empty query", () => {
    expect(filterUsers(users, { ...defaultFilters, search: " \t " })).toEqual(
      filterUsers(users, defaultFilters),
    );
  });

  it("supports a new role without changing the filter logic", () => {
    const newUser = {
      id: 25,
      name: "Alex Rivera",
      role: "QA Engineer",
      active: true,
    };
    expect(
      filterUsers([...users, newUser], {
        ...defaultFilters,
        role: "QA Engineer",
      }),
    ).toEqual([newUser]);
  });

  it("keeps equal names in their original order without sorting by ID", () => {
    const duplicates = [
      { id: 20, name: "Alex Rivera", role: "Designer", active: true },
      { id: 2, name: "Alex Rivera", role: "Developer", active: false },
    ];
    for (const sort of ["name-asc", "name-desc"] as const) {
      expect(
        filterUsers(duplicates, { ...defaultFilters, sort }).map(
          (user) => user.id,
        ),
      ).toEqual([20, 2]);
    }
  });
});
