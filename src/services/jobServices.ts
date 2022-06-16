import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export const deleteJob = (jobId: string) => {
  const jobRef = doc(db, `jobs/${jobId}`);
  return deleteDoc(jobRef);
};

export const verifyJob = (jobId: string, verify = true) => {
  const jobRef = doc(db, `jobs/${jobId}`);
  return updateDoc(jobRef, { verified: verify ? true : null });
};
