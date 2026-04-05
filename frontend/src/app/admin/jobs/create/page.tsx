"use client";

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { RootState } from '@/redux/store';

const PostJobPage = () => {
  const [input, setInput] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: '',
    experience: '',
    position: 0,
    companyId: '',
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { companies } = useSelector((store: RootState) => store.company);

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selectChangeHandler = (value: string) => {
    const selectedCompany = companies.find((c: any) => c.name.toLowerCase() === value);
    setInput((prev) => ({ ...prev, companyId: selectedCompany?._id || '' }));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        router.push('/admin/jobs');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f5f8fb] via-[#e7edf4] to-[#d7dee8] text-gray-900">
      <div className="flex-grow flex justify-center w-full px-6 py-12">
        <form
          onSubmit={submitHandler}
          className="max-w-4xl w-full bg-white rounded-xl p-12 shadow-lg border border-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-8"
        >
          {[
            { label: 'Job Title', name: 'title', placeholder: 'e.g., Frontend Developer' },
            { label: 'Description', name: 'description', placeholder: 'Brief job description' },
            { label: 'Requirements', name: 'requirements', placeholder: 'Skills, qualifications' },
            { label: 'Salary', name: 'salary', placeholder: 'e.g., ₹30,000 - ₹50,000' },
            { label: 'Location', name: 'location', placeholder: 'City, State' },
            { label: 'Job Type', name: 'jobType', placeholder: 'Full-time, Part-time' },
            { label: 'Experience Level', name: 'experience', placeholder: 'e.g., 2+ years' },
            { label: 'No. of Positions', name: 'position', type: 'number', min: 1 },
          ].map(({ label, name, ...rest }) => (
            <div key={name}>
              <Label htmlFor={name} className="font-semibold text-gray-800 mb-1 block">
                {label}
              </Label>
              <Input
                id={name}
                name={name}
                type={rest.type || 'text'}
                min={rest.min}
                value={(input as any)[name]}
                onChange={changeEventHandler}
                placeholder={(rest as any).placeholder}
                className="mt-1 bg-gray-100 border border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                disabled={loading}
                required
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <Label className="font-semibold mb-2 block text-gray-800">Select Company</Label>
            {companies.length > 0 ? (
              <Select onValueChange={selectChangeHandler} disabled={loading}>
                <SelectTrigger className="w-full max-w-md bg-gray-100 border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-indigo-500">
                  <SelectValue placeholder="Select a Company" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border border-gray-300 rounded-md shadow-lg">
                  <SelectGroup>
                    {companies.map((company: any) => (
                      <SelectItem
                        key={company._id}
                        value={company.name.toLowerCase()}
                        className="capitalize hover:bg-indigo-50"
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-red-600 mt-2 font-medium">
                * Please register a company first before posting jobs.
              </p>
            )}
          </div>

          <div className="sm:col-span-2 mt-6">
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors"
              disabled={loading || companies.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post New Job'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
