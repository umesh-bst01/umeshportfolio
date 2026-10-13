# Deploying to InfinityFree

This guide will help you upload your 3D Portfolio to InfinityFree.

## Prerequisites
1. An account on [InfinityFree](https://www.infinityfree.com/)
2. A created hosting account

## 🚨 IMPORTANT CHANGE
**You DO NOT need to upload the `apache-bike-model.glb` file anymore!**
The website is now configured to load the 3D model directly from the cloud (GitHub CDN). This fixes the "File too large" error.

## Step-by-Step Deployment

### 1. Prepare Your Files
You only need these 3 files:
- `index.html`
- `styles.css`
- `script.js`
- `UvPortfolioimg.jpeg` (Profile photo)

### 2. Access the File Manager
1. Login to the [InfinityFree Client Area](https://app.infinityfree.com/).
2. Click **"Manage"** next to your hosting account.
3. Click the **"File Manager"** button.

### 3. Upload Files
1. In `htdocs`, delete any default files.
2. **Upload ONLY these files**:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `UvPortfolioimg.jpeg`
   
   **⛔ DO NOT upload `apache-bike-model.glb` (It's too big, we load it from cloud now)**

### 4. Verify & Launch
1. Check your website link.
2. It should load perfectly with the 3D bike!
   *(Note: The first load might take a few seconds as it downloads the model)*

Enjoy your site! 🚀
