"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search, Sparkles } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const searchJobHandler = () => {
    if (!query.trim()) return;
    dispatch(setSearchedQuery(query));
    router.push("/browse");
  };

  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-32">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest border border-indigo-100 shadow-sm">
            <Sparkles size={14} />
            The Future of Hiring is Here
          </span>
        </motion.div>
      
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-black leading-[1.1] mb-8 text-slate-900 tracking-tight"
        >
          Launch Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">Dream Career</span> <br className="hidden lg:block" />
          With Confidence.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-500 mb-12 font-medium leading-relaxed"
        >
          Connect with world-class companies and find opportunities that match your passion, skills, and ambition.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto p-2 bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 mb-16"
        >
          <div className="flex-1 flex items-center px-4 w-full">
            <Search className="text-slate-400 mr-3 shrink-0" size={20} />
            <input
              type="text"
              placeholder="Job title, keywords, or company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchJobHandler()}
              className="w-full py-4 bg-transparent text-slate-800 placeholder-slate-400 font-medium focus:outline-none"
            />
          </div>
          <Button
            onClick={searchJobHandler}
            className="w-full sm:w-auto h-14 px-10 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 text-base"
          >
            Find Jobs
          </Button>
        </motion.div>


      </div>
    </section>
  );
};

export default HeroSection;
