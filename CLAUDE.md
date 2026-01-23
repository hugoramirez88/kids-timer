# Kids Timer - Development Notes

## Workflow Requirements

### Before Starting Any Task
1. **Read this CLAUDE.md** - Review all notes and guidelines
2. **Check CHANGELOG.md** - Understand recent changes and current version

### After Completing Any Task
1. **Update CHANGELOG.md** - Document what changed under "Unreleased" section
2. **Review this CLAUDE.md** - Add any new learnings or gotchas encountered
3. **Commit and push** - See Git Workflow section below

## Git Workflow

### Versioning (Semantic Versioning)
- **MAJOR** (X.0.0): Breaking changes, incompatible API changes
- **MINOR** (0.X.0): New features, backward-compatible functionality
- **PATCH** (0.0.X): Bug fixes, documentation, minor improvements

### Commit Process
```bash
cd /home/in/kids-timer
git add <specific-files>
git commit -m "type: description"
git push origin master
```

### Commit Message Types
- `feat:` - New feature (triggers MINOR bump)
- `fix:` - Bug fix (triggers PATCH bump)
- `docs:` - Documentation only (triggers PATCH bump)
- `refactor:` - Code refactoring (triggers PATCH bump)
- `style:` - Formatting, no code change (triggers PATCH bump)
- `chore:` - Maintenance tasks (triggers PATCH bump)

### Version Bump (when releasing)
1. Update version in `package.json`
2. Move "Unreleased" items to new version section in CHANGELOG.md
3. Commit with message: `chore: bump version to X.Y.Z`

## Project Setup

- **Base directory**: `/home/in/kids-timer`
- **Framework**: Vue 3 + Vite + Pinia
- **Node version**: Check with `node -v`

## Running the Dev Server

```bash
cd /home/in/kids-timer
npm run dev
```

**Important**: The dev server may not use port 5173. Check the output for the actual port:
- Vite will try 5173 first, then 3000, 3001, etc.
- Look for `Local: http://localhost:XXXX` in the output

## Playwright Testing (webapp-testing skill)

This system uses an externally-managed Python environment. Use a virtual environment:

```bash
# Create venv (only needed once)
python3 -m venv /tmp/playwright-venv
/tmp/playwright-venv/bin/pip install playwright
/tmp/playwright-venv/bin/python -m playwright install chromium

# Run tests
/tmp/playwright-venv/bin/python your_test_script.py
```

## Key Directories

- `src/components/Progress/` - Progress indicator components
- `src/stores/` - Pinia stores (timer, settings)
- `src/views/` - Main views
- `docs/plans/` - Design documents
