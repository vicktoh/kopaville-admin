import { Timestamp } from "firebase/firestore";

export type  Product = {
   vendorId:string;
   userId: string;
   name: string;
   rating?: number;
   numberOfRating?: number;
   purchases?: number;
   price: number;
   quantity: number;
   orderCount?: number;
   description: string;
   photoUrl?: string;
   category: string;
   vendorName: string;
   images: string[];
   dateAdded: Timestamp
}

export type ProductFormValue = {
   name: string;
   price: number;
   quantity: number;
   description: string;
   category: string;
   photoUrl?: string;
}