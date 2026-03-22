# 🚀 StudentAI Tools - Production Deployment Guide

This guide explicitly walks through how to take your completely built, perfectly reliable StudentAI application live on **Vercel** (Frontend) and **Render** (Backend).

## 🛠️ Step 1: Push Code to GitHub
Both Vercel and Render require your project to be on GitHub.
1. Go to GitHub and create a new public or private repository (e.g., `studentai-tools`).
2. Open your terminal in the root folder of your project (where `frontend` and `backend` are located).
3. Run the following commands:
```bash
git init
git add .
git commit -m "Initial Production Release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/studentai-tools.git
git push -u origin main
```

## ⚙️ Step 2: Deploying the Backend (Render.com)

1. Sign up/Log in to [Render.com](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your `studentai-tools` repository.
4. **Configuration Details:**
   - **Name:** `studentai-backend`
   - **Root Directory:** `backend` (CRITICAL: You must type exactly `backend` here)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free
5. **Environment Variables**: Scroll down, click "Advanced", and add your environment variables EXACTLY as they are in your local `.env`:
   - `GEMINI_API_KEYS` 
   - `OPENROUTER_API_KEY` (if used)
   - `HUGGINGFACE_API_KEY` (if used)
6. Click **Create Web Service**. 
7. ⏳ Wait 2-3 minutes. Once it says "Live", copy your new Render Backend URL (e.g., `https://studentai-backend.onrender.com`).

---

## 🎨 Step 3: Deploying the Frontend (Vercel.com)

1. Sign up/Log in to [Vercel.com](https://vercel.com/).
2. Click **Add New Project** and import your `studentai-tools` GitHub repository.
3. **Configuration Details:**
   - **Framework Preset:** Vite
   - **Root Directory:** Edit this and type `frontend`. (CRITICAL)
4. **Environment Variables**: Open the Environment Variables tab and add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://studentai-backend.onrender.com` *(Paste the exact URL you got from Render in Step 2. Do NOT include a trailing slash).*
5. Click **Deploy**.
6. ⏳ Wait 1 minute. Vercel will process Vite, build the React framework, and provide you with a live domain (e.g., `https://studentai-tools.vercel.app`).

## 🎉 Congratulations
Your application is currently securely live on the cloud, scaling completely free, fully protected against limits via the Load Balancer, and beautifully polished for end-users!
