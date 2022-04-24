import { configureStore } from "@reduxjs/toolkit";
import { Auth } from "../types/Auth";
import { CategorySliceType } from "../types/Category";
import auth from './authSlice';
import categories from './categoriesSlice';

export const store = configureStore({
   reducer: {
      auth,
      categories
   }
})


export type StoreType = {
   auth : Auth | null,
   categories: CategorySliceType | null;
}


export type AppDispatch = typeof store.dispatch;