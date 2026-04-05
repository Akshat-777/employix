"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';
import { MessageSquare, Calendar, Briefcase, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store: RootState) => store.job);
  const { user } = useSelector((store: RootState) => store.auth);
  const router = useRouter();

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-b border-slate-100">
            <TableHead className="w-[180px] font-bold text-slate-500 uppercase tracking-wider text-[10px] py-5 px-8">Application Date</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px] py-5 px-6">Opportunity</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px] py-5 px-6 text-center">Current Status</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px] py-5 px-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Briefcase size={40} className="mb-4 opacity-20" />
                    <p className="font-medium">No applications found</p>
                    <p className="text-sm opacity-60">Explore openings and apply to land your dream job.</p>
                  </div>
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob: any, index: number) => (
              <motion.tr
                key={appliedJob._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group hover:bg-indigo-50/30 transition-all border-b border-slate-50 last:border-0"
              >
                <TableCell className="py-5 px-8">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Calendar size={14} className="text-indigo-400" />
                    {appliedJob?.createdAt?.split('T')[0]}
                  </div>
                </TableCell>
                <TableCell className="py-5 px-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                        {appliedJob.job?.title}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                        <Building2 size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-500 font-medium">{appliedJob.job?.company?.name}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-5 px-6 text-center text-right">
                  <Badge
                    className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm border-none ${
                      appliedJob.status === 'rejected'
                        ? 'bg-rose-100 text-rose-600'
                        : appliedJob.status === 'pending'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-emerald-100 text-emerald-600'
                    }`}
                  >
                    {appliedJob.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-5 px-6 text-right">
                  {appliedJob.job?.company?.userId ? (
                    <button
                      onClick={() =>
                        router.push(`/chat/${appliedJob.job._id}/${appliedJob.job.company.userId}/${user?._id}`)
                      }
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95 group/btn"
                    >
                       <MessageSquare size={14} className="group-hover/btn:rotate-12 transition-transform" />
                       Chat Recruiter
                    </button>
                  ) : (
                    <span className="text-xs text-slate-300 font-bold italic uppercase tracking-widest">Self-Service</span>
                  )}
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
