import type { CSSProperties } from 'react'

const paths = {
  people: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M15 3.13a4 4 0 0 1 0 7.75" /><circle cx="9" cy="7" r="4" /></>,
  search: <><circle cx="10.8" cy="10.8" r="7.3" /><path d="m16 16 4.5 4.5" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  pause: <><path d="M9 8v8m6-8v8" /><circle cx="12" cy="12" r="9" /></>,
  roles: <><rect x="3" y="7" width="18" height="14" rx="3" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a22 22 0 0 0 18 0m-9 0v3" /></>,
  left: <path d="m14 6-6 6 6 6" />,
  right: <path d="m10 6 6 6-6 6" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  reset: <><path d="M3 10a9 9 0 1 1 2.6 8.4M3 4v6h6" /></>,
} as const

export function Icon({ name, size = 20, style }: { name: keyof typeof paths; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>{paths[name]}</svg>
}
