"use client";

import React, { useEffect, useState, useCallback } from 'react';
import FilterCard from '@/components/FilterCard';
import Job from '@/components/Job';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/redux/store';
import { setAllJobs, setSearchedQuery } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const DEFAULT_FILTER_PARAMS = { Location: '', Industry: '', Salary: '' };

const JobsPage = () => {
  const { allJobs } = useSelector((store: RootState) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);
  const [localFilter, setLocalFilter] = useState('');
  const dispatch = useDispatch();

  // On mount: clear the shared search query and re-fetch ALL jobs (no keyword)
  useEffect(() => {
    dispatch(setSearchedQuery(''));
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
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
  }, [dispatch]);

  // Listen to Redux searchedQuery and filterParams changes
  const { searchedQuery, filterParams: filterParamsFromStore } = useSelector((store: RootState) => store.job);
  const filterParams = filterParamsFromStore || DEFAULT_FILTER_PARAMS;

  useEffect(() => {
    let filteredJobs = [...allJobs];

    // 1. Text Search (title, description, location)
    if (searchedQuery) {
      filteredJobs = filteredJobs.filter((job) => {
        return (
          job?.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job?.description?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job?.location?.toLowerCase().includes(searchedQuery.toLowerCase())
        );
      });
    }

    // 2. Sidebar Filters
    // Location
    if (filterParams?.Location) {
        filteredJobs = filteredJobs.filter((job) => 
            job?.location?.toLowerCase().includes(filterParams.Location.toLowerCase())
        );
    }

    // Industry (mapped to title for now)
    if (filterParams?.Industry) {
        filteredJobs = filteredJobs.filter((job) => 
            job?.title?.toLowerCase().includes(filterParams.Industry.toLowerCase())
        );
    }

    // Salary (Parse range e.g. "5 - 10 LPA")
    if (filterParams?.Salary) {
        const range = filterParams.Salary.match(/(\d+)\s*-\s*(\d+)/);
        if (range) {
            const min = parseInt(range[1]);
            const max = parseInt(range[2]);
            filteredJobs = filteredJobs.filter((job) => {
                if (!job?.salary) return false;
                const jobSalary = typeof job.salary === 'number' ? job.salary : parseInt(job.salary);
                return !isNaN(jobSalary) && jobSalary >= min && jobSalary <= max;
            });
        }
    }

    setFilterJobs(filteredJobs);
  }, [allJobs, searchedQuery, filterParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5ff] via-[#f8fbff] to-[#edf3ff] text-gray-800 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            
            <aside className="lg:w-1/4 w-full bg-white border border-blue-200 rounded-xl p-5 shadow-md animate-slideInLeft">
              <FilterCard />
            </aside>

            <main className="flex-1">
              {filterJobs.length === 0 ? (
                <div className="text-center text-gray-500 text-xl mt-16 animate-fadeIn">
                   No jobs found matching your criteria.
                </div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {filterJobs.map((job) => (
                    <motion.div
                      key={job?._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </main>
          </div>
        </div>

        <style>{`
          @keyframes slideInLeft {
            0% {
              opacity: 0;
              transform: translateX(-20px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-slideInLeft {
            animation: slideInLeft 0.5s ease-in-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.98);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-out;
          }
        `}</style>
      </div>
  );
};

export default JobsPage;
