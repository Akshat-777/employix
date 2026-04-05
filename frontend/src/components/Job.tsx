"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setUser } from '@/redux/authSlice';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

interface JobProps {
  job: {
    _id: string;
    title: string;
    description: string;
    location?: string;
    requirements?: string[];
    position?: number | string;
    jobType?: string;
    salary?: number | string;
    createdAt: string;
    company?: {
      name: string;
      logo?: string;
    };
  };
}

const Job = ({ job }: JobProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((store: RootState) => store.auth);
  const [loading, setLoading] = useState(false);

  const isSaved = user?.profile?.savedJobs?.includes(job?._id);

  const handleSaveForLater = async () => {
    if (!user) {
      toast.error('Please login to save jobs.');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/profile/save-job/${job._id}`, {}, {
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const daysAgoFunction = (mongodbTime: string) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - createdAt.getTime();
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-6 rounded-2xl bg-[#f7faff] border border-blue-100 text-gray-800 shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.02] duration-300 animate-fadeIn">
     
      <div className="flex items-center justify-between text-sm text-gray-500">
        <p>
          {daysAgoFunction(job?.createdAt) === 0
            ? 'Posted Today'
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
      </div>

      
      <div className="flex items-center gap-4 mt-4 mb-5">
        <Avatar className="w-12 h-12 bg-white border border-gray-200 p-1">
          <AvatarImage src={job?.company?.logo} alt="logo" className="object-contain" />
          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
            {job?.company?.name?.charAt(0)?.toUpperCase() || 'C'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-md font-semibold text-blue-700">
            {job?.company?.name}
          </h2>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-indigo-500" />
            {job?.location || 'Location not specified'}
          </p>
        </div>
      </div>

    
      <div className="mb-3">
        <h1 className="text-lg font-bold text-gray-900">{job?.title}</h1>
        <p className="text-sm text-gray-600 mt-1 line-clamp-3">{job?.description}</p>
      </div>

      
      <div className="flex flex-wrap gap-2 mt-3">
        <Badge className="text-blue-600 font-medium bg-blue-100 border border-blue-200">
          {job?.position} {Number(job?.position || 0) > 1 ? 'Positions' : 'Position'}
        </Badge>
        <Badge className="text-green-600 font-medium bg-green-100 border border-green-200">
          {job?.jobType}
        </Badge>
        <Badge className="text-purple-600 font-medium bg-purple-100 border border-purple-200">
          ₹ {job?.salary} LPA
        </Badge>
      </div>

      
      {job?.requirements && job?.requirements.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {job.requirements.map((req, index) => (
            <Badge
              key={index}
              className="bg-gray-100 text-gray-700 border border-gray-300 rounded-full text-xs"
            >
              {req.trim()}
            </Badge>
          ))}
        </div>
      )}

      
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button
          onClick={() => router.push(`/description/${job?._id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-full transition"
        >
          View Details
        </Button>
        <Button
          variant={isSaved ? "default" : "outline"}
          onClick={handleSaveForLater}
          disabled={loading}
          className={`rounded-full transition-all duration-300 ${
            isSaved 
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200" 
              : "border-blue-500 text-blue-600 hover:bg-blue-50"
          }`}
        >
          {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
          {isSaved ? "Saved" : "Save for Later"}
        </Button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Job;
