import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

// 🔑 Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// 🌍 Initialize map (world map centered on India)
const map = L.map("map").setView([20.5937, 78.9629], 5); // India center
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

// 📡 Listen for reports in Firestore
const reportsCol = collection(db, "reports");
onSnapshot(reportsCol, (snapshot) => {
  const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderReports(reports);
  updateDashboard(reports);
});

// 🗺️ Render markers
function renderReports(reports) {
  map.eachLayer((layer) => {
    if (layer instanceof L.CircleMarker) map.removeLayer(layer);
  });
  reports.forEach((report) => {
    const color = report.severity === "Low" ? "green" :
                  report.severity === "Medium" ? "orange" : "red";
    const marker = L.circleMarker([report.lat, report.lng], { color, radius: 8 }).addTo(map);
    marker.bindPopup(`
      <b>${report.severity} Waste</b><br/>
      Status: ${report.status}<br/>
      <button onclick="claimReport('${report.id}')">Claim Cleanup</button>
    `);
  });
}

// 📊 Dashboard counts
function updateDashboard(reports) {
  document.getElementById("total").innerText = "Total Reported: " + reports.length;
  document.getElementById("inProgress").innerText = "In Progress: " + reports.filter(r => r.status === "In Progress").length;
  document.getElementById("cleaned").innerText = "Cleaned: " + reports.filter(r => r.status === "Cleaned").length;
}

// 🙋 Claim report
window.claimReport = async function(id) {
  const reportRef = doc(db, "reports", id);
  await updateDoc(reportRef, { status: "In Progress" });
};

// 📝 Report form submit
document.getElementById("reportForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const severity = document.getElementById("severity").value;
  const photo = document.getElementById("photo").files[0];

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;
    let photoURL = "";
    if (photo) {
      const photoRef = ref(storage, "photos/" + photo.name);
      await uploadBytes(photoRef, photo);
      photoURL = await getDownloadURL(photoRef);
    }
    await addDoc(reportsCol, {
      lat: latitude,
      lng: longitude,
      severity,
      status: "Reported",
      photoURL
    });
  });
});
