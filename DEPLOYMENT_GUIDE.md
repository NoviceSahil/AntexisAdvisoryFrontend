# Deployment Guide - Frontend Only

## Pushing to GitHub

### Step 1: Initialize Git (if not already done)

```powershell
cd ca-firm-frontend
git init
```

### Step 2: Add Remote Repository

```powershell
git remote add origin https://github.com/NoviceSahil/AntexisAdvisoryFrontend.git
```

### Step 3: Stage and Commit Files

```powershell
git add .
git commit -m "Initial commit: CA Firm Frontend"
```

### Step 4: Push to GitHub

```powershell
git branch -M main
git push -u origin main
```

## Backend API Configuration

### Local Development

Your `.env` file is already configured for local development:

```
REACT_APP_API_URL=http://localhost:5000
```

### Production Deployment

#### Option 1: Update .env before building

1. Open `.env` file
2. Replace with production backend URL:

```
REACT_APP_API_URL=https://your-backend-api.herokuapp.com
```

3. Build the project:

```powershell
npm run build
```

4. Deploy the `build` folder

#### Option 2: Use hosting platform environment variables (Recommended)

**For Vercel:**

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.com`
4. Redeploy

**For Netlify:**

1. Go to Site settings > Build & deploy > Environment
2. Add environment variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.com`
3. Trigger rebuild

**For Firebase Hosting:**

```powershell
# Build with production env
REACT_APP_API_URL=https://your-backend-url.com npm run build
firebase deploy
```

## Deployment Platforms

### Vercel (Recommended for React)

```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
cd ca-firm-frontend
vercel
```

### Netlify

```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod
```

### GitHub Pages

```powershell
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json:
# "homepage": "https://novicesahil.github.io/AntexisAdvisoryFrontend"
# "predeploy": "npm run build"
# "deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

## Environment Setup Checklist

- [ ] `.env` file created with correct API URL
- [ ] `.gitignore` includes `.env` files
- [ ] All API calls updated to use `config/api.js`
- [ ] Tested locally with backend running
- [ ] Built successfully (`npm run build`)
- [ ] Environment variables set in hosting platform
- [ ] CORS configured on backend for frontend domain
- [ ] HTTPS enabled in production

## Common Issues & Solutions

### Issue: API calls fail after deployment

**Solution:** Check environment variable is set correctly in hosting platform

### Issue: Images/documents not loading

**Solution:** Verify backend URL in `.env` doesn't have trailing slash

### Issue: Build fails

**Solution:** Ensure all dependencies are in `package.json`, run `npm install`

### Issue: Changes not reflecting

**Solution:** Clear cache, ensure environment variable is updated, redeploy

## Post-Deployment Verification

1. Check all pages load correctly
2. Test form submissions (Contact, Apply Online)
3. Verify blog images and documents load
4. Test admin login and dashboard
5. Check mobile responsiveness
6. Verify all API calls work

## Backend URL Examples

**Development:** `http://localhost:5000`
**Heroku:** `https://your-app-name.herokuapp.com`
**Railway:** `https://your-app.railway.app`
**Render:** `https://your-app.onrender.com`
**AWS:** `https://api.yourdomain.com`
**Custom Domain:** `https://api.antexisadvisory.com`

## Need Help?

Refer to `API_CONFIGURATION.md` for detailed API setup instructions.
