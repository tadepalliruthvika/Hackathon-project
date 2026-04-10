import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const dummyReports = [
  {
    title: "Plastic waste near Marina Beach",
    lat: 13.0499,
    lng: 80.2824,
    severity: "High",
    status: "Reported",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Litter_on_the_beach.jpg/320px-Litter_on_the_beach.jpg",
    createdAt: new Date().toISOString()
  },
  {
    title: "Garbage dump at T. Nagar signal",
    lat: 13.0418,
    lng: 80.2341,
    severity: "Medium",
    status: "In Progress",
    image: "",
    createdAt: new Date().toISOString()
  },
  {
    title: "Open waste burning in Adyar",
    lat: 13.0012,
    lng: 80.2565,
    severity: "High",
    status: "Reported",
    image: "",
    createdAt: new Date().toISOString()
  },
  {
    title: "Minor littering near Anna Nagar park",
    lat: 13.0891,
    lng: 80.2104,
    severity: "Low",
    status: "Cleaned",
    image: "",
    createdAt: new Date().toISOString()
  },
  {
    title: "Construction debris on Velachery road",
    lat: 12.9815,
    lng: 80.2180,
    severity: "Medium",
    status: "Reported",
    image: "",
    createdAt: new Date().toISOString()
  },
  {
    title: "E-waste dumped near Guindy",
    lat: 13.0067,
    lng: 80.2206,
    severity: "High",
    status: "In Progress",
    image: "",
    createdAt: new Date().toISOString()
  }
];

export const seedDummyData = async () => {
  const reportsRef = collection(db, "reports");
  const snapshot = await getDocs(reportsRef);
  if (snapshot.size === 0) {
    for (const report of dummyReports) {
      await addDoc(reportsRef, report);
    }
    console.log("Seeded dummy reports.");
  }
};
