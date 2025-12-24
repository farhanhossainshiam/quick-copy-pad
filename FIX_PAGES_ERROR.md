# Fix "Resource not accessible by integration" Error

## The Problem

You're seeing this error:
```
Warning: Get Pages site failed
Error: Create Pages site failed
Error: HttpError: Resource not accessible by integration
```

This means the GitHub Actions workflow doesn't have permission to create/enable Pages automatically.

## Solution: Enable Pages Manually (Required)

**You MUST enable GitHub Pages manually in repository settings before the workflow can deploy.**

### Step-by-Step Fix:

1. **Go to your repository on GitHub**
   - URL: `https://github.com/YOUR_USERNAME/YOUR_REPO`

2. **Click on Settings** (top menu bar)

3. **Click on Pages** (left sidebar, under "Code and automation")

4. **Under "Build and deployment":**
   - **Source**: Select `GitHub Actions` (NOT "Deploy from a branch")
   - **Branch**: Leave empty (not needed when using GitHub Actions)

5. **Click Save**

6. **Wait 30-60 seconds** for GitHub to enable Pages

7. **Verify it's enabled:**
   - You should see a green checkmark or message like "Your site is ready to be published"
   - The source should show "GitHub Actions"

8. **Re-run the workflow:**
   - Go to **Actions** tab
   - Click on the failed workflow
   - Click **Re-run all jobs**

## Additional Checks

### 1. Check Repository Permissions

Go to: `Settings → Actions → General → Workflow permissions`

Make sure:
- ✅ **Read and write permissions** is selected (not "Read repository contents and packages permissions only")
- Click **Save** if you changed it

### 2. Check if Repository is Public

- **Public repositories**: GitHub Pages is free
- **Private repositories**: You need GitHub Pro ($4/month) or higher

If your repo is private:
- Make it public temporarily: `Settings → Scroll down → Danger Zone → Change visibility`
- Or upgrade to GitHub Pro

### 3. Check Organization Settings (if applicable)

If this is an organization repository:
- Organization admin needs to enable Pages in organization settings
- Go to: `Organization Settings → Pages`
- Enable Pages for the organization

## Updated Workflow

The workflow has been updated with:
- ✅ `contents: write` permission (was `read` only)
- ✅ Removed `enablement: true` (causes issues, must enable manually)

## After Enabling Pages

Once Pages is enabled:
1. Push a new commit, OR
2. Re-run the workflow from Actions tab

The workflow should now deploy successfully!

## Still Having Issues?

### Error persists after enabling Pages:

1. **Wait 2-3 minutes** - GitHub needs time to propagate settings
2. **Check Actions tab** - Look for any new error messages
3. **Verify Pages is enabled** - Go back to Settings → Pages and confirm
4. **Try pushing a new commit** - This triggers a fresh workflow run

### "Pages build failed":

- Check the build step in Actions tab
- Look for build errors (usually in the "Build" job)
- Make sure `npm run build` works locally

### Site shows 404:

- Check the base path in `vite.config.ts` matches your repository name
- Wait 5-10 minutes for DNS propagation
- Clear browser cache

## Quick Checklist

Before running the workflow, ensure:
- [ ] Pages is enabled in Settings → Pages → Source: "GitHub Actions"
- [ ] Repository is public (or you have GitHub Pro)
- [ ] Workflow permissions allow "Read and write permissions"
- [ ] You're the repository owner or have admin access
- [ ] You've waited 30-60 seconds after enabling Pages

---

**Once Pages is enabled manually, the workflow will work automatically on every push!**

