"use client";

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CompaniesTable from '@/components/admin/CompaniesTable';
import { useRouter } from 'next/navigation';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { useDispatch } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice';
import { Plus } from 'lucide-react';

const AdminCompaniesPage = () => {
  useGetAllCompanies();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(''));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-[#e7ecff] to-[#f9fafe] text-gray-800">
      <div className="max-w-6xl mx-auto py-16 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-end gap-5 mb-10 animate-fadeInScale">          <Button
            onClick={() => router.push('/admin/companies/create')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md font-medium shadow-md hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            New Company
          </Button>
        </div>

        <h2 className="text-xl font-semibold text-indigo-700 mb-6 border-b border-indigo-300 pb-1">
          Registered Companies
        </h2>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition-all duration-300">
          <CompaniesTable />
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

export default AdminCompaniesPage;
