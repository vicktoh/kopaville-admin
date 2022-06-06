import { httpsCallable, getFunctions } from "firebase/functions";
import { firebaseApp } from "./firebase";
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
