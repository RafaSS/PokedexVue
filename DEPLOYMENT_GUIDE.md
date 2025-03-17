# PokedexVue Deployment Guide

This guide will walk you through the process of deploying your PokedexVue application to Vercel.

## Preparing Your Project for Deployment

1. **Fix the MIME Type Issue**

   The error you encountered: 
   `"https://pokedex-vue-git-main-rafael-silvas-projects-54808731.vercel.app/src/main.ts" was blocked due to a disallowed MIME type ("video/mp2t")`
   
   This error occurs because the browser was trying to load TypeScript files directly, rather than the compiled JavaScript files. 
   
   We've fixed this by:
   - Creating a `vercel.json` configuration file to handle routing
   - Fixing the path reference in the main `index.html` file
   
2. **Ensure Proper Build Configuration**

   Your `vite.config.ts` is correctly configured with:
   ```typescript
   build: {
     outDir: 'dist',
   }
   ```
   
   And your `package.json` has the correct build script:
   ```json
   "scripts": {
     "build": "vite build"
   }
   ```

## Deployment Steps

### 1. Prepare Your Code

Make sure your repository is up to date:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 2. Deploy to Vercel

#### Option 1: Using the Vercel Dashboard

1. Sign up or log in to [Vercel](https://vercel.com/)
2. Click "Import Project" or "New Project"
3. Connect your GitHub account if you haven't already
4. Select your PokedexVue repository
5. Configure the project with these settings:
   - **Framework Preset**: Vue.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Add any environment variables from your `.env` file
7. Click "Deploy"

#### Option 2: Using the Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

4. Follow the prompts to configure your project:
   - Link to an existing project? Select "No" for a new deployment
   - Set up project settings when prompted
   - Confirm environment variables

### 3. Verify Your Deployment

1. Once deployed, Vercel will provide you with a deployment URL
2. Visit the URL to verify your application is working correctly
3. Check the console for any errors
4. Test all functionality, especially the features that interact with Supabase

### 4. Custom Domain (Optional)

1. In the Vercel dashboard, go to your project settings
2. Navigate to the "Domains" section
3. Add your custom domain and follow the DNS configuration instructions

## Troubleshooting Common Issues

### MIME Type Errors

If you encounter MIME type errors:
- Ensure your `vercel.json` file is correctly configured with the rewrites
- Check that all asset references in your code use the correct paths

### Environment Variables

If your app can't connect to Supabase or other services:
- Verify that all required environment variables are set in the Vercel dashboard
- Check that environment variables are being used correctly in your code

### Build Failures

If your build fails:
- Check the build logs for specific errors
- Ensure your `package.json` has all the necessary dependencies
- Verify that your `vite.config.ts` is properly configured

## Continuous Deployment

Vercel automatically sets up continuous deployment from your GitHub repository. Every time you push changes to your main branch, Vercel will automatically deploy the updated version of your application.

To preview changes before deploying to production:
1. Create a pull request in GitHub
2. Vercel will create a preview deployment for the pull request
3. Review the preview deployment before merging the changes

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vue.js Deployment Guide](https://vuejs.org/guide/scaling-up/ssr.html)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
