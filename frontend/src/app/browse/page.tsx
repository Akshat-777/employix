"use client";

import React, { useEffect } from 'react';
import Job from '@/components/Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { RootState } from '@/redux/store';
import { motion, AnimatePresence } from 'framer-motion';

const BrowsePage = () => {
  useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((store: RootState) => store.job);
  const [filterJobs, setFilterJobs] = React.useState(allJobs);
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchedQuery) {
      const filteredJobs = allJobs.filter((job: any) => {
        return (
          job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.company?.name.toLowerCase().includes(searchedQuery.toLowerCase())
        );
      });
      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(''));
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faff] via-[#edf2ff] to-[#f0f4ff] text-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="font-extrabold text-4xl sm:text-5xl text-indigo-900 mb-4 tracking-tight">
               Discover Your Next Opportunity
            </h1>
            <p className="text-lg text-indigo-600 font-medium">
              Showing {filterJobs.length} {filterJobs.length === 1 ? 'result' : 'results'} {searchedQuery && `for "${searchedQuery}"`}
            </p>
          </div>

          {filterJobs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-indigo-100 shadow-inner"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No matching jobs found</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn't find any positions matching your current search criteria. Try using broader keywords or clearing your filters.
              </p>
              <button 
                onClick={() => dispatch(setSearchedQuery(''))}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md"
              >
                Clear Search
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filterJobs.map((job: any) => (
                  <motion.div
                    key={job._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out;
          }
        `}</style>
    </div>
  );
};

export default BrowsePage;
