// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    User 
} from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "REMOVED",
  authDomain: "yk-you-tube-clone-fullstack.firebaseapp.com",
  projectId: "yk-you-tube-clone-fullstack",
  appId: "1:30755817660:web:d130580239839e218468b9",
  measurementId: "G-8WPSLCWL92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);

/**
 * Sign in with Google popup using Firebase Authentication.
 * @returns A promise that resolves with the user's credentials.
 */
export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

/** 
 * Sign the user out.
 * @returns A promise that resolves when the user is signed out.
*/
export function signOutAuth() {
    return auth.signOut();
}

/**
 * Trigger a callback when user auth state changes.
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}