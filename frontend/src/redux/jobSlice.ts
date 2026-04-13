import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JobState {
    allJobs: any[];
    allAdminJobs: any[];
    singleJob: any | null; 
    searchJobByText: string;
    allAppliedJobs: any[];
    searchedQuery: string;
    filterParams: {
        Location: string;
        Industry: string;
        Salary: string;
    };
}

const initialState: JobState = {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null, 
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: "",
    filterParams: {
        Location: "",
        Industry: "",
        Salary: "",
    },
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
        },
        setFilterParams: (state, action: PayloadAction<{ category: string, value: string }>) => {
            const { category, value } = action.payload;
            state.filterParams = {
                ...state.filterParams,
                [category]: value
            };
        },
        clearFilters: (state) => {
            state.filterParams = {
                Location: "",
                Industry: "",
                Salary: "",
            };
            state.searchedQuery = "";
        }
    }
});

export const {
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    setSearchedQuery,
    setFilterParams,
    clearFilters
} = jobSlice.actions;
export default jobSlice.reducer;
