# Deployment Guide

## PWA Icons

Before deploying, you need to add PWA icons:

1. Create two PNG icons:
   - `public/icon-192x192.png` (192x192 pixels)
   - `public/icon-512x512.png` (512x512 pixels)

2. You can use online tools like:
   - https://www.favicon-generator.org/
   - https://realfavicongenerator.net/

3. Recommended icon design:
   - Simple calendar icon with gradient (violet to pink)
   - Rounded corners for modern look
   - Clear visibility at small sizes

## Vercel Deployment

1. Push your code to GitHub

2. Go to https://vercel.com and sign in

3. Click "New Project"

4. Import your GitHub repository

5. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

6. Environment Variables (optional):
   - Add any custom environment variables if needed

7. Click "Deploy"

## After Deployment

1. Your app will be available at `https://your-project.vercel.app`

2. Test PWA features:
   - Install the app on mobile/desktop
   - Check app badge functionality
   - Verify offline capabilities

3. Custom Domain (optional):
   - Go to Project Settings > Domains
   - Add your custom domain

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Features

- Login/Signup with localStorage
- Monthly calendar view
- Add/Edit/Delete todos
- Max 3 todos per day (with "more" button)
- Floating add button
- App badge showing today's pending todos
- PWA support for installation
- Beautiful pastel gradient design
