# Contributing Guide

Thanks for contributing! This is a simple solo-dev project, so the workflow is straightforward.

## Quick Start

1. **Clone the repo**:
   ```bash
   git clone https://github.com/jacobziemba-dev/bartimaeus-idle-rpg.git
   cd bartimaeus-idle-rpg
   ```

2. **Make changes**:
   - Open `index.html` in your browser to test
   - Edit files and refresh to see changes

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Brief description of changes"
   git push
   ```

## Simple Workflow

### Main Branch
- **`main`** - The only branch you need!
  - Commit directly to main for quick fixes
  - Create feature branches if working on something experimental

### Optional: Feature Branches
If you want to experiment without affecting the live site:

```bash
# Create a branch
git checkout -b experiment/my-idea

# Make changes and test

# If it works, merge to main
git checkout main
git merge experiment/my-idea
git push

# Delete the branch
git branch -d experiment/my-idea
```

## Testing

Just open `index.html` in your browser:
- Check console (F12) for errors
- Test the feature you changed
- Make sure the game still works

## Commit Messages

Keep it simple:
- `fix: save system bug`
- `add: new hero ability`
- `update: enemy stats`

That's it! No complex rules or processes.
