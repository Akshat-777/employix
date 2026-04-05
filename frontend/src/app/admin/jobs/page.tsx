"use client";

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import AdminJobsTable from '@/components/admin/AdminJobsTable';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import { setSearchJobByText } from '@/redux/jobSlice';
import { Plus } from 'lucide-react'; 

const AdminJobsPage = () => {
  useGetAllAdminJobs();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(''));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7faff] to-[#e5edfb] text-gray-900 animate-fadeIn">
      <div className="max-w-6xl mx-auto my-14 px-6">
        <div className="flex flex-col sm:flex-row items-center justify-end gap-5 mb-10 animate-fadeInScale">          <Button
            onClick={() => router.push('/admin/jobs/create')}
            className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:brightness-110 text-white px-6 py-2 rounded-md font-medium shadow-md hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <Plus size={18} /> New Job
          </Button>
        </div>

        <h2 className="text-xl font-semibold text-indigo-700 mb-6 border-b border-indigo-300 pb-1">
          Recently Posted Jobs
        </h2>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 hover:shadow-xl transition-all duration-300">
          <AdminJobsTable />
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminJobsPage;
