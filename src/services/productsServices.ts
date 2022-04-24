import { Product, ProductFormValue } from "../types/Product";
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import { db, firebaseApp } from "./firebase";
import { collection, deleteDoc, doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { KOPAVILLE_NAME, KOPAVILLE_USER } from "../constants";
import { Category } from "../types/Category";


export const addProduct = async (values: ProductFormValue, files: FileList) => {
   const urls: string[] = [];
   const firebaseStorage = getStorage(firebaseApp);
   const productRef = doc(collection(db, "products"));
   for(let i =0; i< files.length; i++){
      const storageRef= ref(firebaseStorage, `products/${productRef.id}-${i}`);
      const snapshot = await uploadBytes(storageRef, files[i]);
      const url =  await getDownloadURL(snapshot.ref);
      urls.push(url);
   }
   const productData: Product = {
      ...values,
      vendorName: KOPAVILLE_NAME,
      userId: KOPAVILLE_USER,
      dateAdded: Timestamp.now(),
      vendorId: KOPAVILLE_NAME,
      images: urls,
      productId: productRef.id
   }

   await setDoc(productRef, productData);
}

export const addCategory = async (values: Category, file: File) => {
   const firebaseStorage = getStorage(firebaseApp);
   const categoryRef = doc(collection(db, "categories"));
   const storageRef= ref(firebaseStorage, `categories/${categoryRef.id}`);
   const snapshot = await uploadBytes(storageRef, file);
   const avartar = await getDownloadURL(snapshot.ref);
   const newCategory: Category = {
      ...values,
      avartar,
      categoryId: categoryRef.id
   }
   await setDoc(categoryRef, newCategory);
}



export const editProduct = async (values: ProductFormValue, productId: string, files ?: FileList) => {
   const urls: string[] = [];
   if(files && files.length){
      for(let i =0; i< files.length; i++){
         const firebaseStorage = getStorage(firebaseApp);
         const storageRef= ref(firebaseStorage, `products/${productId}-${i}`);
         const snapshot = await uploadBytes(storageRef, files[i]);
         const url =  await getDownloadURL(snapshot.ref);
         urls.push(url);
      }
   }
   const productRef = doc(db, "products", productId);
   const productData: Partial<Product> = {
      ...values,
      ...(urls.length ? {images: urls}: {})
   }

   await updateDoc(productRef, productData);
}

export const editCategory = async (values: Category, file?: File) =>{
   
   const categoryRef = doc(db, "categories", values.categoryId );
   let  avartar: string | undefined = undefined;
   if(file){
      const firebaseStorage = getStorage(firebaseApp);
      const storageRef = ref(firebaseStorage, `categories/${values.categoryId}`)
      const snapshot = await uploadBytes(storageRef, file);
      avartar = await getDownloadURL(snapshot.ref);
   }
   const newCategory = {
      ...values,
      ...(avartar ? {avartar}: {})
   }

   await updateDoc(categoryRef, newCategory);
}


export const deleteProduct = async (product: Product)=>{
   const productRef = doc(db, "products", product?.productId || "");
   await deleteDoc(productRef)
}

export const deleteCategory = async(category: Category) => {
   const categoryRef = doc(db, "categories", category.categoryId);
   await deleteDoc(categoryRef);
}