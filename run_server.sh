#!/usr/bin/env bash
set -euo pipefail

mode="${1:-local}"

case "$mode" in
  local|dev|development)
    export JEKYLL_ENV=development
    echo "Starting local preview with local-only sections enabled..."
    bundle exec jekyll liveserve
    ;;
  public|prod|production)
    export JEKYLL_ENV=production
    echo "Starting public preview exactly as the git/deploy version should render..."
    bundle exec jekyll liveserve
    ;;
  *)
    echo "Usage: bash run_server.sh [local|public]"
    echo "  local  - development preview with local-only backups enabled"
    echo "  public - production preview matching the git/deploy version"
    exit 1
    ;;
esac


# bash run_server.sh local

# 本地展示版，显示 local-only 备份内容。默认不传参数也是这个模式：

# bash run_server.sh

# public/git/deploy 预览版：

# bash run_server.sh public
