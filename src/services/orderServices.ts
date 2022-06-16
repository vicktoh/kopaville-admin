import { doc, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
export const updateOrderDocument = (
  document: any,
  orderId: string,
  userId: string
) => {
  const orderRef = doc(db, `confirmedOrders/${orderId}`);
  const userOrderRef = doc(db, `users/${userId}/orders/${orderId}`);
  const batch = writeBatch(db);
  batch.update(userOrderRef, document);
  batch.update(orderRef, document);
  return batch.commit();
};
