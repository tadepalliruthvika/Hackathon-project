import React, { useState, useEffect } from "react";

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

export default function ReportForm({ location, onSubmit, onCancel, loading, t }) {
  const [title, setTitle] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [address, setAddress] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(true);

  // ── severity is always "Medium" — no dropdown ──
  const severity = "Medium";

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
          {t.reportTitle}
        </h3>

        {/* Location info */}
        <div style={{
          background: "#f0f8ff", borderRadius: 8, padding: "10px 12px",
          marginBottom: 18, border: "1px solid #d0e8f5"
        }}>
          {loadingAddress ? (
            <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{t.gettingAddress}</p>
          ) : (
            <>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#888", fontWeight: 600 }}>{t.locationDetected}</p>
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
              {t.titleLabel}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.titlePlaceholder}
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
              {t.photoLabel}
            </label>
            <div style={{
              border: "2px dashed #ddd", borderRadius: 10, padding: 14,
              textAlign: "center", background: "#fafafa"
            }}>
              <input
                type="file" accept="image/*" capture="environment"
                onChange={handleImageChange}
                id="photo-input"
                style={{ display: "none" }}
              />
              <label htmlFor="photo-input" style={{ cursor: "pointer", fontSize: 13, color: "#3498db", fontWeight: 600 }}>
                {t.photoBtn}
              </label>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "#aaa" }}>{t.photoHint}</p>
            </div>

            {imagePreview && (
              <div style={{ marginTop: 10, position: "relative" }}>
                <img
                  src={imagePreview} alt="preview"
                  style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }}
                />
                <button
                  type="button"
                  onClick={() => { setImageBase64(""); setImagePreview(""); }}
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

          {/* ── Severity: auto Medium, just display it ── */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>
              {t.severityLabel}
            </label>
            <div style={{
              background: "#fff3cd", border: "1.5px solid #f39c12",
              borderRadius: 8, padding: "10px 14px",
              display: "flex", alignItems: "center", gap: 8
            }}>
              <span style={{ fontSize: 16 }}>🟡</span>
              <span style={{ fontWeight: 700, color: "#856404", fontSize: 14 }}>Medium</span>
              <span style={{ fontSize: 12, color: "#a07800", marginLeft: 4 }}>— {t.severityHintMedium}</span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button" onClick={onCancel}
              style={{
                flex: 1, padding: "11px",
                background: "#f5f5f5", color: "#444",
                border: "none", borderRadius: 8,
                fontSize: 14, fontWeight: 600, cursor: "pointer"
              }}
            >{t.cancelBtn}</button>
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
            >{loading ? t.saving : t.submitBtn}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
