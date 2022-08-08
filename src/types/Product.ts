import { Timestamp } from "firebase/firestore";
export enum ProductGrade {
  "New" = "New",
  "Fairly Used" = "Fairly Used",
  "Used" = "Used",
}
export type Product = {
  productId?: string;
  vendorId: string;
  userId: string;
  name: string;
  variants?: Record<string, [{ text: string }]>;
  rating?: number;
  grade?: ProductGrade;
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
  grade?: ProductGrade;
  variants?: Record<string, [{ text: string }]>;
};
export type CartItem = {
  productName: string;
  productId?: string;
  productImage: string;
  quantity: number;
  price: number;
};
export type Billing = {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
};

export enum DeliveryStatus {
  pending = "pending",
  shipped = "shipped",
  delivered = "delivered",
}
export type Order = {
  cart: CartItem[];
  userId: string;
  date: Timestamp | number | Date;
  paymentStatus: "pending" | "paid" | "pending";
  deliveryDate?: Timestamp | number | Date;
  deliveryStatus?: DeliveryStatus;
  transactionRef: string;
  amount: number;
  billing?: Billing;
  paymentDetails?: {
    transactionRef: string;
    date: string;
    amount: number;
  };
  objectID?: string;
};
