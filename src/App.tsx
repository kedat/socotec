import { useState } from "react";
import { users } from "./data/users";
import type { UserFilters } from "./types/user";
import { defaultFilters, filterUsers } from "./utils/filterUsers";
import { Icon } from "./components/Icon";
import { SummaryCards } from "./components/SummaryCards";
import { UsersTable } from "./components/UsersTable";

const roles = [...new Set(users.map((user) => user.role))].sort();

export default function App() {
  const [filters, setFilters] = useState<UserFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filteredUsers = filterUsers(users, filters);
  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const visibleUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const hasFilters = Boolean(
    filters.search || filters.role || filters.status !== "all",
  );

  function updateFilter<K extends keyof UserFilters>(
    key: K,
    value: UserFilters[K],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(defaultFilters);
    setPage(1);
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to directory
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a href="./" className="brand" aria-label="People home">
            <span className="brand-mark">
              <Icon name="people" size={23} />
            </span>
            <span>
              people<span className="brand-dot">.</span>
            </span>
          </a>
          <span className="header-divider" />
          <span className="header-title">Workspace directory</span>
          <span className="sample-label">
            <span className="status-dot" />
            Sample workspace
          </span>
        </div>
      </header>

      <main id="main" className="main-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">YOUR WORKSPACE, CONNECTED</p>
            <h1>
              User directory<span className="heading-dot">.</span>
            </h1>
            <p className="page-description">
              A little clarity on the people who make it happen.
            </p>
          </div>
          <div className="heading-note">
            <span className="stacked-avatars" aria-hidden="true">
              <span>AK</span>
              <span>CJ</span>
              <span>DB</span>
            </span>
            <span>
              <strong>{users.length} people</strong>
              <br />
              One shared directory
            </span>
          </div>
        </div>

        <SummaryCards users={users} />

        <section className="directory-card" aria-labelledby="directory-heading">
          <div className="directory-heading">
            <div>
              <h2 id="directory-heading">
                All people <span className="count-badge">{users.length}</span>
              </h2>
              <p>Find the right people, a little faster.</p>
            </div>
            <span className="directory-symbol">
              <Icon name="people" size={20} />
            </span>
          </div>

          <div className="filters">
            <div className="search-field">
              <Icon name="search" size={19} />
              <label className="sr-only" htmlFor="search">
                Search users by name
              </label>
              <input
                id="search"
                type="search"
                placeholder="Search by name…"
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
              />
            </div>
            <label className="select-field">
              <span>Role</span>
              <select
                aria-label="Filter by role"
                value={filters.role}
                onChange={(event) => updateFilter("role", event.target.value)}
              >
                <option value="">All roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
            <label className="select-field">
              <span>Status</span>
              <select
                aria-label="Filter by status"
                value={filters.status}
                onChange={(event) =>
                  updateFilter(
                    "status",
                    event.target.value as UserFilters["status"],
                  )
                }
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <label className="select-field sort-field">
              <span>Sort</span>
              <select
                aria-label="Sort users"
                value={filters.sort}
                onChange={(event) =>
                  updateFilter(
                    "sort",
                    event.target.value as UserFilters["sort"],
                  )
                }
              >
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
              </select>
            </label>
          </div>

          <div className="results-bar">
            <p role="status">
              {hasFilters ? (
                <>
                  <strong>{filteredUsers.length}</strong> of {users.length}{" "}
                  users match your filters
                </>
              ) : (
                <>
                  <span className="tiny-dot" />
                  Everyone in your workspace
                </>
              )}
            </p>
            <button
              className="reset-button"
              disabled={!hasFilters && filters.sort === defaultFilters.sort}
              onClick={resetFilters}
            >
              <Icon name="reset" size={14} />
              Reset filters
            </button>
          </div>

          <UsersTable users={visibleUsers} onReset={resetFilters} />

          <div className="table-footer">
            <p aria-live="polite">
              Showing{" "}
              <strong>
                {filteredUsers.length ? (page - 1) * pageSize + 1 : 0}–
                {Math.min(page * pageSize, filteredUsers.length)}
              </strong>{" "}
              of <strong>{filteredUsers.length}</strong> users
            </p>
            <div className="pagination-controls">
              <label className="page-size">
                Rows per page{" "}
                <select
                  aria-label="Rows per page"
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
              </label>
              <nav className="pagination" aria-label="Pagination">
                <button
                  aria-label="Previous page"
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  <Icon name="left" size={16} />
                </button>
                <span aria-live="polite">
                  {page} <span className="page-of">/ {pageCount}</span>
                </span>
                <button
                  aria-label="Next page"
                  disabled={page >= pageCount}
                  onClick={() => setPage((current) => current + 1)}
                >
                  <Icon name="right" size={16} />
                </button>
              </nav>
            </div>
          </div>
        </section>

        <footer className="page-footer">
          <span>
            <span className="footer-dot" />A place for everyone on your team.
          </span>
          <span>Built for a clearer view.</span>
        </footer>
      </main>
    </>
  );
}
