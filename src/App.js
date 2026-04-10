import React, { useState, useEffect } from "react";
import {
  collection, onSnapshot, addDoc, doc, updateDoc,
  setDoc, getDoc, increment
} from "firebase/firestore";
import { db } from "./firebase";
import { seedDummyData } from "./seedData";
import MapComponent from "./MapComponent";
import Sidebar from "./Sidebar";
import ReportForm from "./ReportForm";

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
export const TRANSLATIONS = {
  en: {
    clickHint: "🗺️ Click anywhere on the map to report a waste spot",
    reportAtLocation: "📍 Report at My Location",
    locationFound: "📍 Location found! Map centered on your location.",
    locationDenied: "Location denied. Using Chennai as default.",
    locationError: "Could not get your location. Please click on the map instead.",
    submitSuccess: "✅ Report submitted successfully!",
    submitError: "Error submitting report. Check Firebase config.",
    claimed: "🙋 Claimed! Status: In Progress",
    markedCleaned: "✅ Marked as Cleaned!",
    pendingProof: "⚠️ No after photo — marked as Pending Proof",
    updateFailed: "Failed to update status.",
    langBtn: "தமிழ்",
    appTitle: "Waste Watcher",
    subtitle: "Chennai Cleanup Network",
    total: "Total", inProgress: "In Progress", cleaned: "Cleaned",
    reported: "Reported", pendingProofLabel: "Pending Proof",
    reports: "Reports",
    noReports: "No reports yet. Click the map to add one!",
    leaderboard: "🏆 Leaderboard",
    rank: "Rank", name: "Name", points: "Points", cleanups: "Cleanups",
    noVolunteers: "No volunteers yet.",
    high: "High", medium: "Medium", low: "Low",
    yourLocation: "📍 Your Location",
    before: "Before", after: "After", noAfterYet: "No after photo yet",
    volunteerLabel: "Volunteer", enterName: "Enter your name",
    uploadAfter: "📷 Upload After Photo",
    afterRequired: "⚠️ After photo required to mark cleaned",
    claimBtn: "🙋 Claim for Cleanup",
    markCleanedBtn: "✅ Mark as Cleaned",
    submitProofBtn: "📸 Submit Proof & Clean",
    areaCleanedMsg: "✅ Area Cleaned",
    reportTitle: "🗑️ Report a Waste Spot",
    gettingAddress: "📍 Getting address...",
    locationDetected: "LOCATION DETECTED",
    titleLabel: "Title *", titlePlaceholder: "Describe the waste issue...",
    photoLabel: "📷 Upload Photo (optional)",
    photoBtn: "📸 Take Photo or Choose from Gallery",
    photoHint: "Tap to open camera or select image",
    severityLabel: "Severity (Auto: Medium)",
    cancelBtn: "Cancel", submitBtn: "🚨 Submit Report", saving: "Saving...",
    severityHintLow: "Minor littering — not urgent",
    severityHintMedium: "Significant dump — needs attention",
    severityHintHigh: "Hazardous / Urgent — immediate cleanup needed",
  },
  ta: {
    clickHint: "🗺️ கழிவு இடத்தை புகாரளிக்க வரைபடத்தில் கிளிக் செய்யுங்கள்",
    reportAtLocation: "📍 என் இடத்தில் புகாரளி",
    locationFound: "📍 இடம் கிடைத்தது! வரைபடம் உங்கள் இடத்தில் மையப்படுத்தப்பட்டது.",
    locationDenied: "இடம் மறுக்கப்பட்டது. சென்னை பயன்படுத்தப்படுகிறது.",
    locationError: "உங்கள் இடத்தை பெற முடியவில்லை. வரைபடத்தில் கிளிக் செய்யுங்கள்.",
    submitSuccess: "✅ புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
    submitError: "புகார் சமர்ப்பிக்கும்போது பிழை.",
    claimed: "🙋 கோரப்பட்டது! நிலை: செயல்பாட்டில்",
    markedCleaned: "✅ சுத்தம் செய்யப்பட்டதாக குறிக்கப்பட்டது!",
    pendingProof: "⚠️ பின்பு புகைப்படம் இல்லை — நிலுவையில் உள்ளது",
    updateFailed: "நிலையை புதுப்பிக்க தவறியது.",
    langBtn: "हिंदी",
    appTitle: "கழிவு காவலர்",
    subtitle: "சென்னை சுத்தம் நெட்வொர்க்",
    total: "மொத்தம்", inProgress: "செயல்பாட்டில்", cleaned: "சுத்தம்",
    reported: "புகாரளிக்கப்பட்டது", pendingProofLabel: "சான்று நிலுவை",
    reports: "புகார்கள்",
    noReports: "இன்னும் புகார்கள் இல்லை. வரைபடத்தில் கிளிக் செய்யுங்கள்!",
    leaderboard: "🏆 தலைமை பலகை",
    rank: "தரவரிசை", name: "பெயர்", points: "புள்ளிகள்", cleanups: "சுத்தம்",
    noVolunteers: "இன்னும் தன்னார்வலர்கள் இல்லை.",
    high: "அதிகம்", medium: "நடுத்தரம்", low: "குறைவு",
    yourLocation: "📍 உங்கள் இடம்",
    before: "முன்பு", after: "பின்பு", noAfterYet: "பின்பு புகைப்படம் இல்லை",
    volunteerLabel: "தன்னார்வலர்", enterName: "உங்கள் பெயரை உள்ளிடுங்கள்",
    uploadAfter: "📷 பின்பு புகைப்படம் பதிவேற்று",
    afterRequired: "⚠️ சுத்தம் குறிக்க பின்பு புகைப்படம் தேவை",
    claimBtn: "🙋 சுத்தப்படுத்த கோரு",
    markCleanedBtn: "✅ சுத்தம் என குறி",
    submitProofBtn: "📸 சான்று சமர்ப்பி & சுத்தம் செய்",
    areaCleanedMsg: "✅ பகுதி சுத்தம் செய்யப்பட்டது",
    reportTitle: "🗑️ கழிவு இடத்தை புகாரளி",
    gettingAddress: "📍 முகவரி பெறுகிறோம்...",
    locationDetected: "இடம் கண்டறியப்பட்டது",
    titleLabel: "தலைப்பு *", titlePlaceholder: "கழிவு பிரச்சனையை விவரிக்கவும்...",
    photoLabel: "📷 புகைப்படம் பதிவேற்று (விருப்பம்)",
    photoBtn: "📸 புகைப்படம் எடு அல்லது தேர்ந்தெடு",
    photoHint: "கேமரா திற அல்லது படத்தை தேர்ந்தெடு",
    severityLabel: "தீவிரம் (தானியங்கி: நடுத்தரம்)",
    cancelBtn: "ரத்து செய்", submitBtn: "🚨 புகார் சமர்ப்பி", saving: "சேமிக்கிறோம்...",
    severityHintLow: "சிறிய குப்பை — அவசரமில்லை",
    severityHintMedium: "கணிசமான குப்பை — கவனம் தேவை",
    severityHintHigh: "ஆபத்தானது / அவசரம் — உடனடி சுத்தம் தேவை",
  },
  hi: {
    clickHint: "🗺️ कचरे की जगह रिपोर्ट करने के लिए मानचित्र पर क्लिक करें",
    reportAtLocation: "📍 मेरी लोकेशन पर रिपोर्ट करें",
    locationFound: "📍 लोकेशन मिली! मानचित्र आपकी लोकेशन पर केंद्रित है।",
    locationDenied: "लोकेशन अस्वीकृत। चेन्नई डिफ़ॉल्ट के रूप में उपयोग किया जा रहा है।",
    locationError: "आपकी लोकेशन नहीं मिली। कृपया मानचित्र पर क्लिक करें।",
    submitSuccess: "✅ रिपोर्ट सफलतापूर्वक जमा की गई!",
    submitError: "रिपोर्ट जमा करने में त्रुटि। Firebase config जांचें।",
    claimed: "🙋 दावा किया! स्थिति: प्रगति में",
    markedCleaned: "✅ साफ़ के रूप में चिह्नित!",
    pendingProof: "⚠️ बाद की फोटो नहीं — लंबित प्रमाण के रूप में चिह्नित",
    updateFailed: "स्थिति अपडेट करने में विफल।",
    langBtn: "English",
    appTitle: "कचरा प्रहरी",
    subtitle: "चेन्नई सफाई नेटवर्क",
    total: "कुल", inProgress: "प्रगति में", cleaned: "साफ़",
    reported: "रिपोर्ट किया", pendingProofLabel: "लंबित प्रमाण",
    reports: "रिपोर्ट",
    noReports: "अभी तक कोई रिपोर्ट नहीं। मानचित्र पर क्लिक करें!",
    leaderboard: "🏆 लीडरबोर्ड",
    rank: "रैंक", name: "नाम", points: "अंक", cleanups: "सफाई",
    noVolunteers: "अभी तक कोई स्वयंसेवक नहीं।",
    high: "उच्च", medium: "मध्यम", low: "निम्न",
    yourLocation: "📍 आपकी लोकेशन",
    before: "पहले", after: "बाद", noAfterYet: "बाद की फोटो नहीं",
    volunteerLabel: "स्वयंसेवक", enterName: "अपना नाम दर्ज करें",
    uploadAfter: "📷 बाद की फोटो अपलोड करें",
    afterRequired: "⚠️ साफ़ चिह्नित करने के लिए बाद की फोटो आवश्यक है",
    claimBtn: "🙋 सफाई के लिए दावा करें",
    markCleanedBtn: "✅ साफ़ के रूप में चिह्नित करें",
    submitProofBtn: "📸 प्रमाण जमा करें और साफ़ करें",
    areaCleanedMsg: "✅ क्षेत्र साफ़ किया गया",
    reportTitle: "🗑️ कचरे की जगह रिपोर्ट करें",
    gettingAddress: "📍 पता प्राप्त हो रहा है...",
    locationDetected: "लोकेशन पता चली",
    titleLabel: "शीर्षक *", titlePlaceholder: "कचरे की समस्या का वर्णन करें...",
    photoLabel: "📷 फोटो अपलोड करें (वैकल्पिक)",
    photoBtn: "📸 फोटो लें या गैलरी से चुनें",
    photoHint: "कैमरा खोलें या छवि चुनें",
    severityLabel: "गंभीरता (स्वतः: मध्यम)",
    cancelBtn: "रद्द करें", submitBtn: "🚨 रिपोर्ट जमा करें", saving: "सहेज रहे हैं...",
    severityHintLow: "मामूली कूड़ा — तत्काल नहीं",
    severityHintMedium: "महत्वपूर्ण डंप — ध्यान चाहिए",
    severityHintHigh: "खतरनाक / तत्काल — तुरंत सफाई चाहिए",
  }
};

const SEVERITY_POINTS = { Low: 10, Medium: 25, High: 50 };

export default function App() {
  const [reports, setReports] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [flyTarget, setFlyTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([13.0827, 80.2707]);
  const [lang, setLang] = useState(() => localStorage.getItem("ww_lang") || "en");

  const t = TRANSLATIONS[lang];

  useEffect(() => { seedDummyData(); }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setMapCenter([loc.lat, loc.lng]);
          showToast(t.locationFound, "success");
        },
        () => showToast(t.locationDenied, "error"),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // ── Real-time reports listener ──
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reports"), (snap) => {
      setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // ── Real-time volunteers leaderboard listener ──
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "volunteers"), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      setVolunteers(data);
    });
    return () => unsub();
  }, []);

  const toggleLang = () => {
    const cycle = { en: "ta", ta: "hi", hi: "en" };
    const next = cycle[lang] || "en";
    setLang(next);
    localStorage.setItem("ww_lang", next);
  };

  const handleMapClick = (latlng) => {
    setClickedLocation({ lat: latlng.lat, lng: latlng.lng });
    setShowForm(true);
  };

  const handleUseMyLocation = () => {
    const go = (loc) => {
      setClickedLocation(loc);
      setFlyTarget(loc);
      setTimeout(() => setFlyTarget(null), 1500);
      setShowForm(true);
    };
    if (userLocation) { go(userLocation); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }; setUserLocation(loc); go(loc); },
      () => showToast(t.locationError, "error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async ({ title, image, address }) => {
    if (!clickedLocation) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, "reports"), {
        title,
        lat: clickedLocation.lat,
        lng: clickedLocation.lng,
        severity: "Medium", // ── AUTO SEVERITY: always Medium ──
        status: "Reported",
        image: image || "",
        beforeImage: image || "",
        afterImage: "",
        volunteerName: "",
        address: address || "",
        createdAt: new Date().toISOString()
      });
      showToast(t.submitSuccess, "success");
    } catch (err) {
      showToast(t.submitError, "error");
      console.error(err);
    }
    setSubmitting(false);
    setShowForm(false);
    setClickedLocation(null);
  };

  const updateVolunteer = async (name, severity) => {
    if (!name || !name.trim()) return;
    const key = name.trim().toLowerCase().replace(/\s+/g, "_");
    const pts = SEVERITY_POINTS[severity] || 25;
    const ref = doc(db, "volunteers", key);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { totalPoints: increment(pts), cleanupCount: increment(1) });
    } else {
      await setDoc(ref, { name: name.trim(), totalPoints: pts, cleanupCount: 1 });
    }
  };

  const handleClaim = async (id, currentStatus, volunteerName, afterImageBase64) => {
    const name = (volunteerName || "").trim() || "Anonymous";
    const report = reports.find((r) => r.id === id);
    try {
      if (currentStatus === "Reported") {
        await updateDoc(doc(db, "reports", id), { status: "In Progress", volunteerName: name });
        showToast(t.claimed, "success");
      } else if (currentStatus === "In Progress" || currentStatus === "Pending Proof") {
        if (!afterImageBase64) {
          await updateDoc(doc(db, "reports", id), { status: "Pending Proof", volunteerName: name });
          showToast(t.pendingProof, "error");
        } else {
          await updateDoc(doc(db, "reports", id), {
            status: "Cleaned", afterImage: afterImageBase64, volunteerName: name
          });
          await updateVolunteer(name, report?.severity || "Medium");
          showToast(t.markedCleaned, "success");
        }
      }
    } catch (err) {
      showToast(t.updateFailed, "error");
      console.error(err);
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
        <div style={{
          position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
          zIndex: 1000, background: "rgba(255,255,255,0.95)", padding: "8px 18px",
          borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          fontSize: 13, color: "#555", pointerEvents: "none", whiteSpace: "nowrap"
        }}>{t.clickHint}</div>

        <button onClick={toggleLang} style={{
          position: "absolute", top: 14, right: 16, zIndex: 1000,
          background: "#2c3e50", color: "white", border: "none",
          borderRadius: 20, padding: "8px 16px", fontSize: 13,
          fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
        }}>🌐 {t.langBtn}</button>

        <button onClick={handleUseMyLocation} style={{
          position: "absolute", bottom: 36, left: 16, zIndex: 1000,
          background: "#2ecc71", color: "white", border: "none",
          borderRadius: 24, padding: "11px 20px", fontSize: 13,
          fontWeight: 700, cursor: "pointer", boxShadow: "0 3px 14px rgba(0,0,0,0.25)",
          display: "flex", alignItems: "center", gap: 7
        }}>{t.reportAtLocation}</button>

        <MapComponent
          reports={reports}
          onMapClick={handleMapClick}
          clickedLocation={clickedLocation}
          flyTarget={flyTarget}
          onClaim={handleClaim}
          userLocation={userLocation}
          mapCenter={mapCenter}
          t={t}
        />
      </div>

      <Sidebar reports={reports} volunteers={volunteers} onSelectReport={handleSelectReport} t={t} />

      {showForm && clickedLocation && (
        <ReportForm
          location={clickedLocation}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setClickedLocation(null); }}
          loading={submitting}
          t={t}
        />
      )}

      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: toast.type === "success" ? "#27ae60" : "#e74c3c",
          color: "white", padding: "12px 28px", borderRadius: 24,
          fontSize: 14, fontWeight: 600, zIndex: 99999,
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)"
        }}>{toast.message}</div>
      )}

      <style>{`body{margin:0;padding:0;}.leaflet-container{cursor:crosshair!important;}`}</style>
    </div>
  );
}
