import { doc, getDoc } from "firebase/firestore";
import { httpsCallable, getFunctions } from "firebase/functions";
import { Profile } from "../types/Profile";
import { db, firebaseApp } from "./firebase";
const functions = getFunctions(firebaseApp);
export const setAdmin = httpsCallable<
  { userId: string; admin: boolean | null },
  { status: "success" | "failed"; message?: string }
>(functions, "setAdmin");
export const disableUser = httpsCallable<
  { userId: string },
  { status: "success" | "failed"; message?: string }
>(functions, "disableUser");
export const enableUser = httpsCallable<
  { userId: string },
  { status: "success" | "failed"; message?: string }
>(functions, "enableUser");

export const fetchProfile = async (userId: string) => {
  const docRef = doc(db, `users/${userId}`);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as Profile;
};
