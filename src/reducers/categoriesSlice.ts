import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialAuth: string[] | null = null;

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: initialAuth,
    reducers: {
        setCategories: (state: string[] | null, action: PayloadAction<string[]|null>) => {
             state = action.payload === null ? null : [ ...(state || []), ...action.payload ];
             return state as any  
        },
    },
});

export const { setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;