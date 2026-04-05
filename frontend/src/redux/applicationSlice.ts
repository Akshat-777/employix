import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ApplicationState {
    applicants: any | null;
}

const initialState: ApplicationState = {
    applicants: null,
};

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        setAllApplicants: (state, action: PayloadAction<any | null>) => {
            state.applicants = action.payload;
        }
    }
});

export const { setAllApplicants } = applicationSlice.actions;
export default applicationSlice.reducer;
