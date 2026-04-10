# 🗺️ Waste Watcher — Real-Time Waste Reporting & Cleanup System

A full-stack hackathon project using React + Leaflet + Firebase Firestore.

---

## 📁 Project Structure

```
waste-report-app/
├── public/
│   └── index.html
├── src/
│   ├── App.js           # Root component, Firebase listener, layout
│   ├── MapComponent.js  # Leaflet map, markers, popups, claim button
│   ├── Sidebar.js       # Dashboard stats + report list
│   ├── ReportForm.js    # Modal form triggered by map click
│   ├── seedData.js      # Preloads 6 dummy reports on first load
│   ├── firebase.js      # Firebase config (YOU MUST FILL THIS IN)
│   └── index.js         # React entry point
├── package.json
├── vercel.json
└── README.md
```

---

## 🔥 Step 1: Firebase Setup

1. Go to https://console.firebase.google.com
2. Click **"Add project"** → name it (e.g., `waste-watcher`) → Create
3. In the left panel, click **Firestore Database** → **Create database**
   - Choose **"Start in test mode"** (for hackathon)
   - Select any region → **Enable**
4. In the left panel, click **Project Settings** (gear icon)
5. Scroll to **"Your apps"** → click **</>** (Web)
6. Register app (any nickname) → copy the `firebaseConfig` object
7. Open `src/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",               // ← paste yours
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

## 💻 Step 2: Installation

```bash
# 1. Create React App (skip if you already cloned this project)
npx create-react-app waste-report-app
cd waste-report-app

# 2. Copy all src/ files into the new project (replace defaults)

# 3. Install dependencies
npm install leaflet react-leaflet firebase
```

---

## ▶️ Step 3: Run Locally

```bash
npm start
```

App opens at: http://localhost:3000

---

## 🚀 Step 4: Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo at https://vercel.com/new

---

## ✅ Features Checklist

| Feature | Status |
|---|---|
| Real interactive Leaflet map (OpenStreetMap) | ✅ |
| Centered on Chennai, India | ✅ |
| 6 preloaded dummy reports | ✅ |
| Click map → capture lat/lng (no manual input) | ✅ |
| Report form: title, photo upload, severity | ✅ |
| Color-coded markers (Red/Orange/Green) | ✅ |
| Marker popup with details | ✅ |
| "Claim for Cleanup" button → updates status | ✅ |
| Real-time Firestore sync (onSnapshot) | ✅ |
| Dashboard: Total / In Progress / Cleaned counts | ✅ |
| Sidebar report list → click to fly to marker | ✅ |
| No manual lat/lng input fields | ✅ |
| Vercel deployment config | ✅ |

---

## 🎨 Color Legend

- 🔴 **Red marker** = High severity
- 🟠 **Orange marker** = Medium severity
- 🟢 **Green marker** = Low severity
- 🔵 **Blue pulsing dot** = Your clicked location (pending form)

---

## 📱 How It Works

1. App loads → seeds 6 dummy reports into Firestore (only if empty)
2. `onSnapshot` listener updates map in real-time
3. Click anywhere on map → blue dot appears + form opens
4. Fill form → submit → red/orange/green marker appears instantly
5. Click any marker → popup shows details + "Claim for Cleanup" button
6. Clicking claim changes status Reported → In Progress → Cleaned (live)
7. Sidebar and dashboard stats update automatically

---

## ⚠️ Notes

- Firebase is in **test mode** — no authentication required for hackathon
- Photo uploads stored as **base64** in Firestore (works without Cloud Storage)
- For large photos, consider resizing before encoding or using Firebase Storage
