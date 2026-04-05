"use client";

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';

const CompanyCreatePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error('Please enter a company name.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName: companyName.trim() },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id;
        router.push(`/admin/companies/${companyId}`);
      } else {
        toast.error(res?.data?.message || 'Failed to create company.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f2f5ff] via-[#edf1fa] to-[#e5e9f0] text-[#2e3252]">
      <div className="flex-grow max-w-3xl mx-auto px-6 py-14 animate-fadeIn">
        <h1 className="text-3xl font-bold mb-2 tracking-tight text-[#1e2454]">Name Your Company</h1>
        <p className="text-[#5a6473] mb-8">
          What would you like to name your company? You can always change this later.
        </p>

        <div className="mb-6">
          <Label htmlFor="companyName" className="block mb-2 font-medium text-[#3b425c]">
            Company Name
          </Label>
          <Input
            id="companyName"
            type="text"
            value={companyName}
            placeholder="JobHunt, Microsoft, etc."
            onChange={(e) => setCompanyName(e.target.value)}
            className="bg-white border border-[#ccd4e1] text-[#2e3252] placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 rounded-md shadow-sm"
            disabled={loading}
            autoFocus
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/companies')}
            disabled={loading}
            className="border border-gray-400 text-red-500 hover:text-white hover:bg-red-500 transition rounded-md"
          >
            Cancel
          </Button>
          <Button
            onClick={registerNewCompany}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-md"
          >
            {loading ? 'Creating...' : 'Continue'}
          </Button>
        </div>
      </div>

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
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CompanyCreatePage;
