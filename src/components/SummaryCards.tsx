import type { User } from "../types/user";
import { Icon } from "./Icon";

export function SummaryCards({ users }: { users: readonly User[] }) {
  const active = users.filter((user) => user.active).length;
  const stats = [
    {
      label: "Total users",
      value: users.length,
      detail: "People in your directory",
      icon: "people",
      tone: "green",
    },
    {
      label: "Active users",
      value: active,
      detail: "Currently active",
      icon: "check",
      tone: "green",
    },
    {
      label: "Inactive users",
      value: users.length - active,
      detail: "Currently inactive",
      icon: "pause",
      tone: "orange",
    },
    {
      label: "Unique roles",
      value: new Set(users.map((user) => user.role)).size,
      detail: "Across your team",
      icon: "roles",
      tone: "purple",
    },
  ] as const;

  return (
    <section className="summary-grid" aria-label="Directory overview">
      {stats.map((stat) => (
        <article className="stat-card" key={stat.label}>
          <div className="stat-top">
            <span>{stat.label}</span>
            <span className={`stat-icon ${stat.tone}`}>
              <Icon name={stat.icon} size={18} />
            </span>
          </div>
          <div className="stat-value">
            {stat.value.toString().padStart(2, "0")}
          </div>
          <p>{stat.detail}</p>
        </article>
      ))}
    </section>
  );
}
