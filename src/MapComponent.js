import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const getSeverityColor = (severity) => {
  if (severity === "High") return "#e74c3c";
  if (severity === "Medium") return "#f39c12";
  return "#27ae60";
};

const getStatusColor = (status) => {
  if (status === "Cleaned") return "#27ae60";
  if (status === "In Progress") return "#f39c12";
  if (status === "Pending Proof") return "#9b59b6";
  return "#95a5a6";
};

const createColorMarker = (severity, status) => {
  const color = status === "Cleaned" ? "#27ae60"
    : status === "Pending Proof" ? "#9b59b6"
    : getSeverityColor(severity);
  return L.divIcon({
    className: "",
    html: `<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>`,
    iconSize: [22, 22], iconAnchor: [11, 22], popupAnchor: [0, -24]
  });
};

const createUserMarker = () => L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#3498db;border:3px solid white;box-shadow:0 0 0 3px rgba(52,152,219,0.4);"></div>`,
  iconSize: [18, 18], iconAnchor: [9, 9]
});

const createClickedMarker = () => L.divIcon({
  className: "",
  html: `<div style="width:22px;height:22px;border-radius:50%;background:#9b59b6;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
  iconSize: [22, 22], iconAnchor: [11, 11]
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click(e) { onMapClick(e.latlng); } });
  return null;
}

function FlyToMarker({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 16, { duration: 1.2 });
  }, [target, map]);
  return null;
}

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 14);
  }, [center, map]);
  return null;
}

// ── Compresses image before storing ──
function compressImage(file, cb) {
  const reader = new FileReader();
  reader.onloadend = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX = 600;
      let w = img.width, h = img.height;
      if (w > MAX) { h = (h * MAX) / w; w = MAX; }
      if (h > MAX) { w = (w * MAX) / h; h = MAX; }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      cb(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

// ── Individual report marker with its own local state ──
function ReportMarker({ report, onClaim, t }) {
  const [volName, setVolName] = useState(report.volunteerName || "");
  const [afterB64, setAfterB64] = useState("");
  const [afterPreview, setAfterPreview] = useState("");

  const handleAfterUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    compressImage(file, (b64) => { setAfterB64(b64); setAfterPreview(b64); });
  };

  const statusColor = getStatusColor(report.status);
  const canAct = report.status !== "Cleaned";

  return (
    <Marker
      position={[report.lat, report.lng]}
      icon={createColorMarker(report.severity, report.status)}
    >
      <Popup minWidth={230} maxWidth={290}>
        <div style={{ fontFamily: "sans-serif", fontSize: 13 }}>

          {/* Status + severity badges */}
          <div style={{ display: "flex", gap: 5, marginBottom: 7, flexWrap: "wrap" }}>
            <span style={{ background: getSeverityColor(report.severity), color: "white", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
              {report.severity}
            </span>
            <span style={{ background: statusColor, color: "white", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
              {report.status}
            </span>
          </div>

          <p style={{ fontWeight: 700, margin: "0 0 3px", fontSize: 14 }}>{report.title}</p>

          {report.address && (
            <p style={{ color: "#666", fontSize: 12, margin: "0 0 5px" }}>📍 {report.address}</p>
          )}

          {/* Volunteer name + score */}
          {report.volunteerName && (
            <p style={{ color: "#555", fontSize: 12, margin: "0 0 6px" }}>
              👤 {t.volunteerLabel}: <strong>{report.volunteerName}</strong>
            </p>
          )}

          {/* ── Before / After images ── */}
          {(report.beforeImage || report.image || report.afterImage) && (
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {(report.beforeImage || report.image) && (
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 3px", fontSize: 10, color: "#888", fontWeight: 700, textTransform: "uppercase" }}>{t.before}</p>
                  <img
                    src={report.beforeImage || report.image}
                    alt="before"
                    style={{ width: "100%", borderRadius: 6, maxHeight: 80, objectFit: "cover", border: "1px solid #eee" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 3px", fontSize: 10, color: "#888", fontWeight: 700, textTransform: "uppercase" }}>{t.after}</p>
                {report.afterImage ? (
                  <img
                    src={report.afterImage}
                    alt="after"
                    style={{ width: "100%", borderRadius: 6, maxHeight: 80, objectFit: "cover", border: "1px solid #eee" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div style={{ height: 80, background: "#f5f5f5", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontSize: 10, color: "#bbb", textAlign: "center", margin: 0, padding: "0 4px" }}>{t.noAfterYet}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <p style={{ color: "#aaa", fontSize: 11, margin: "0 0 8px" }}>
            {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
          </p>

          {/* ── Cleaned state ── */}
          {!canAct && (
            <p style={{ color: "#27ae60", fontWeight: 700, textAlign: "center", margin: 0 }}>
              {t.areaCleanedMsg}
            </p>
          )}

          {/* ── Claim (Reported) ── */}
          {report.status === "Reported" && (
            <>
              <input
                type="text"
                placeholder={t.enterName}
                value={volName}
                onChange={(e) => setVolName(e.target.value)}
                style={{ width: "100%", padding: "7px 10px", marginBottom: 7, border: "1.5px solid #ddd", borderRadius: 7, fontSize: 13, boxSizing: "border-box" }}
              />
              <button
                onClick={() => onClaim(report.id, report.status, volName, null)}
                style={{ width: "100%", padding: "8px", background: "#e74c3c", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 13 }}
              >{t.claimBtn}</button>
            </>
          )}

          {/* ── Mark Cleaned / Submit Proof (In Progress or Pending Proof) ── */}
          {(report.status === "In Progress" || report.status === "Pending Proof") && (
            <>
              <input
                type="text"
                placeholder={t.enterName}
                value={volName}
                onChange={(e) => setVolName(e.target.value)}
                style={{ width: "100%", padding: "7px 10px", marginBottom: 7, border: "1.5px solid #ddd", borderRadius: 7, fontSize: 13, boxSizing: "border-box" }}
              />

              {/* After photo upload */}
              <div style={{ border: "2px dashed #ddd", borderRadius: 8, padding: "8px", textAlign: "center", background: "#fafafa", marginBottom: 6 }}>
                <input
                  type="file" accept="image/*" capture="environment"
                  onChange={handleAfterUpload}
                  id={`after-${report.id}`}
                  style={{ display: "none" }}
                />
                <label htmlFor={`after-${report.id}`} style={{ cursor: "pointer", fontSize: 12, color: "#3498db", fontWeight: 600 }}>
                  {t.uploadAfter}
                </label>
              </div>

              {afterPreview && (
                <img src={afterPreview} alt="after preview"
                  style={{ width: "100%", borderRadius: 6, maxHeight: 80, objectFit: "cover", marginBottom: 6 }}
                />
              )}

              {!afterB64 && (
                <p style={{ fontSize: 11, color: "#e74c3c", margin: "0 0 6px", textAlign: "center" }}>
                  {t.afterRequired}
                </p>
              )}

              <button
                onClick={() => onClaim(report.id, report.status, volName, afterB64)}
                style={{
                  width: "100%", padding: "8px",
                  background: afterB64 ? "#27ae60" : "#bdc3c7",
                  color: "white", border: "none", borderRadius: 6,
                  cursor: afterB64 ? "pointer" : "not-allowed",
                  fontWeight: 700, fontSize: 13
                }}
              >
                {report.status === "Pending Proof" ? t.submitProofBtn : t.markCleanedBtn}
              </button>
            </>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export default function MapComponent({ reports, onMapClick, clickedLocation, flyTarget, onClaim, userLocation, mapCenter, t }) {
  return (
    <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onMapClick={onMapClick} />
      <FlyToMarker target={flyTarget} />
      <RecenterMap center={mapCenter} />

      {userLocation && (
        <>
          <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserMarker()}>
            <Popup>
              <div style={{ fontFamily: "sans-serif", fontSize: 13 }}>
                <strong>{t.yourLocation}</strong><br />
                {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
              </div>
            </Popup>
          </Marker>
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={200}
            pathOptions={{ color: "#3498db", fillColor: "#3498db", fillOpacity: 0.08, weight: 1 }}
          />
        </>
      )}

      {clickedLocation && (
        <Marker position={[clickedLocation.lat, clickedLocation.lng]} icon={createClickedMarker()} />
      )}

      {reports.map((report) => (
        <ReportMarker key={report.id} report={report} onClaim={onClaim} t={t} />
      ))}
    </MapContainer>
  );
}
