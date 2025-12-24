# GitHub Pages Deployment Guide

This guide will help you deploy your QuickCopy application to GitHub Pages.

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

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Source**: `GitHub Actions`
5. Click **Save**

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

### Site shows 404 or blank page

1. **Check the base path**: Make sure the base path in `vite.config.ts` matches your repository name
2. **Wait a few minutes**: GitHub Pages can take 1-5 minutes to update
3. **Check Actions tab**: Look for any errors in the GitHub Actions workflow

### Assets not loading

- Ensure the base path is correctly set in `vite.config.ts`
- Clear your browser cache
- Check browser console for 404 errors

### Build fails

- Check the Actions tab for error messages
- Ensure all dependencies are in `package.json`
- Try running `npm run build` locally to test

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

