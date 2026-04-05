"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { RootState } from "@/redux/store";

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((store: RootState) => store.auth);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            if (!user || user.role !== 'student') return;
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setAllAppliedJobs(res.data.application));
                }
            } catch (error: any) {
                // Ignore 401 Unauthorized errors caused by expired cookies vs persisted Redux state
                if (error.response?.status !== 401) {
                    console.error("Error fetching applied jobs:", error);
                }
            }
        };
        fetchAppliedJobs();
    }, [dispatch, user]);
};

export default useGetAppliedJobs;
