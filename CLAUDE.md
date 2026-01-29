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

## Playwright Testing

This project has a comprehensive Playwright test suite in `/tests/`.

### Setup (one-time)
```bash
python3 -m venv /tmp/playwright-venv
source /tmp/playwright-venv/bin/activate
pip install playwright pytest pytest-html
python -m playwright install chromium
```

### Running Tests
```bash
# Start dev server first (in separate terminal)
cd /home/in/kids-timer && npm run dev

# Run all tests
npm run test

# Run with visible browser
npm run test:headed

# Run specific test file
/tmp/playwright-venv/bin/python -m pytest tests/test_01_profiles.py -v

# Generate HTML report
npm run test:report
```

### Test Structure
```
tests/
├── conftest.py              # Fixtures, browser setup
├── config.py                # Selectors, viewports, constants
├── utils/
│   ├── port_detector.py     # Auto-detect dev server port
│   └── storage_helpers.py   # localStorage manipulation
├── test_01_profiles.py      # Profile CRUD (P01-P08)
├── test_02_timer.py         # Timer functionality (T01-T10)
├── test_03_progress.py      # Progress indicators (PR01-PR06)
├── test_04_music.py         # Music player (M01-M08)
├── test_05_rewards.py       # Rewards shop (R01-R08)
├── test_06_settings.py      # Settings panel (S01-S10)
├── test_07_badges.py        # Badge system (B01-B05)
├── test_08_ux_responsive.py # Responsive design
├── test_09_ux_states.py     # Visual states (VS01-VS08)
└── test_10_accessibility.py # Accessibility (A01-A05)
```

### Writing New Tests
- Use `create_profile()` helper to set up test data
- Use selectors from `config.py` (SEL dict)
- For timer completion tests, use 1-minute custom duration
- Audio tests may need `--headed` mode

## Key Directories

- `src/components/Progress/` - Progress indicator components
- `src/stores/` - Pinia stores (timer, settings)
- `src/views/` - Main views
- `docs/plans/` - Design documents
- `tests/` - Playwright E2E tests

## Post-Implementation Checklist

After completing features/fixes:
1. Update CHANGELOG.md - Add items under "Unreleased"
2. Update package.json version if releasing
3. Update ROADMAP.md - Mark completed items with ~~strikethrough~~ ✅
4. Commit with appropriate type prefix (feat/fix/docs/refactor)
5. Push to origin master

## Ideas Capture Workflow

Use IDEAS.md to capture improvement ideas during development:
- During development: Note ideas as they arise
- After features: Review for related ideas
- Before planning: Check for backlog items
- Periodically: Triage into ROADMAP.md or discard

## Known Patterns

### Profile Settings Sync
Profile-specific settings (theme, progressIndicator, etc.) are stored in both:
- `profiles.activeProfile` (persisted per-profile)
- `settings` store (runtime state)

On profile selection/reload, App.vue syncs them in `onMounted()`.

### Store Communication
Stores can import and call each other directly (standard Pinia pattern).
Timer → Profiles (addPoints, recordComplete)
This is intentional, not a bug.

### Default Unlocked Items
All default unlocked items are centralized in `src/data/defaults.js`.
Used by profiles.js when creating new profiles and RewardsShop.vue for ownership checks.
