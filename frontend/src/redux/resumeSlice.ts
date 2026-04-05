import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ResumeAnalysisPayload {
  extracted_skills?: string[];
  recommended_jobs?: any[];
}

interface ResumeState {
    extractedSkills: string[];
    recommendedJobs: any[];
}

const initialState: ResumeState = {
    extractedSkills: [],
    recommendedJobs: [],
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setResumeAnalysis: (state, action: PayloadAction<ResumeAnalysisPayload>) => {
      state.extractedSkills = action.payload.extracted_skills || [];
      state.recommendedJobs = action.payload.recommended_jobs || [];
    },
  },
});

export const { setResumeAnalysis } = resumeSlice.actions;
export default resumeSlice.reducer;
