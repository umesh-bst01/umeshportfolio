# 🚀 Deployment Guide for InfinityFree

This guide shows you how to deploy your portfolio to **uvportfolio11.gamer.gd**

## Option 1: Via InfinityFree File Manager (Recommended)

1. **Login to InfinityFree** at [infinityfree.com](https://infinityfree.com)

2. **Go to Control Panel** → Click "File Manager"

3. **Navigate to htdocs folder**
   - This is where your website files go
   - Delete any default files if present

4. **Upload your files:**
   - Click "Upload" button
   - Upload these files from your UVPortfolio folder:
     - `index.html`
     - `styles.css`
     - `script.js`
     - `UvPortfolioimg.jpeg`
   - Also upload the `assets` folder (even if empty)

5. **Wait 5-10 minutes** for propagation

6. **Visit your site:** http://uvportfolio11.gamer.gd

---

## Option 2: Via FTP Client (FileZilla)

1. **Download FileZilla** from [filezilla-project.org](https://filezilla-project.org)

2. **Get FTP credentials** from InfinityFree control panel:
   - Go to "FTP Accounts"
   - Note down: Host, Username, Password

3. **Connect in FileZilla:**
   - Host: (your FTP host from control panel)
   - Username: (your FTP username)
   - Password: (your FTP password)
   - Port: 21

4. **Navigate to htdocs** folder on the remote side

5. **Upload all files** from your local UVPortfolio folder

---

## Files to Upload

```
UVPortfolio/
├── index.html          ← Main portfolio page
├── styles.css          ← Space theme styling
├── script.js           ← Animations & effects
├── UvPortfolioimg.jpeg ← Your profile photo
└── assets/             ← Assets folder
    ├── icons/
    └── projects/
```

---

## ⚠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Site shows "File not found" | Make sure `index.html` is in htdocs root, not a subfolder |
| Images not loading | Check image filename matches exactly (case-sensitive on Linux) |
| CSS/JS not working | Clear browser cache (Ctrl+Shift+R) |
| Site not accessible | Wait 10-15 minutes for DNS propagation |

---

## 🎉 Your Portfolio Features

- ✅ Animated star field background
- ✅ Typing effect on hero section
- ✅ Smooth scroll navigation
- ✅ Glassmorphism design effects
- ✅ Project showcase with hover animations
- ✅ Fully responsive (mobile-friendly)
- ✅ Easter egg: Try the Konami code! (↑↑↓↓←→←→BA)

---

**Made with ❤️ by Umesh Verma**
