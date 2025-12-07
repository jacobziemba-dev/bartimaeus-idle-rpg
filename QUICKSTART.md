# Quick Start Guide

## What's Been Set Up

Your repository now has a **simple, automated workflow** for solo development!

### ✅ GitHub Actions (Auto-Deploy)

Two workflows are configured:

1. **Basic Checks** (`.github/workflows/ci.yml`)
   - Runs when you push to `main`
   - Validates JavaScript syntax
   - Quick and simple!

2. **Auto-Deploy** (`.github/workflows/deploy.yml`)
   - Deploys to GitHub Pages automatically
   - Runs every time you push to `main`
   - Your game goes live at: `https://jacobziemba-dev.github.io/bartimaeus-idle-rpg`

### 📝 Documentation

- **WORKFLOW.md** - Simple branch strategy guide
- **CONTRIBUTING.md** - Quick contribution guide
- **README.md** - Updated with workflow info

## How to Use

### Normal Development
```bash
# Edit your files
# Test by opening index.html in browser

# When ready:
git add .
git commit -m "what you changed"
git push

# That's it! Auto-deploys to GitHub Pages
```

### Experiment Safely
```bash
# Create a test branch
git checkout -b test/my-experiment

# Make changes and test
# ...

# If good, merge back to main
git checkout main
git merge test/my-experiment
git push

# Delete test branch
git branch -d test/my-experiment
```

## What Happens When You Push

1. ✓ Code is pushed to GitHub
2. ✓ Basic Checks workflow runs (validates JS syntax)
3. ✓ Deploy workflow runs (publishes to GitHub Pages)
4. ✓ Your game is live in ~1 minute!

## That's It!

No complex processes. No multiple branches to manage. Just code, commit, push, and it's live.

Simple and effective for solo development! 🚀
