#!/usr/bin/env bash
# macOS desktop notification for Claude Code hooks, via terminal-notifier.
#
# Invoked from .claude/settings.json hooks. The hook JSON payload arrives on
# stdin; $1 selects the flavor ("stop" = turn finished, "notify" = needs input).
# Clicking the banner focuses this project's existing VS Code window.
#
# Portable: no machine-specific paths. terminal-notifier and the `code` CLI are
# discovered at runtime; if terminal-notifier is absent it falls back to
# osascript, and it always exits 0 so a notification failure never blocks a turn.
#
# Requirements for the full experience: `brew install terminal-notifier` and the
# VS Code `code` CLI on PATH (Command Palette: "Shell Command: Install 'code'").

kind="${1:-stop}"
payload="$(cat 2>/dev/null)"

# Hooks can run under a minimal PATH; make Homebrew (Apple Silicon + Intel)
# discoverable so `command -v` finds the helpers.
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

# Session working directory: payload cwd, then hook env, then $PWD.
cwd="$(printf '%s' "$payload" | jq -r '.cwd // empty' 2>/dev/null)"
[ -z "$cwd" ] && cwd="${CLAUDE_PROJECT_DIR:-$PWD}"

# The folder VS Code actually has open is the git repo root -- users open the
# repo root, not the deep subdirectory a session may be running in. Passing a
# subdir to `code` spawns a stray new window; passing the repo root focuses the
# existing window. Fall back to the project dir, then cwd, when there is no
# git root.
opendir="$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null)"
[ -z "$opendir" ] && opendir="${CLAUDE_PROJECT_DIR:-$cwd}"
project="$(basename "$opendir" 2>/dev/null)"
[ -z "$project" ] && project="project"

# Group per session: a session's latest banner replaces its previous one, while
# separate sessions in the same project stay independent.
session="$(printf '%s' "$payload" | jq -r '.session_id // empty' 2>/dev/null)"
[ -z "$session" ] && session="$project"

# Additional info: the last text block Claude emitted, read from the transcript.
transcript="$(printf '%s' "$payload" | jq -r '.transcript_path // empty' 2>/dev/null)"
message=""
if [ -n "$transcript" ] && [ -f "$transcript" ]; then
  message="$(tail -n 400 "$transcript" 2>/dev/null \
    | jq -r 'select(.message.role == "assistant") | .message.content[]? | select(.type == "text") | .text' 2>/dev/null \
    | tail -n 1)"
fi

case "$kind" in
  notify|notification)
    title="Claude Code -- needs input"
    sound="Ping"
    [ -z "$message" ] && message="Waiting on you"
    ;;
  *)
    title="Claude Code -- done"
    sound="Glass"
    [ -z "$message" ] && message="Task completed"
    ;;
esac

# Flatten newlines and cap length so the banner stays readable.
message="$(printf '%s' "$message" | tr '\n' ' ' | cut -c1-240)"

# Discover the VS Code CLI: PATH first, then the standard macOS app bundle.
code_bin="$(command -v code 2>/dev/null)"
if [ -z "$code_bin" ] && [ -x "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" ]; then
  code_bin="/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"
fi

tn_bin="$(command -v terminal-notifier 2>/dev/null)"
if [ -n "$tn_bin" ]; then
  args=(-title "$title" -subtitle "$project" -message "$message" -sound "$sound" -group "claude-$session")
  # Click opens/focuses the project window, when the code CLI is available.
  [ -n "$code_bin" ] && args+=(-execute "$code_bin $(printf '%q' "$opendir")")
  "$tn_bin" "${args[@]}" >/dev/null 2>&1
elif command -v osascript >/dev/null 2>&1; then
  # Fallback: basic banner without click-to-open (attributed to Script Editor).
  safe_message="${message//\"/\'}"
  osascript -e "display notification \"$safe_message\" with title \"$title\" subtitle \"$project\" sound name \"$sound\"" >/dev/null 2>&1
fi

exit 0
