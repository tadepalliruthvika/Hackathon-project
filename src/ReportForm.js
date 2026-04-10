import React, { useState, useEffect } from "react";

const suggestSeverityFromImage = (fileName) => {
  const name = fileName.toLowerCase();
  if (name.includes("fire") || name.includes("burn") || name.includes("chemical") || name.includes("hazard")) return "High";
  if (name.includes("dump") || name.includes("garbage") || name.includes("trash") || name.includes("waste")) return "Medium";
  return null;
};

const getAddressFromCoords = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    return data.display_name || "";
  } catch {
    return "";
  }
};

export default function ReportForm({ location, onSubmit, onCancel, loading }) {
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [imageBase64, setImageBase64] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [address, setAddress] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [severityFromAI, setSeverityFromAI] = useState(null);

  useEffect(() => {
    setLoadingAddress(true);
    getAddressFromCoords(location.lat, location.lng).then((addr) => {
      setAddress(addr);
      if (addr) {
        const short = addr.split(",").slice(0, 3).join(", ");
        setTitle("Waste reported near " + short);
      }
      setLoadingAddress(false);
    });
  }, [location]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Try to suggest severity from filename
    const suggested = suggestSeverityFromImage(file.name);
    if (suggested) {
      setSeverity(suggested);
      setSeverityFromAI(suggested);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Compress image before storing
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 600;
        let w = img.width, h = img.height;
        if (w > MAX) { h = (h * MAX) / w; w = MAX; }
        if (h > MAX) { w = (w * MAX) / h; h = MAX; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL("image/jpeg", 0.7);
        setImageBase64(compressed);
        setImagePreview(compressed);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), severity, image: imageBase64, address });
  };

  const severityColors = { Low: "#27ae60", Medium: "#f39c12", High: "#e74c3c" };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: 16
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 28,
        width: "100%", maxWidth: 440,
        boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
        fontFamily: "sans-serif",
        maxHeight: "90vh", overflowY: "auto"
      }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "#2c3e50" }}>
          🗑️ Report a Waste Spot
        </h3>

        {/* Location info */}
        <div style={{
          background: "#f0f8ff", borderRadius: 8, padding: "10px 12px",
          marginBottom: 18, border: "1px solid #d0e8f5"
        }}>
          {loadingAddress ? (
            <p style={{ margin: 0, fontSize: 12, color: "#888" }}>📍 Getting address...</p>
          ) : (
            <>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#888", fontWeight: 600 }}>LOCATION DETECTED</p>
              <p style={{ margin: 0, fontSize: 12, color: "#2c3e50", lineHeight: 1.4 }}>
                📍 {address ? address.split(",").slice(0, 4).join(", ") : `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#aaa" }}>
                {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
              </p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Describe the waste issue..."
              required
              style={{
                width: "100%", padding: "10px 12px",
                border: "1.5px solid #ddd", borderRadius: 8,
                fontSize: 14, outline: "none",
                boxSizing: "border-box", fontFamily: "sans-serif"
              }}
              onFocus={(e) => { e.target.style.borderColor = "#3498db"; }}
              onBlur={(e) => { e.target.style.borderColor = "#ddd"; }}
            />
          </div>

          {/* Photo Upload */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>
              📷 Upload Photo (optional)
            </label>
            <div style={{
              border: "2px dashed #ddd", borderRadius: 10, padding: 14,
              textAlign: "center", background: "#fafafa"
            }}>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                id="photo-input"
                style={{ display: "none" }}
              />
              <label htmlFor="photo-input" style={{
                cursor: "pointer", fontSize: 13, color: "#3498db", fontWeight: 600
              }}>
                📸 Take Photo or Choose from Gallery
              </label>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "#aaa" }}>
                Tap to open camera or select image
              </p>
            </div>

            {imagePreview && (
              <div style={{ marginTop: 10, position: "relative" }}>
                <img
                  src={imagePreview}
                  alt="preview"
                  style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }}
                />
                <button
                  type="button"
                  onClick={() => { setImageBase64(""); setImagePreview(""); setSeverityFromAI(null); }}
                  style={{
                    position: "absolute", top: 6, right: 6,
                    background: "rgba(0,0,0,0.6)", color: "white",
                    border: "none", borderRadius: "50%",
                    width: 24, height: 24, cursor: "pointer", fontSize: 12
                  }}
                >✕</button>
              </div>
            )}
          </div>

          {/* Severity */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>
              Severity
              {severityFromAI && (
                <span style={{
                  marginLeft: 8, fontSize: 11, fontWeight: 600,
                  background: "#fff3cd", color: "#856404",
                  padding: "2px 8px", borderRadius: 10
                }}>
                  🤖 AI suggested: {severityFromAI}
                </span>
              )}
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {["Low", "Medium", "High"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  style={{
                    flex: 1, padding: "10px 6px",
                    background: severity === s ? severityColors[s] : "#f5f5f5",
                    color: severity === s ? "white" : "#555",
                    border: `2px solid ${severity === s ? severityColors[s] : "#e0e0e0"}`,
                    borderRadius: 8, cursor: "pointer",
                    fontWeight: 700, fontSize: 13, transition: "all 0.15s"
                  }}
                >
                  {s === "Low" ? "🟢" : s === "Medium" ? "🟡" : "🔴"} {s}
                </button>
              ))}
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 11, color: "#aaa" }}>
              {severity === "Low" && "Minor littering — not urgent"}
              {severity === "Medium" && "Significant dump — needs attention"}
              {severity === "High" && "Hazardous / Urgent — immediate cleanup needed"}
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1, padding: "11px",
                background: "#f5f5f5", color: "#444",
                border: "none", borderRadius: 8,
                fontSize: 14, fontWeight: 600, cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || loadingAddress}
              style={{
                flex: 2, padding: "11px",
                background: loading ? "#aaa" : "#e74c3c",
                color: "white", border: "none", borderRadius: 8,
                fontSize: 14, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Saving..." : "🚨 Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
