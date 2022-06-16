import { signOut } from "firebase/auth";
import { firebaseAuth } from "./firebase";

export const logOUt = async () => {
  await signOut(firebaseAuth);
};
