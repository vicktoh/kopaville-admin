import { Product, ProductFormValue } from "../types/Product";
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import { db, firebaseApp } from "./firebase";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { KOPAVILLE_NAME, KOPAVILLE_USER } from "../constants";


export const addProduct = async (values: ProductFormValue, files: FileList) => {
   const urls: string[] = [];
   const firebaseStorage = getStorage(firebaseApp);
   const productRef = doc(collection(db, "products"));
   for(let i =0; i< files.length; i++){
      const storageRef= ref(firebaseStorage, `products/${productRef.id}-${i}`);
      const snapshot = await uploadBytes(storageRef, files[0]);
      const url =  await getDownloadURL(snapshot.ref);
      urls.push(url);
   }
   const productData: Product = {
      ...values,
      vendorName: KOPAVILLE_NAME,
      userId: KOPAVILLE_USER,
      dateAdded: Timestamp.now(),
      vendorId: KOPAVILLE_NAME,
      images: urls
   }

   await setDoc(productRef, productData);
   

}