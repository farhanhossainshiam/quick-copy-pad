# GitHub Pages Deployment Guide

This guide will help you deploy your QuickCopy application to GitHub Pages.

## ⚠️ Quick Fix for "Get Pages site failed" Error

If you're seeing this error, **you need to enable GitHub Pages first**:

1. Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/pages`
2. Under **Source**, select **GitHub Actions** (NOT "Deploy from a branch")
3. Click **Save**
4. Wait 10-30 seconds
5. Re-run the workflow or push a new commit

**The workflow cannot deploy until Pages is enabled in repository settings!**

---

## Prerequisites

- A GitHub account
- Your code pushed to a GitHub repository

## Step-by-Step Instructions

### 1. Push Your Code to GitHub

If you haven't already, create a repository on GitHub and push your code:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: QuickCopy app with persistent storage"

# Add your GitHub repository as remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/quick-copy-pad.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages (IMPORTANT - Do this FIRST!)

**⚠️ You MUST enable GitHub Pages BEFORE the workflow can deploy!**

1. Go to your repository on GitHub (e.g., `https://github.com/YOUR_USERNAME/quick-copy-pad`)
2. Click on **Settings** tab (top menu, next to Insights)
3. In the left sidebar, scroll down and click on **Pages**
4. Under **Build and deployment**:
   - **Source**: Select `GitHub Actions` (NOT "Deploy from a branch")
5. Click **Save** button
6. Wait a few seconds for GitHub to enable Pages

**Important Notes:**
- If you don't see the "Pages" option in Settings, make sure you're the repository owner or have admin access
- The repository must be public OR you need a GitHub Pro/Team account for private repos
- After enabling, you should see a message like "Your site is ready to be published"

### 2.5. Verify Pages is Enabled

After enabling, you should see:
- A green checkmark or "Your site is ready to be published" message
- The source should show "GitHub Actions"
- You may see a URL like `https://YOUR_USERNAME.github.io/quick-copy-pad/` (it will be live after first deployment)

### 3. Update Base Path (If Needed)

If your repository name is **NOT** `quick-copy-pad`, you need to update the base path in `vite.config.ts`:

```typescript
base: '/your-repository-name/',
```

For example, if your repo is `my-quick-copy`, change it to:
```typescript
base: '/my-quick-copy/',
```

**Note**: If you're using a custom domain or deploying to `username.github.io` (user/organization page), change the base to:
```typescript
base: '/',
```

### 4. Automatic Deployment

Once you've enabled GitHub Pages:

1. **Push any changes** to the `main` or `master` branch
2. The GitHub Actions workflow will automatically:
   - Build your application
   - Deploy it to GitHub Pages
3. Your site will be available at:
   - `https://YOUR_USERNAME.github.io/quick-copy-pad/`
   - Or your custom domain if configured

### 5. Check Deployment Status

1. Go to your repository
2. Click on the **Actions** tab
3. You'll see the deployment workflow running
4. Once complete, a green checkmark will appear
5. Your site will be live!

## Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# Build the project
npm run build

# The dist folder contains your built files
# You can manually upload the dist folder contents to GitHub Pages
```

## Troubleshooting

### Error: "Get Pages site failed" or "Please verify that the repository has Pages enabled"

**This is the most common error!** It means GitHub Pages is not enabled yet.

**Solution:**
1. Go to your repository → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions** (NOT "Deploy from a branch")
3. Click **Save**
4. Wait 10-30 seconds
5. Go to **Actions** tab and re-run the workflow (or push a new commit)

**If Pages option is missing:**
- Make sure you're the repository owner or have admin permissions
- For private repos, you need GitHub Pro/Team/Enterprise account
- Try making the repository public temporarily to test

### Site shows 404 or blank page

1. **Check the base path**: Make sure the base path in `vite.config.ts` matches your repository name
2. **Wait a few minutes**: GitHub Pages can take 1-5 minutes to update
3. **Check Actions tab**: Look for any errors in the GitHub Actions workflow
4. **Verify Pages is enabled**: Go to Settings → Pages and confirm it shows "GitHub Actions"

### Assets not loading

- Ensure the base path is correctly set in `vite.config.ts`
- Clear your browser cache
- Check browser console for 404 errors
- Verify the base path matches your repository name exactly

### Build fails

- Check the Actions tab for error messages
- Ensure all dependencies are in `package.json`
- Try running `npm run build` locally to test
- Check Node.js version compatibility (workflow uses Node 20)

### Workflow runs but site doesn't update

1. Check if Pages is enabled (Settings → Pages)
2. Wait 2-5 minutes for changes to propagate
3. Clear browser cache or try incognito mode
4. Check the Actions tab - the deploy job should complete successfully

## Custom Domain (Optional)

To use a custom domain:

1. In your repository Settings → Pages
2. Enter your custom domain
3. Update your DNS records as instructed by GitHub
4. Update `vite.config.ts` base path to `/` if using a custom domain

## Repository Structure

After deployment, your repository should have:
```
quick-copy-pad/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── src/                         # Source code
├── dist/                        # Built files (generated, don't commit)
├── vite.config.ts               # Vite config with base path
├── package.json
└── ...
```

## Continuous Deployment

Every time you:
- Push to `main` or `master` branch
- Merge a pull request to `main` or `master`

The site will automatically rebuild and deploy!

## Your Live URL

Once deployed, your site will be available at:
```
https://YOUR_USERNAME.github.io/quick-copy-pad/
```

Replace `YOUR_USERNAME` with your GitHub username and `quick-copy-pad` with your repository name.

---

**Need Help?** Check the [GitHub Pages documentation](https://docs.github.com/en/pages) or open an issue in your repository.

