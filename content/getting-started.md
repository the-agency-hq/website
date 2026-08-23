---
title: "Getting started"
description: "From zero to a delivered Brief — create an Organization, connect GitHub, author a Brief, and let the Handler drop it into every Location."
---

This guide takes you from nothing to a Brief delivered into your projects. You will create an Organization, author a Brief in a GitHub repository, and run the Handler so every Location on your machine receives it.

## 1. Create an account

Go to [https://app.theagencyhq.dev](https://app.theagencyhq.dev) and click **Create an account**. All you need is an email address and a password.

![The Agency HQ sign-in page with the Create an account link](/images/getting-started/create-account.png)

Once you are signed in, create an **Organization**. Organization names are unique across The Agency (first come, first served), and the person who creates one becomes its Owner.

![Creating a new Organization](/images/getting-started/new-organization.png)

## 2. Connect your GitHub account

From your Organization's page, click **Connect GitHub**. You are sent to GitHub to authorize The Agency HQ app — approve it, and you return to The Agency.

![The Organization page with the Connect GitHub button](/images/getting-started/connect-github.png)

![GitHub's authorization screen for The Agency HQ app](/images/getting-started/github-authorize.png)

This authorization is what lets The Agency read your Brief repository. It is read-only: the app can see repository contents and metadata, nothing else. Only an Organization Owner can connect GitHub.

## 3. Add The Agency HQ app to a GitHub organization

Install the GitHub App on the account or GitHub organization that will host your Brief repository:

[https://github.com/apps/the-agency-hq/installations/new](https://github.com/apps/the-agency-hq/installations/new)

(The same link appears in the web app on the repository picker page.)

Choose which repositories the app can see — **Only select repositories** is fine, as long as it includes the Brief repository you create next. You can adjust this on GitHub at any time.

![Installing The Agency HQ app on a GitHub organization](/images/getting-started/github-app-install.png)

## 4. Create a GitHub repository to contain a Brief

Create a repository under that account or organization. Any name works, private or public. Two rules:

- One repository per Organization, and one Organization per repository.
- The Agency reads a single branch. You pick the branch when you select the repository — the repository's default branch is pre-filled.

## 5. Mark it as a Brief source

Add a file named `the-agency-hq-settings.json` at the root of the repository:

```json
{
  "version": "1.0.0"
}
```

`version` is the layout version of the repository, not the version of your content. This file is how The Agency knows the repository is a Brief source — it will refuse to connect a repository that does not have it.

## 6. Add your content

The Agency reads five top-level directories. Everything else at the root (README, LICENSE, and so on) is ignored.

| Directory in your repo | Delivered to Locations as                  | What goes there                                                                |
|------------------------|--------------------------------------------|--------------------------------------------------------------------------------|
| `skills/`              | `.claude/skills/` **and** `.codex/skills/` | One subdirectory per skill, each with a `SKILL.md`                             |
| `rules/`               | `.claude/rules/` **and** `.codex/rules/`   | Markdown rules every Agent follows                                             |
| `agents/`              | `.claude/agents/` **and** `.codex/agents/` | Subagent definitions                                                           |
| `claude/`              | `.claude/` (verbatim)                      | Claude-only overrides — `settings.json`, `commands/`, anything Claude-specific |
| `codex/`               | `.codex/` (verbatim)                       | Codex-only overrides — `config.toml`, Codex rules                              |

`skills/`, `rules/`, and `agents/` are shared: each file in them is delivered twice, once for Claude and once for Codex. The `claude/` and `codex/` directories are escape hatches — their contents are copied through unchanged, for one Agent type only.

One restriction: symbolic links are not allowed anywhere in the repository. A symlink fails the build.

### Mission Types

Not every file belongs in every project. **Mission Types** are free-form, case-insensitive tags — `web`, `library`, `java`, whatever fits your Organization — that control which Locations receive a file.

You declare them with `.mission-types` files in the repository:

- **For a directory:** put a file named `.mission-types` in the directory. It applies to every file in that directory and all subdirectories. When directories nest, the nearest `.mission-types` above a file wins.
- **For a single file:** add a sibling file named after the full file name plus `.mission-types` — for example, `rules/css.md` is tagged by `rules/css.md.mission-types`. A sibling file overrides any directory file.

The content is one Mission Type per line:

```text
Web
Library
```

Example layout:

```text
rules/
├── .mission-types            # tags every rule below with these types…
├── api-standards.md
├── css.md
└── css.md.mission-types      # …except css.md, which uses its own
```

A file with no `.mission-types` anywhere above it applies to **every** Mission Type. The `.mission-types` files themselves are never delivered — they only tag.

At delivery time, a file is included in a Location when any of these is true:

- the file lists no Mission Types
- the Location lists no Mission Types (it accepts everything)
- the two lists share at least one entry

You set a Location's Mission Types in step 10.

## 7. Select the repository

Back at [https://app.theagencyhq.dev](https://app.theagencyhq.dev), open your Organization and choose the repository. Pick it from the list (it shows every repository the GitHub App can see), confirm the branch, and connect.

![The repository picker with a repository and branch selected](/images/getting-started/repository-picker.png)

The Agency validates the settings file, builds the first Brief version, and from then on checks the branch about once a minute. A new head commit produces a new Brief version; unchanged content never does. You can browse every built version and its files from the Organization page, and trigger a check immediately with **Rebuild**.

![The Organization page showing a built Brief version](/images/getting-started/brief-versions.png)

## 8. Install the Handler

Download the Handler from the [releases page](https://github.com/the-agency-hq/handler/releases). It installs per-user — no root or admin required.

- **macOS:** open the `.pkg` for your architecture (`…-macos-arm64.pkg` or `…-macos-amd64.pkg`). It installs the `handler` CLI at `~/.local/bin/handler` and starts the Handler daemon and menu-bar app automatically.
- **Linux:** extract the `.tar.gz` for your architecture and run `./install.sh` inside it. It installs the CLI at `~/.local/bin/handler` and runs the daemon as a systemd user service (systemd is required).

Make sure `~/.local/bin` is on your `PATH`.

## 9. Log in

```bash
handler login
```

Your browser opens — sign in with the account from step 1. The Handler stores its tokens at `~/.config/the-agency-hq/tokens.json` and refreshes them on its own from then on.

![handler login opening the browser to sign in](/images/getting-started/handler-login.png)

## 10. Initialize a project

In the project directory where your Agents will run (a **Location**) run:

```bash
handler init
```

It asks two things:

1. Which Organization this Location belongs to (arrow keys, Enter).
2. The Mission Types for this Location, comma separated. Leave it blank to accept every file in the Brief.

![handler init selecting an Organization and Mission Types](/images/getting-started/handler-init.png)

It writes a single marker file, `agent-location.json`:

```json
{
  "version": "1.0.0",
  "organizationId": "8d9d1270-6237-4e78-b1b2-05ca9be78d8f",
  "missionTypes": ["java", "cli"]
}
```

Commit this file. It is meant to be shared. When a teammate clones the project, their Handler finds the marker and sets the Location up automatically.

## The Handler does the rest

There is nothing to install by hand. Briefs arrive automatically as the Handler runs in the background. The Handler daemon runs two tasks:

1. **Receive:** every 5 minutes it asks The Agency for new Brief versions and stores them under `~/.local/share/the-agency-hq/briefs`.
2. **Distribute:** every minute it scans your home directory for `agent-location.json` markers and applies the newest Brief to each Location, keeping only the files whose Mission Types match.

## Forcing the Handler to run

You can force the Handler to run a full sync process with The Agency by running:

```bash
handler sync
```

## Status

You can see the status of the Handler and all of the Locations on your computer by running:

```bash
handler status
```

![handler status showing a Location in sync](/images/getting-started/handler-status.png)

In the project you will find the delivered `.claude/` and `.codex/` trees.

## Things to know

A few things to know:

- Delivered files are **read-only**. Don't edit them and don't commit them because they belong to the Organization. The Handler restores any modified file to the version in the Brief each time it runs.
- The Handler records everything it creates in a `.handler-manifest` file and adds all of it to `.git/info/exclude`, so none of it appears in `git status` or ends up in your repository.
- If the Handler finds files at those paths that it did not create, it skips the Location rather than overwrite your work. Run `handler sync --force` to let it adopt them.

That's it. Push a change to the Brief repository, and within minutes every Location, on every developer's machine, has it.
