import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export const dismissReport = (reportId: string) => {
  const reportRef = doc(db, `reports/${reportId}`);
  return deleteDoc(reportRef);
};
export const dismissUserReport = (reportId: string) => {
  const reportRef = doc(db, `userReports/${reportId}`);
  return deleteDoc(reportRef);
};
