<div align="center">

<img width="898" height="228" alt="ascii-art-text" src="https://github.com/user-attachments/assets/779105d4-8965-478f-90c9-31a0f3dd0fd3" />

<h1> 🐙 octopus</h1>

**The API client for developers who live in the terminal.**

<p>
Octopus is an open-source, terminal-based REST API client built with Node.js —<br/>
designed for developers who prefer speed, simplicity and staying in their workflow.<br/>
No accounts. No GUI. No nonsense. Just fast, scriptable HTTP requests<br/>
that fit right into your existing tools.
</p>

> Octopus is built entirely on **Node.js** and is currently focused on **REST API** testing.
> WebSocket, GraphQL and gRPC support are planned for future versions.

<br/>

[![npm version](https://img.shields.io/npm/v/octopus-cli?color=00d4aa&style=flat-square)](https://npmjs.com/package/octopus-cli)
[![license](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square)](https://nodejs.org)

<br/>

[Installation](#-installation) · [Quick Start](#-quick-start) · [Commands](#-commands) · [Environments](#-environments) · [Collections](#-collections)

</div>

---
## 🛠️ Tech Stack

</div>

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **HTTP Client** | Axios | Sending HTTP requests |
| **CLI Framework** | Commander.js | Commands & flags parsing |
| **Interactivity** | Ora + Chalk | Spinners & colored output |
| **ASCII Art** | Figlet | Terminal banner |
| **Storage** | Lowdb (JSON) | Collections, logs, environments |

---

<div align="left">

## ✨ Why Octopus?

| | Postman | octopus |
|---|---|---|
| Account required | ✅ | ❌ |
| Opens in terminal | ❌ | ✅ |
| Pipeable output | ❌ | ✅ |
| Git-friendly | ❌ | ✅ |
| Instant startup | ❌ | ✅ |
| Works in scripts | ❌ | ✅ |

---

## 📦 Installation

```bash
npm install -g octopus-cli
```

Verify it works:

```bash
octopus --help
```

---

## ⚡ Quick Start

```bash
# GET request
octopus get https://api.example.com/users

# POST with a JSON body
octopus post https://api.example.com/users --body '{"name":"John","age":30}'

# With an auth token
octopus get https://api.example.com/me --token your-token-here

# With custom headers
octopus get https://api.example.com/users --header "X-Api-Key: abc123"

# With query params
octopus get https://api.example.com/posts --param page=1 --param limit=10
```

---

## 📖 Commands

### HTTP Methods

| Command | Description |
|---|---|
| `octopus get <url>` | Send a GET request |
| `octopus post <url>` | Send a POST request |
| `octopus put <url>` | Send a PUT request (full update) |
| `octopus patch <url>` | Send a PATCH request (partial update) |
| `octopus delete <url>` | Send a DELETE request |

### Flags (available on all methods)

| Flag | Short | Description |
|---|---|---|
| `--token <token>` | `-t` | Bearer token shorthand |
| `--header <header>` | `-H` | Custom header e.g. `"X-Key: value"` |
| `--param <param>` | `-p` | Query param e.g. `page=1` |
| `--body <json>` | `-b` | JSON request body |

### Examples

```bash
# PUT — full update
octopus put https://api.example.com/users/1 \
  --body '{"name":"John","age":31}' \
  --token mytoken

# PATCH — partial update
octopus patch https://api.example.com/users/1 \
  --body '{"age":31}' \
  --token mytoken

# DELETE
octopus delete https://api.example.com/users/1 --token mytoken

# Multiple headers
octopus get https://api.example.com/users \
  --header "X-Api-Key: abc123" \
  --header "Accept: application/json"
```

---

## 🌍 Environments

Stop hardcoding URLs and tokens. Use environments to switch between
development, staging, and production with a single command.

### Setup

```bash
# Create a development environment
octopus env set base_url http://localhost:3000 --env development
octopus env set token dev-token-abc --env development

# Create a staging environment
octopus env set base_url https://staging.myapi.com --env staging
octopus env set token staging-token-xyz --env staging
```

### Switch environments

```bash
octopus env use development
octopus env use staging
octopus env use production
```

### Use variables in requests

Wrap variable names in `{{ }}`:

```bash
octopus get {{base_url}}/users --token {{token}}
```

Octopus replaces `{{base_url}}` and `{{token}}` with values from the
active environment before sending the request.

### Manage environments

```bash
# List all environments and their variables
octopus env list

# Delete a specific environment
octopus env delete --env development

# Delete all environments
octopus env delete --all
```

---

## 💾 Collections

Save requests you use frequently and run them by name.

```bash
# Save a request
octopus save "get-users" --method GET --url https://api.example.com/users
octopus save "create-user" --method POST \
  --url https://api.example.com/users \
  --body '{"name":"John"}' \
  --token mytoken

# List all saved requests
octopus list

# Run a saved request
octopus run "get-users"
octopus run "create-user"
```

Collections are stored in `octopus.json` in your project folder — commit it
to Git and your whole team shares the same requests automatically.

---

## 📜 History

Every request you fire is automatically logged with its response.

```bash
# Show all history
octopus history

# Show last 10 entries
octopus history --limit 10

# Filter by method
octopus history --method GET
octopus history --method POST --limit 5
```

Logs are stored in `octopus_logs.json` in your current directory.

---

## 🔧 Tips & Tricks

**Pipe output to a file:**
```bash
octopus get https://api.example.com/users > users.json
```

**Chain with `jq` for powerful JSON processing:**
```bash
# Get all user names from a list
octopus get https://api.example.com/users | jq '.[].name'

# Get a specific field
octopus get https://api.example.com/users/1 | jq '.email'
```

**Use in shell scripts:**
```bash
#!/bin/bash
if octopus get https://api.example.com/health; then
  echo "API is up ✅"
else
  echo "API is down ❌"
fi
```

**Combine environments + collections:**
```bash
# Save once using variables
octopus save "get-users" --method GET --url "{{base_url}}/users"

# Run against any environment
octopus env use development && octopus run "get-users"
octopus env use production  && octopus run "get-users"
```

---

## 📁 Local Files

Octopus creates these files in your **current directory**:

| File | Contains |
|---|---|
| `octopus.json` | Saved request collections |
| `octopus_env.json` | Environments and variables |
| `octopus_logs.json` | Request/response history |

All files are plain JSON — human-readable and Git-friendly.

---

## 🛠️ Development

```bash
# Clone the repo
git clone https://github.com/yourusername/octopus-cli
cd octopus-cli

# Install dependencies
npm install

# Link globally for local development
npm link

# Run directly
node bin/index.js get https://jsonplaceholder.typicode.com/posts/1
```

---

## 📄 License

MIT © [Mrinmoy Borah](https://github.com/yourusername)

---

<div align="center">

Made with 🐙 by developers, for developers.

**[⭐ Leave a star on GitHub](https://github.com/yourusername/octopus-cli)** if you find it useful!

</div>
