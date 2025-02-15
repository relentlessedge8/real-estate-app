import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Adjust path based on your project structure

export async function fetchAllProperties() {
  try {
    console.log("Testing Firebase connection...");
    const propertiesRef = collection(db, "properties");
    const snapshot = await getDocs(propertiesRef);

    if (snapshot.empty) {
      console.log("No properties found.");
      return [];
    }

    let properties = [];
    snapshot.forEach((doc) => {
      properties.push({ id: doc.id, ...doc.data() });
    });

    console.log("Properties retrieved:", properties);
    return properties;
  } catch (error) {
    console.error("Firestore error:", error);
    return [];
  }
}
