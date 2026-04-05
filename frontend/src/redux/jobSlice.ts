import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JobState {
    allJobs: any[];
    allAdminJobs: any[];
    singleJob: any | null; 
    searchJobByText: string;
    allAppliedJobs: any[];
    searchedQuery: string;
}

const initialState: JobState = {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null, 
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: "",
};

const jobSlice = createSlice({
    name: "job",
    initialState,
    reducers: {
        setAllJobs: (state, action: PayloadAction<any[]>) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action: PayloadAction<any | null>) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action: PayloadAction<any[]>) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action: PayloadAction<string>) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs: (state, action: PayloadAction<any[]>) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery: (state, action: PayloadAction<string>) => {
            state.searchedQuery = action.payload;
        }
    }
});

export const {
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    setSearchedQuery
} = jobSlice.actions;
export default jobSlice.reducer;
