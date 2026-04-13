"use client";

import React, { useState, useRef } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Contact, Mail, Pen, FileText, Download, ExternalLink, Sparkles, Loader2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AppliedJobTable from '@/components/AppliedJobTable';
import UpdateProfileDialog from '@/components/UpdateProfileDialog';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import { RootState } from '@/redux/store';
import { motion } from 'framer-motion';
import axios from 'axios';
import { USER_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { setUser } from '@/redux/authSlice';
import { setAllJobs } from '@/redux/jobSlice';
import { useEffect } from 'react';

const ProfilePage = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useSelector((store: RootState) => store.auth);
  const { allJobs } = useSelector((store: RootState) => store.job);
  const dispatch = useDispatch();
  const router = useRouter();

  // Fetch all jobs if not already present (needed for saved jobs full data)
  useEffect(() => {
    if (allJobs.length === 0) {
      const fetchJobs = async () => {
        try {
          const res = await axios.get(`${JOB_API_END_POINT}/get`, { withCredentials: true });
          if (res.data.success) {
            dispatch(setAllJobs(res.data.jobs));
          }
        } catch (error) {
          console.error("Error fetching jobs for profile:", error);
        }
      };
      fetchJobs();
    }
  }, [allJobs.length, dispatch]);

  const savedJobs = allJobs.filter(job => 
    user?.profile?.savedJobs?.includes(job._id)
  );

  const handlePhotoUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max size is 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setPhotoLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/profile/photo/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Something went wrong while updating photo');
    } finally {
      setPhotoLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-900 pb-20">
      <main className="max-w-5xl mx-auto px-4 pt-12">
        {/* Profile Card */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 p-8 md:p-12 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-pink-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                    <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-4 ring-indigo-50 shadow-xl transition-transform duration-500 group-hover:scale-105">
                        <AvatarImage
                            src={user?.profile?.profilePhoto || 'https://via.placeholder.com/150'}
                            alt="profile"
                            className="object-cover"
                        />
                    </Avatar>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={photoLoading}
                      className="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg border-2 border-white transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
                    >
                        {photoLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    </button>
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      accept="image/*" 
                      onChange={handlePhotoUpdate}
                    />
                </div>
                
                <div className="text-center md:text-left">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                    {user?.fullname}
                  </h1>
                  <p className="text-lg text-indigo-600 font-medium max-w-md leading-relaxed">
                    {user?.profile?.bio || 'Professional Developer looking for new challenges.'}
                  </p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                    <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 text-sm font-medium">
                        <Mail size={14} className="text-indigo-400" />
                        {user?.email}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 text-sm font-medium">
                        <Contact size={14} className="text-indigo-400" />
                        {user?.phoneNumber}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 h-12 shadow-lg shadow-indigo-100 transition-all active:scale-95 group"
              >
                <Pen size={18} className="mr-2 group-hover:rotate-12 transition-transform" />
                Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
              {/* Skills */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Sparkles size={18} className="text-indigo-600" />
                    </div>
                    Expertise & Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {user?.profile?.skills && user?.profile?.skills.length > 0 ? (
                    user.profile.skills.map((skill: string, idx: number) => (
                      <Badge
                        key={idx}
                        className="px-4 py-2 rounded-xl bg-white text-indigo-700 font-semibold border-2 border-indigo-50 transition-all hover:border-indigo-200 hover:bg-indigo-50/30"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-slate-400 italic bg-slate-50 px-4 py-2 rounded-xl border border-dashed border-slate-200">No skills listed yet</span>
                  )}
                </div>
              </div>

              {/* Resume */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center">
                        <FileText size={18} className="text-pink-600" />
                    </div>
                    Professional Resume
                </h2>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  {user?.profile?.resume ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                          <FileText className="text-indigo-600" size={24} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{user.profile.resumeOriginalName || 'Resume.pdf'}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Ready for download</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            className="flex-1 bg-white border-slate-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                            asChild
                        >
                          <a href={user.profile.resume} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={16} className="mr-2" /> View
                          </a>
                        </Button>
                        <Button 
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all active:scale-95"
                            asChild
                        >
                          <a href={user.profile.resume} download={user.profile.resumeOriginalName}>
                            <Download size={16} className="mr-2" /> Get Copy
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                        <p className="text-slate-400 font-medium mb-4 italic">No resume uploaded</p>
                        <Button variant="outline" onClick={() => setOpen(true)} className="rounded-xl border-dashed border-2 hover:border-indigo-400 hover:text-indigo-600">
                            Upload Now
                        </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Applied Jobs Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-50"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Applications</h2>
            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold px-3 py-1">Active Tracker</Badge>
          </div>
          <AppliedJobTable />
        </motion.div>

        {/* Saved Jobs Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-50 min-h-[300px]"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Saved Jobs</h2>
            <Badge className="bg-pink-50 text-pink-700 border-pink-100 font-bold px-3 py-1">Personal Collection</Badge>
          </div>
          
          {savedJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-400 font-medium">No jobs saved for later yet.</p>
              <Button 
                variant="link" 
                onClick={() => router.push('/jobs')}
                className="text-indigo-600 mt-2"
              >
                Browse latest jobs
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedJobs.map((job: any) => (
                <div key={job._id} className="relative group">
                    <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur opacity-0 group-hover:opacity-10 transition-opacity" />
                    <div 
                      onClick={() => router.push(`/description/${job._id}`)}
                      className="relative p-6 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:border-indigo-100 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <Avatar className="h-10 w-10 border border-white shadow-sm">
                              <AvatarImage src={job?.company?.logo} />
                           </Avatar>
                           <div>
                              <h3 className="font-bold text-slate-900 leading-tight">{job?.title}</h3>
                              <p className="text-xs text-indigo-600 font-medium">{job?.company?.name}</p>
                           </div>
                        </div>
                        <Badge variant="outline" className="bg-white text-[10px] uppercase tracking-tighter">{job?.jobType}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {job?.location}</span>
                        <span className="text-indigo-700">₹ {job?.salary} LPA</span>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default ProfilePage;
