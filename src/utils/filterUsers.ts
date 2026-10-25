import type { User, UserFilters } from '../types/user'

export const defaultFilters: UserFilters = {
  search: '', role: '', status: 'all', sort: 'name-asc',
}

export function filterUsers(users: readonly User[], filters: UserFilters): User[] {
  const query = filters.search.trim().toLocaleLowerCase()
  const filtered = users.filter((user) => {
    const matchesSearch = user.name.toLocaleLowerCase().includes(query)
    const matchesRole = !filters.role || user.role === filters.role
    const matchesStatus = filters.status === 'all' || user.active === (filters.status === 'active')
    return matchesSearch && matchesRole && matchesStatus
  })

  return filtered.sort((a, b) => filters.sort === 'name-desc'
    ? b.name.localeCompare(a.name)
    : a.name.localeCompare(b.name))
}
