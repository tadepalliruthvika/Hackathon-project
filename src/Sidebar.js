import React from "react";

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

export default function Sidebar({ reports, volunteers, onSelectReport, t }) {
  const total = reports.length;
  const inProgress = reports.filter((r) => r.status === "In Progress").length;
  const cleaned = reports.filter((r) => r.status === "Cleaned").length;
  const reported = reports.filter((r) => r.status === "Reported").length;
  const pendingProof = reports.filter((r) => r.status === "Pending Proof").length;

  return (
    <div style={{
      width: 300, minWidth: 300, height: "100%",
      background: "#fff", borderLeft: "1px solid #e0e0e0",
      display: "flex", flexDirection: "column",
      fontFamily: "sans-serif", overflow: "hidden"
    }}>

      {/* ── Header ── */}
      <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 22 }}>♻️</span>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#2c3e50" }}>{t.appTitle}</h2>
            <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{t.subtitle}</p>
          </div>
        </div>

        {/* ── Dashboard stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ background: "#f8f9fa", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase" }}>{t.total}</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#2c3e50" }}>{total}</p>
          </div>
          <div style={{ background: "#fef9ec", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#c0842e", fontWeight: 600, textTransform: "uppercase" }}>{t.inProgress}</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#e67e22" }}>{inProgress}</p>
          </div>
          <div style={{ background: "#eafaf1", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#1d8348", fontWeight: 600, textTransform: "uppercase" }}>{t.cleaned}</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#27ae60" }}>{cleaned}</p>
          </div>
          <div style={{ background: "#fdf2f8", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#884ea0", fontWeight: 600, textTransform: "uppercase" }}>{t.reported}</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#8e44ad" }}>{reported}</p>
          </div>
          {pendingProof > 0 && (
            <div style={{ background: "#f5eef8", borderRadius: 8, padding: "10px 12px", gridColumn: "1 / -1" }}>
              <p style={{ margin: 0, fontSize: 11, color: "#7d3c98", fontWeight: 600, textTransform: "uppercase" }}>{t.pendingProofLabel}</p>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#9b59b6" }}>{pendingProof}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Leaderboard ── */}
      <div style={{ padding: "10px 16px 6px", borderBottom: "1px solid #f0f0f0" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>
          {t.leaderboard}
        </p>
      </div>
      <div style={{ maxHeight: 180, overflowY: "auto", borderBottom: "1px solid #f0f0f0" }}>
        {volunteers.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa", fontSize: 12, padding: "12px 16px" }}>{t.noVolunteers}</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#f8f9fa" }}>
                <th style={{ padding: "6px 10px", textAlign: "left", color: "#888", fontWeight: 600 }}>{t.rank}</th>
                <th style={{ padding: "6px 10px", textAlign: "left", color: "#888", fontWeight: 600 }}>{t.name}</th>
                <th style={{ padding: "6px 10px", textAlign: "center", color: "#888", fontWeight: 600 }}>{t.points}</th>
                <th style={{ padding: "6px 10px", textAlign: "center", color: "#888", fontWeight: 600 }}>{t.cleanups}</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v, i) => (
                <tr key={v.id} style={{ borderTop: "1px solid #f5f5f5", background: i === 0 ? "#fffbea" : "transparent" }}>
                  <td style={{ padding: "6px 10px", fontWeight: 700, color: i === 0 ? "#f39c12" : i === 1 ? "#95a5a6" : i === 2 ? "#cd7f32" : "#aaa" }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </td>
                  <td style={{ padding: "6px 10px", fontWeight: 600, color: "#2c3e50" }}>{v.name}</td>
                  <td style={{ padding: "6px 10px", textAlign: "center", fontWeight: 700, color: "#e67e22" }}>{v.totalPoints || 0}</td>
                  <td style={{ padding: "6px 10px", textAlign: "center", color: "#888" }}>{v.cleanupCount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Reports list header ── */}
      <div style={{ padding: "10px 16px 6px", borderBottom: "1px solid #f0f0f0" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>
          {t.reports}
        </p>
      </div>

      {/* ── Reports list ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {reports.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa", fontSize: 13, padding: 24 }}>{t.noReports}</p>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              onClick={() => onSelectReport(report)}
              style={{ padding: "10px 16px", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f8f9fa"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#2c3e50", flex: 1, marginRight: 8, lineHeight: 1.3 }}>
                  {report.title}
                </p>
                <span style={{
                  background: getSeverityColor(report.severity), color: "white",
                  padding: "1px 6px", borderRadius: 10, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0
                }}>{report.severity}</span>
              </div>

              {/* Volunteer name in sidebar */}
              {report.volunteerName && (
                <p style={{ margin: "0 0 3px", fontSize: 11, color: "#888" }}>
                  👤 {report.volunteerName}
                </p>
              )}

              {/* Before/After thumbnails in sidebar */}
              {(report.beforeImage || report.image) && report.afterImage && (
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  <img src={report.beforeImage || report.image} alt="before"
                    style={{ width: 40, height: 30, objectFit: "cover", borderRadius: 4, border: "1px solid #eee" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <span style={{ fontSize: 10, color: "#aaa", alignSelf: "center" }}>→</span>
                  <img src={report.afterImage} alt="after"
                    style={{ width: 40, height: 30, objectFit: "cover", borderRadius: 4, border: "1px solid #eee" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: getStatusColor(report.status), flexShrink: 0, display: "inline-block"
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

      {/* ── Legend ── */}
      <div style={{ padding: "10px 16px", borderTop: "1px solid #f0f0f0", background: "#fafafa" }}>
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#aaa", justifyContent: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e74c3c", display: "inline-block" }}></span>
            {t.high}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f39c12", display: "inline-block" }}></span>
            {t.medium}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27ae60", display: "inline-block" }}></span>
            {t.low}
          </span>
        </div>
      </div>
    </div>
  );
}
