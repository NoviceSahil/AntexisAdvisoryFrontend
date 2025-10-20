# API Configuration Guide

## Overview

This project uses a centralized API configuration to manage backend URLs and endpoints. This makes it easy to switch between development and production environments.

## Configuration Files

### 1. `.env` File (Root of frontend project)

```env
# Backend API Configuration
# For local development
REACT_APP_API_URL=http://localhost:5000

# For production, replace with your deployed backend URL
# REACT_APP_API_URL=https://your-production-backend.com
```

### 2. `src/config/api.js`

This file exports all API endpoints and configuration:

- `API_BASE_URL` - Base URL from environment variables
- `API_ENDPOINTS` - All API endpoints used in the application
- `API_CONFIG` - Default axios configuration
- `MULTIPART_CONFIG` - Configuration for file uploads

## How to Use

### Import in your components:

```javascript
import { API_ENDPOINTS } from "../../config/api";
import axios from "axios";

// Example usage:
const response = await axios.get(API_ENDPOINTS.BLOGS);
```

### Available Endpoints:

- `API_ENDPOINTS.APPLY` - Submit job application
- `API_ENDPOINTS.CONTACT` - Submit contact form
- `API_ENDPOINTS.BLOGS` - Get all blogs
- `API_ENDPOINTS.BLOG_BY_ID(id)` - Get blog by ID
- `API_ENDPOINTS.ADMIN_LOGIN` - Admin login
- `API_ENDPOINTS.BLOG_IMAGES` - Blog images path
- `API_ENDPOINTS.BLOG_DOCUMENTS` - Blog documents path

## Deployment Instructions

### For Development:

1. Keep `.env` with `REACT_APP_API_URL=http://localhost:5000`
2. Run your backend on port 5000
3. Run frontend with `npm start`

### For Production:

1. Update `.env` file:
   ```env
   REACT_APP_API_URL=https://your-backend-domain.com
   ```
2. Build the frontend:
   ```bash
   npm run build
   ```
3. Deploy the `build` folder to your hosting service

### Environment Variables on Hosting Platforms:

#### Vercel / Netlify:

Add environment variable in dashboard:

- Key: `REACT_APP_API_URL`
- Value: `https://your-backend-domain.com`

#### Heroku:

```bash
heroku config:set REACT_APP_API_URL=https://your-backend-domain.com
```

## Important Notes

1. **Always restart development server** after changing `.env` file
2. **Never commit `.env`** with production URLs to version control
3. **Use environment variables** for different environments (dev, staging, production)
4. **Test API connectivity** before deploying to production

## Troubleshooting

### API calls failing?

- Check `.env` file has correct URL
- Verify backend server is running
- Check browser console for CORS errors
- Ensure backend URL doesn't have trailing slash

### Changes not reflecting?

- Restart development server after `.env` changes
- Clear browser cache
- Check you're importing from `config/api.js` correctly

## Files Updated to Use This Configuration

✅ Home.js - Blog fetching
✅ Contact.js - Contact form submission
✅ ApplyOnline.js - Job application submission
✅ BlogPage.js - Blog detail page
⚠️ Admin components - Need manual update (see admin files)

## Security Best Practices

1. Create `.env.local` for local development
2. Add `.env.local` to `.gitignore`
3. Use different API URLs for different environments
4. Never expose API keys in frontend code
5. Use HTTPS in production
