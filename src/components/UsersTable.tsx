import type { User } from "../types/user";
import { Icon } from "./Icon";

const roleClass: Record<string, string> = {
  Admin: "purple",
  Developer: "blue",
  Designer: "pink",
  Manager: "orange",
  Analyst: "teal",
  Support: "neutral",
};

export function UsersTable({
  users,
  onReset,
}: {
  users: readonly User[];
  onReset: () => void;
}) {
  if (!users.length)
    return (
      <div className="empty-state">
        <span className="empty-icon">
          <Icon name="search" size={26} />
        </span>
        <h3>No users found</h3>
        <p>Try another name or adjust your filters.</p>
        <button className="button secondary" onClick={onReset}>
          Clear filters
        </button>
      </div>
    );

  return (
    <div className="table-scroll">
      <table>
        <caption className="sr-only">
          Users matching the current search and filters
        </caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="person">
                  <span
                    className={`avatar avatar-${user.id % 6}`}
                    aria-hidden="true"
                  >
                    {user.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span
                    className={`person-name${user.active ? " person-name-active" : ""}`}
                  >
                    {user.name}
                  </span>
                </div>
              </td>
              <td>
                <span
                  className={`role-badge ${roleClass[user.role] ?? "neutral"}`}
                >
                  {user.role}
                </span>
              </td>
              <td>
                <span
                  className={`status ${user.active ? "active" : "inactive"}`}
                >
                  <span className="status-dot" />
                  {user.active ? "Active" : "Inactive"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
