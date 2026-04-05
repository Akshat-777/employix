"use client";

import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setSearchedQuery } from '@/redux/jobSlice';
import { motion } from 'framer-motion';
import { Code2, Globe, Database, PenTool, Layers, Terminal, Smartphone, Briefcase } from 'lucide-react';

const categories = [
  { name: "Frontend Developer", icon: <Globe size={18} /> },
  { name: "Backend Developer", icon: <Terminal size={18} /> },
  { name: "Data Scientist", icon: <Database size={18} /> },
  { name: "UI/UX Designer", icon: <PenTool size={18} /> },
  { name: "Full Stack Developer", icon: <Layers size={18} /> },
  { name: "DevOps Engineer", icon: <Code2 size={18} /> },
  { name: "Mobile App Developer", icon: <Smartphone size={18} /> },
  { name: "Product Manager", icon: <Briefcase size={18} /> }
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  const searchJobHandler = (query: string) => {
    dispatch(setSearchedQuery(query));
    router.push("/browse");
  };

  return (
    <section className="py-24 bg-[#f8faff] border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="text-left">
                <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight"
                >
                    Browse by Category
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-500 mt-2 font-medium"
                >
                    Find your specialized path among thousands of openings
                </motion.p>
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
            >
                <Button variant="ghost" className="text-indigo-600 font-bold hover:bg-indigo-50 hover:text-indigo-700 rounded-xl" onClick={() => setShowAll(!showAll)}>
                    {showAll ? "Show Less" : "View All Categories →"}
                </Button>
            </motion.div>
        </div>

        {showAll ? (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4"
            >
                {categories.map((cat, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <Button
                            onClick={() => searchJobHandler(cat.name)}
                            className="w-full h-20 flex items-center justify-start gap-4 px-6 rounded-2xl bg-white border border-slate-100 text-slate-700 font-bold shadow-sm hover:shadow-xl hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm transition-colors shrink-0">
                                {cat.icon}
                            </div>
                            <span className="truncate">{cat.name}</span>
                        </Button>
                    </motion.div>
                ))}
            </motion.div>
        ) : (
            <Carousel className="w-full relative px-4">
                <CarouselContent className="-ml-4">
                {categories.map((cat, index) => (
                    <CarouselItem
                        key={index}
                        className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                    <motion.div
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <Button
                            onClick={() => searchJobHandler(cat.name)}
                            className="w-full h-20 flex items-center justify-start gap-4 px-6 rounded-2xl bg-white border border-slate-100 text-slate-700 font-bold shadow-sm hover:shadow-xl hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm transition-colors shrink-0">
                                {cat.icon}
                            </div>
                            <span className="truncate">{cat.name}</span>
                        </Button>
                    </motion.div>
                    </CarouselItem>
                ))}
                </CarouselContent>
                
                <div className="hidden md:block">
                    <CarouselPrevious className="absolute -left-6 h-12 w-12 bg-white border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-indigo-100 shadow-lg" />
                    <CarouselNext className="absolute -right-6 h-12 w-12 bg-white border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-indigo-100 shadow-lg" />
                </div>
            </Carousel>
        )}
      </div>
    </section>
  );
};

export default CategoryCarousel;
