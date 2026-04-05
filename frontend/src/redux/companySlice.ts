import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CompanyState {
    singleCompany: any | null;
    companies: any[];
    searchCompanyByText: string;
}

const initialState: CompanyState = {
    singleCompany: null,
    companies: [],
    searchCompanyByText: "",
};

const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {
        setSingleCompany: (state, action: PayloadAction<any | null>) => {
            state.singleCompany = action.payload;
        },
        setCompanies: (state, action: PayloadAction<any[]>) => {
            state.companies = action.payload;
        },
        setSearchCompanyByText: (state, action: PayloadAction<string>) => {
            state.searchCompanyByText = action.payload;
        }
    }
});

export const { setSingleCompany, setCompanies, setSearchCompanyByText } = companySlice.actions;
export default companySlice.reducer;
