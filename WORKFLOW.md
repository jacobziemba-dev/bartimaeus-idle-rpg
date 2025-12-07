# Workflow Guide for Solo Development

This document explains the simple workflow setup for this project.

## Branch Strategy (Keep It Simple!)

### Main Branch Only
For most changes, just work directly on `main`:
```bash
# Make changes
git add .
git commit -m "description"
git push
```

### Optional: Experiment Branches
Use branches only when experimenting with big changes:
```bash
# Create branch for testing
git checkout -b test/new-feature

# Test your changes
# If good, merge back
git checkout main
git merge test/new-feature
git push

# Delete the test branch
git branch -d test/new-feature
```

## GitHub Actions (Automated)

Two simple workflows run automatically:

### 1. Basic Checks (ci.yml)
- Runs when you push to `main`
- Checks JavaScript syntax
- That's it!

### 2. Deploy to GitHub Pages (deploy.yml)
- Runs when you push to `main`
- Automatically deploys your game
- Live at: https://jacobziemba-dev.github.io/bartimaeus-idle-rpg

## Quick Reference

### Daily workflow:
```bash
# Edit files, test in browser
git add .
git commit -m "what you changed"
git push
```

### If you want to try something risky:
```bash
# Make a backup branch
git checkout -b backup
git push origin backup

# Go back to main and experiment
git checkout main
# ... make changes ...

# If it breaks, restore from backup
git stash  # Save any uncommitted work
git checkout backup  # Switch to backup
git checkout -b main-new  # Create new main from backup
# Or merge backup into main
```

That's all you need! Keep it simple.
