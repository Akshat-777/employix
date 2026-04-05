"use client";

import React, { useEffect } from 'react';
import ApplicantsTable from '@/components/admin/ApplicantsTable';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { RootState } from '@/redux/store';

const ApplicantsPage = () => {
  const params = useParams();
  const id = params.id as string;
  const dispatch = useDispatch();
  const { applicants } = useSelector((store: RootState) => store.application);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/${id}/applicants`, {
          withCredentials: true,
        });
        dispatch(setAllApplicants(res.data.job));
      } catch (error) {
        console.error('Failed to fetch applicants:', error);
      }
    };
    if (id) {
        fetchAllApplicants();
    }
  }, [id, dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f6fb] via-[#e7edf6] to-[#dde6f2] text-[#1e293b]">
      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 animate-fadeIn transition-all">
        <div className="bg-white border border-[#d6deeb] shadow-xl rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1e293b]">Applicants</h1>
            <span className="text-indigo-600 text-lg font-semibold bg-indigo-100 px-3 py-1 rounded-full">
              {applicants?.applications?.length ?? 0}
            </span>
          </div>

          <ApplicantsTable />
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ApplicantsPage;
