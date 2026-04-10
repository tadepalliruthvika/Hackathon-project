import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { seedDummyData } from "./seedData";
import MapComponent from "./MapComponent";
import Sidebar from "./Sidebar";
import ReportForm from "./ReportForm";

export default function App() {
  const [reports, setReports] = useState([]);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [flyTarget, setFlyTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([13.0827, 80.2707]);

  useEffect(() => {
    seedDummyData();
  }, []);

  // Ask for location permission immediately on load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter([latitude, longitude]);
          showToast("📍 Location found! Map centered on your location.", "success");
        },
        (error) => {
          showToast("Location denied. Using Chennai as default.", "error");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reports"), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setReports(data);
    });
    return () => unsub();
  }, []);

  const handleMapClick = (latlng) => {
    setClickedLocation({ lat: latlng.lat, lng: latlng.lng });
    setShowForm(true);
  };

  const handleUseMyLocation = () => {
    if (userLocation) {
      setClickedLocation(userLocation);
      setFlyTarget(userLocation);
      setTimeout(() => setFlyTarget(null), 1500);
      setShowForm(true);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          setClickedLocation(loc);
          setFlyTarget(loc);
          setTimeout(() => setFlyTarget(null), 1500);
          setShowForm(true);
        },
        () => showToast("Could not get your location. Please click on the map instead.", "error"),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const handleSubmit = async ({ title, severity, image, address }) => {
    if (!clickedLocation) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, "reports"), {
        title,
        lat: clickedLocation.lat,
        lng: clickedLocation.lng,
        severity,
        status: "Reported",
        image: image || "",
        address: address || "",
        createdAt: new Date().toISOString()
      });
      showToast("✅ Report submitted successfully!", "success");
    } catch (err) {
      showToast("Error submitting report. Check Firebase config.", "error");
      console.error(err);
    }
    setSubmitting(false);
    setShowForm(false);
    setClickedLocation(null);
  };

  const handleClaim = async (id, currentStatus) => {
    const next = currentStatus === "Reported" ? "In Progress" : "Cleaned";
    try {
      await updateDoc(doc(db, "reports", id), { status: next });
      showToast(
        next === "In Progress" ? "🙋 Claimed! Status: In Progress" : "✅ Marked as Cleaned!",
        "success"
      );
    } catch (err) {
      showToast("Failed to update status.", "error");
    }
  };

  const handleSelectReport = (report) => {
    setFlyTarget({ lat: report.lat, lng: report.lng });
    setTimeout(() => setFlyTarget(null), 1500);
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", fontFamily: "sans-serif" }}>
      <div style={{ flex: 1, position: "relative" }}>

        {/* Top hint bar */}
        <div style={{
          position: "absolute",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          background: "rgba(255,255,255,0.95)",
          padding: "8px 18px",
          borderRadius: 20,
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          fontSize: 13,
          color: "#555",
          pointerEvents: "none",
          whiteSpace: "nowrap"
        }}>
          🗺️ Click anywhere on the map to report a waste spot
        </div>

        {/* Use My Location button */}
        <button
          onClick={handleUseMyLocation}
          style={{
            position: "absolute",
            bottom: 36,
            left: 16,
            zIndex: 1000,
            background: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: 24,
            padding: "11px 20px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 3px 14px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: 7
          }}
        >
          📍 Report at My Location
        </button>

        <MapComponent
          reports={reports}
          onMapClick={handleMapClick}
          clickedLocation={clickedLocation}
          flyTarget={flyTarget}
          onClaim={handleClaim}
          userLocation={userLocation}
          mapCenter={mapCenter}
        />
      </div>

      <Sidebar reports={reports} onSelectReport={handleSelectReport} />

      {showForm && clickedLocation && (
        <ReportForm
          location={clickedLocation}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setClickedLocation(null); }}
          loading={submitting}
        />
      )}

      {toast && (
        <div style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          background: toast.type === "success" ? "#27ae60" : "#e74c3c",
          color: "white",
          padding: "12px 28px",
          borderRadius: 24,
          fontSize: 14,
          fontWeight: 600,
          zIndex: 99999,
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)"
        }}>
          {toast.message}
        </div>
      )}

      <style>{`
        body { margin: 0; padding: 0; }
        .leaflet-container { cursor: crosshair !important; }
      `}</style>
    </div>
  );
}
