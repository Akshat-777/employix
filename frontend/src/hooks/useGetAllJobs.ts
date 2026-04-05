"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import { RootState } from '@/redux/store';

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector((store: RootState) => store.job);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const url = `${JOB_API_END_POINT}/get?keyword=${searchedQuery}`;
                console.log("Fetching jobs from URL:", url);
                const res = await axios.get(url, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchAllJobs();
    }, [dispatch, searchedQuery]);
};

export default useGetAllJobs;
