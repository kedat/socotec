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
});
