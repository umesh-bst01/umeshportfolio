# 3D Holographic Portfolio 🏍️✨

A high-end, immersive personal portfolio website featuring a **holographic interactive 3D bike**, glassmorphism UI, and smooth scroll animations. Built for performance and aesthetics.

## 🌟 Key Features
- **3D Interactive Core**: A rotating, floating holographic Apache bike model powered by Three.js.
  - **Holographic Effect**: Transparent wireframe aesthetic with pulsing neon glow.
  - **Interaction**: Bike tilts and follows mouse movement.
  - **Easter Eggs**: Clickable interactions with tech-themed messages.
- **Modern UI Design**:
  - **Glassmorphism**: Frosted glass effects on cards and navigation.
  - **Responsive**: Fully optimized for mobile and desktop.
  - **Space Theme**: Dynamic starfield background with deep space atmosphere.
- **Performance Optimized**: 
  - 3D model loads via CDN to bypass hosting limits.
  - Smooth 60fps animations using GSAP ScrollTrigger.

## 🛠️ Technologies
- **Frontend**: HTML5, CSS3 (Variables & Flexbox/Grid)
- **3D Engine**: [Three.js](https://threejs.org/)
- **Animations**: [GSAP](https://greensock.com/gsap/) (GreenSock)
- **Model Format**: GLTF/GLB

## 🚀 How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/not-umesh/uvportfolio111.git
   cd uvportfolio111
   ```

2. **Start a local server** (Required for 3D model loading due to CORS)
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # OR with Node.js http-server
   npx http-server
   ```

3. **Open in Browser**
   - Go to `http://localhost:8000`

---

## 🌐 Deployment Instructions (InfinityFree)

This project is optimized for deployment on free hosting services like InfinityFree.

### **Important Note on File Size**
The 3D model (`apache-bike-model.glb`) is hosted on this GitHub repository and loaded via **High-Performance GitHub Raw CDN**. You **DO NOT** need to upload the heavy GLB file to your hosting provider.

### **Step-by-Step Deployment**

1. **Log in** to your [InfinityFree File Manager](https://app.infinityfree.com/).
2. Open the **`htdocs`** folder.
3. **Delete** any default files (like `index2.html`).
4. **Upload ONLY these 3 files**:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `UvPortfolioimg.jpeg` (Profile Photo)
   
   *(Do NOT upload the .glb file. The code handles it automatically from the cloud.)*

5. **Done!** Visit your website URL.

> **Troubleshooting:**
> - **Bike not showing?** Press `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac) to hard refresh your cache.
> - **Still incorrect?** Ensure you uploaded the *latest* version of `script.js` from this repo.

---

### © 2026 Umesh Verma
Built with ❤️ and code.
