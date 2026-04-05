"use client";

import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/redux/store';

const LatestJobs = () => {
  const { allJobs } = useSelector((store: RootState) => store.job);

  return (
    <section className="max-w-7xl mx-auto my-20 px-4 sm:px-6 lg:px-8">
      
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 animate-fadeIn">
          <span className="text-indigo-600">Latest</span> & Top Job Openings
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Explore the newest job opportunities from trusted companies.
        </p>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeInUp">
        {allJobs.length <= 0 ? (
          <div className="text-gray-500 text-center col-span-full text-lg">
            🚫 No Job Available
          </div>
        ) : (
          allJobs.slice(0, 6).map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <LatestJobCards job={job} />
            </motion.div>
          ))
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default LatestJobs;
