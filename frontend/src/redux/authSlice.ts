import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    loading: boolean;
    user: any | null; // You can refine 'any' into a User interface later
}

const initialState: AuthState = {
    loading: false,
    user: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setUser: (state, action: PayloadAction<any | null>) => {
            state.user = action.payload;
        }
    }
});

export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;
