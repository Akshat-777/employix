"use client";

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreVertical, Users, ExternalLink, Briefcase } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';
import { Badge } from '../ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store: RootState) => store.job);
  const { user } = useSelector((store: RootState) => store.auth);
  const [filterJobs, setFilterJobs] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const filteredJobs = allAdminJobs.filter((job: any) => {
      const matchesSearch =
        !searchJobByText ||
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase());

      const isCreatedByUser =
        job?.created_by === user._id || job?.created_by?._id === user._id;

      return matchesSearch && isCreatedByUser;
    });

    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText, user]);

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-b border-slate-100">
            <TableHead className="w-[250px] font-bold text-slate-500 uppercase tracking-wider text-[10px] py-5 px-8">Company / Organization</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px] py-5 px-6">Position / Role</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px] py-5 px-6">Post Date</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px] py-5 px-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <AnimatePresence>
            {filterJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Briefcase size={40} className="mb-4 opacity-20" />
                    <p className="font-medium">No job postings found</p>
                    <p className="text-sm opacity-60">Try adjusting your search or post a new job.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filterJobs.map((job: any, index: number) => (
                <motion.tr
                  key={job._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-indigo-50/30 transition-all border-b border-slate-50 last:border-0"
                >
                  <TableCell className="py-5 px-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm shadow-sm group-hover:bg-white transition-colors">
                            {job?.company?.name?.charAt(0) || 'C'}
                        </div>
                        <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {job?.company?.name || 'Untitled'}
                        </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{job?.title}</span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">Full Time</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-6 text-slate-500 font-medium">
                    {job?.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </TableCell>
                  <TableCell className="py-5 px-6 text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="w-10 h-10 inline-flex items-center justify-center rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-indigo-600 transition-all"
                        >
                          <MoreVertical size={20} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2 bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col gap-1 -translate-x-2 animate-fadeIn">
                        <button
                          onClick={() => router.push(`/admin/jobs/${job._id}`)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition-all text-sm font-bold"
                        >
                          <Edit2 size={16} /> Edit Details
                        </button>
                        <button
                          onClick={() => router.push(`/admin/jobs/${job._id}/applicants`)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition-all text-sm font-bold"
                        >
                          <Users size={16} /> View Applicants
                        </button>
                        <div className="h-px bg-slate-100 my-1 mx-2" />
                        <button
                          onClick={() => router.push(`/admin/jobs/${job._id}/show`)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition-all text-sm font-bold"
                        >
                          <ExternalLink size={16} /> Live Preview
                        </button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
