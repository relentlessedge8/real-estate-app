import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, collection, getDocs, query, limit } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)

// Test Firebase connection
async function testFirebaseConnection() {
  if (process.env.NODE_ENV === "development") {
    console.log("Testing Firebase connection...")
    try {
      // Try to fetch a single document from the 'properties' collection
      const propertiesCollection = collection(db, "properties")
      const q = query(propertiesCollection, limit(1))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        console.log("Successfully connected to Firebase, but 'properties' collection is empty")
      } else {
        console.log("Successfully connected to Firebase and fetched data from 'properties' collection")
      }
    } catch (error) {
      if (error.code === "permission-denied") {
        console.error("Failed to connect to Firebase: Permission denied. Please check your security rules.")
      } else {
        console.error("Failed to connect to Firebase:", error)
      }
    }
  }
}

testFirebaseConnection()

export { db }

