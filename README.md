# HADITHI AHLIA - Payment Receipt App

## Deployment (GitHub Pages)

### Step 1: Create a GitHub repo

1. Go to [github.com/new](https://github.com/new)
2. Name it `PaymentPri` (or anything you like)
3. Keep it **Public** (required for free GitHub Pages)
4. **Don't** add README or .gitignore (we already have them)
5. Click "Create repository"

### Step 2: Push your code (copy the commands GitHub shows you, it'll look like):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under "Source", select **Deploy from a branch**
3. Branch: `main`, Folder: `/docs`
4. Click **Save**

### Step 4: Share the link

After ~1 minute, your app will be live at:
`https://YOUR_USERNAME.github.io/PaymentPri/`

Share that URL with anyone — they just open it in their phone browser, no install needed!

### For future updates, just run:

```powershell
npm run deploy
git add docs
git commit -m "Update app"
git push
```
