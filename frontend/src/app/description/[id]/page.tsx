"use client";

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setSingleJob } from '@/redux/jobSlice';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  CalendarDays,
  Users,
  Wallet,
  ListChecks
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { RootState } from '@/redux/store';

const InfoRow = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string | undefined }) => (
  <div className="flex items-start gap-3">
    {icon}
    <div>
      <h2 className="font-semibold">{title}:</h2>
      <p className="text-gray-600">{value || 'N/A'}</p>
    </div>
  </div>
);

const JobDescriptionPage = () => {
  const { singleJob } = useSelector((store: RootState) => store.job);
  const { user } = useSelector((store: RootState) => store.auth);
  
  const params = useParams();
  const jobId = params.id as string;
  
  const isInitiallyApplied = singleJob?.applications?.some((app: any) => app.applicant === user?._id) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }]
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(res.data.job.applications.some((app: any) => app.applicant === user?._id));
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (jobId) {
        fetchSingleJob();
    }
  }, [jobId, dispatch, user?._id]);

  return (
    <motion.div
      className="w-full min-h-screen px-4 sm:px-6 md:px-8 py-12 bg-gradient-to-br from-[#fdfbff] via-[#f4f6fc] to-[#eef1f8] text-gray-800"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="bg-white p-10 rounded-3xl shadow-xl border border-indigo-100 max-w-6xl mx-auto grid md:grid-cols-3 gap-12"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
      
        <div className="col-span-1 flex flex-col items-center gap-6">
          <Avatar className="w-24 h-24 bg-white border border-gray-200 shadow p-2">
            <AvatarImage src={singleJob?.company?.logo} alt={singleJob?.company?.name} className="object-contain" />
            <AvatarFallback className="text-2xl text-indigo-700 font-semibold bg-indigo-50">
              {singleJob?.company?.name?.charAt(0) || 'C'}
            </AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h1 className="text-lg font-semibold text-indigo-700">{singleJob?.company?.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{singleJob?.location}</p>
          </div>

          <div className="space-y-2 text-sm">
            <Badge className="text-blue-600 font-semibold bg-blue-100 border border-blue-200">
              {singleJob?.position} Position{Number(singleJob?.position || 0) > 1 ? 's' : ''}
            </Badge>
            <Badge className="text-green-600 font-semibold bg-green-100 border border-green-200">
              {singleJob?.jobType}
            </Badge>
            <Badge className="text-purple-600 font-semibold bg-purple-100 border border-purple-200">
              ₹ {singleJob?.salary} LPA
            </Badge>
          </div>

          {user?.role !== 'recruiter' && (
            <motion.div whileHover={{ scale: isApplied ? 1 : 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
              <Button
                onClick={isApplied ? undefined : applyJobHandler}
                disabled={isApplied}
                className={`w-full rounded-full px-6 py-2 font-medium text-white transition-all duration-300 ${
                  isApplied
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:brightness-110'
                }`}
              >
                {isApplied ? '✅ Applied' : 'Apply Now'}
              </Button>
            </motion.div>
          )}
        </div>

        
        <div className="col-span-2">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{singleJob?.title}</h1>

            <div className="text-sm text-indigo-700 font-medium mb-2">
              Company: {singleJob?.company?.name}
            </div>

           
            {singleJob?.description && (
              <div className="mt-3">
                <h2 className="font-semibold text-gray-800 mb-2">Description:</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700 leading-relaxed">
                  {singleJob?.description?.split('\n').map((line: string, idx: number) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

         
          <div className="space-y-6 text-sm text-gray-700">
            <InfoRow icon={<Briefcase className="text-indigo-600" size={20} />} title="Role" value={singleJob?.title} />
            <InfoRow icon={<MapPin className="text-indigo-600" size={20} />} title="Location" value={singleJob?.location} />
            <InfoRow icon={<Wallet className="text-indigo-600" size={20} />} title="Salary" value={`₹ ${singleJob?.salary} LPA`} />
            <InfoRow icon={<Users className="text-indigo-600" size={20} />} title="Applicants" value={`${singleJob?.applications?.length || 0}`} />
            <InfoRow icon={<CalendarDays className="text-indigo-600" size={20} />} title="Posted On" value={singleJob?.createdAt?.split('T')[0]} />
            <InfoRow icon={<ListChecks className="text-indigo-600" size={20} />} title="Experience Required" value={`${singleJob?.experienceLevel} years`} />
          </div>

     
          {singleJob?.requirements?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-md font-semibold mb-2 text-gray-800 flex items-center gap-2">
                <ListChecks size={18} className="text-indigo-600" /> Requirements
              </h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {singleJob.requirements.map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JobDescriptionPage;
