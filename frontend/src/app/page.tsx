"use client";

import React, { useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import CategoryCarousel from '@/components/CategoryCarousel';
import LatestJobs from '@/components/LatestJobs';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';

export default function Home() {
  useGetAllJobs();
  const { user } = useSelector((store: RootState) => store.auth);
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'recruiter') {
      router.push('/admin/companies');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf5ff] via-[#f4f8ff] to-[#e0efff] text-gray-800 animate-fadeIn transition-all duration-500">
      
      <section className="px-4 sm:px-6 lg:px-16 pt-12 pb-20">
        <HeroSection />
      </section>

      <section className="px-4 sm:px-6 lg:px-16 py-12 bg-[#f6faff] border-y border-blue-100 shadow-sm rounded-xl mx-4 md:mx-10 my-4">
        <CategoryCarousel />
      </section>

      <section className="px-4 sm:px-6 lg:px-16 py-16 bg-gradient-to-br from-[#e0f2fe] to-[#e3ebff] rounded-t-3xl shadow-inner mt-10">
        <LatestJobs />
      </section>

      <style>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
}
