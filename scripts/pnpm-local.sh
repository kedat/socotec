#!/bin/sh
# Use the project-local tools when Node.js/pnpm are not installed on this machine.
set -eu
project_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
if [ ! -x "$project_root/.tools/node/bin/node" ] || [ ! -f "$project_root/.tools/pnpm/bin/pnpm.mjs" ]; then
  printf '%s\n' 'Project-local tools are missing. Install Node.js 24 and pnpm 12, then use pnpm directly.' >&2
  exit 1
fi
export PATH="$project_root/.tools/node/bin:$PATH"
export XDG_CACHE_HOME="$project_root/.tools/cache"
export XDG_DATA_HOME="$project_root/.tools/data"
export XDG_STATE_HOME="$project_root/.tools/state"
export npm_config_store_dir="$project_root/.pnpm-store"
cd "$project_root"
exec "$project_root/.tools/node/bin/node" "$project_root/.tools/pnpm/bin/pnpm.mjs" "$@"
