import React from "react";

const getSeverityColor = (severity) => {
  if (severity === "High") return "#e74c3c";
  if (severity === "Medium") return "#f39c12";
  return "#27ae60";
};

const getStatusColor = (status) => {
  if (status === "Cleaned") return "#27ae60";
  if (status === "In Progress") return "#f39c12";
  return "#95a5a6";
};

export default function Sidebar({ reports, onSelectReport }) {
  const total = reports.length;
  const inProgress = reports.filter((r) => r.status === "In Progress").length;
  const cleaned = reports.filter((r) => r.status === "Cleaned").length;
  const reported = reports.filter((r) => r.status === "Reported").length;

  return (
    <div style={{
      width: 300,
      minWidth: 300,
      height: "100%",
      background: "#fff",
      borderLeft: "1px solid #e0e0e0",
      display: "flex",
      flexDirection: "column",
      fontFamily: "sans-serif",
      overflow: "hidden"
    }}>
      <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 22 }}>♻️</span>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#2c3e50" }}>
              Waste Watcher
            </h2>
            <p style={{ margin: 0, fontSize: 12, color: "#888" }}>Chennai Cleanup Network</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ background: "#f8f9fa", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase" }}>Total</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#2c3e50" }}>{total}</p>
          </div>
          <div style={{ background: "#fef9ec", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#c0842e", fontWeight: 600, textTransform: "uppercase" }}>In Progress</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#e67e22" }}>{inProgress}</p>
          </div>
          <div style={{ background: "#eafaf1", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#1d8348", fontWeight: 600, textTransform: "uppercase" }}>Cleaned</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#27ae60" }}>{cleaned}</p>
          </div>
          <div style={{ background: "#fdf2f8", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#884ea0", fontWeight: 600, textTransform: "uppercase" }}>Reported</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#8e44ad" }}>{reported}</p>
          </div>
        </div>
      </div>

      <div style={{ padding: "10px 16px 6px", borderBottom: "1px solid #f0f0f0" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>
          Reports
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {reports.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa", fontSize: 13, padding: 24 }}>
            No reports yet. Click the map to add one!
          </p>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              onClick={() => onSelectReport(report)}
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid #f5f5f5",
                cursor: "pointer",
                transition: "background 0.15s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f8f9fa"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#2c3e50", flex: 1, marginRight: 8, lineHeight: 1.3 }}>
                  {report.title}
                </p>
                <span style={{
                  background: getSeverityColor(report.severity),
                  color: "white",
                  padding: "1px 6px",
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  flexShrink: 0
                }}>{report.severity}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: getStatusColor(report.status),
                  flexShrink: 0,
                  display: "inline-block"
                }}></span>
                <span style={{ fontSize: 11, color: "#888" }}>{report.status}</span>
                <span style={{ fontSize: 10, color: "#bbb", marginLeft: "auto" }}>
                  {report.lat.toFixed(3)}, {report.lng.toFixed(3)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: "10px 16px", borderTop: "1px solid #f0f0f0", background: "#fafafa" }}>
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#aaa", justifyContent: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e74c3c", display: "inline-block" }}></span>
            High
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f39c12", display: "inline-block" }}></span>
            Medium
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27ae60", display: "inline-block" }}></span>
            Low
          </span>
        </div>
      </div>
    </div>
  );
}
