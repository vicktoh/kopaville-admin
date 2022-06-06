import { Timestamp } from "firebase/firestore";

export type Product = {
  productId?: string;
  vendorId: string;
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
  dateAdded: Timestamp;
};

export type ProductFormValue = {
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: string;
  photoUrl?: string;
};
export type CartItem = {
  productName: string;
  productId?: string;
  productImage: string;
  quantity: number;
  price: number;
};
export type Order = {
  cart: CartItem[];
  userId: string;
  date: Timestamp | number | Date;
  paymentStatus: "pending" | "paid" | "pending";
  deliveryDate?: Timestamp | number | Date;
  deliveryStatus?: "shipped" | "delivered" | "ending";
  transactionRef: string;
  amount: number;
};
