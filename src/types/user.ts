export interface User {
  id: number
  name: string
  role: string
  active: boolean
}

export type StatusFilter = 'all' | 'active' | 'inactive'
export type SortOrder = 'name-asc' | 'name-desc'

export interface UserFilters {
  search: string
  role: string
  status: StatusFilter
  sort: SortOrder
}
