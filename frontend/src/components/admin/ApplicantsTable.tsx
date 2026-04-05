"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';

const shortlistingStatus = ['Accepted', 'Rejected'];

const statusColors: Record<string, string> = {
  Accepted: 'bg-green-100 text-green-700 hover:bg-green-200',
  Rejected: 'bg-red-100 text-red-700 hover:bg-red-200',
};

const badgeColors: Record<string, string> = {
  Accepted: 'bg-green-600 text-white',
  Rejected: 'bg-red-600 text-white',
};

const ApplicantsTable = () => {
  const { applicants } = useSelector((store: RootState) => store.application);
  const router = useRouter();

  const statusHandler = async (status: string, id: string, currentStatus: string | null) => {
    if (['Accepted', 'Rejected'].includes(currentStatus || '')) {
      toast.warning('Status is already finalized and cannot be changed.');
      return;
    }

    try {
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, {
          withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message);
        // Page likely needs manual refresh or Redux sync if not using RTK Query
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-[#cdd7e8] bg-[#f8faff] shadow-md animate-fadeIn">
      <Table>
        <TableCaption className="text-left text-gray-500 text-sm px-4 py-2">
          A list of your recent applicants.
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-[#e8efff] text-[#1e293b] font-semibold text-sm border-b border-[#cdd7e8]">
            <TableHead className="px-4 py-3">Full Name</TableHead>
            <TableHead className="px-4 py-3">Email</TableHead>
            <TableHead className="px-4 py-3">Contact</TableHead>
            <TableHead className="px-4 py-3">Resume</TableHead>
            <TableHead className="px-4 py-3">Applied Date</TableHead>
            <TableHead className="px-4 py-3">Status</TableHead>
            <TableHead className="px-4 py-3 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {applicants?.applications?.length ? (
            applicants.applications.map((item: any) => {
              const jobId = typeof item?.job === 'string' ? item.job : item?.job?._id;
              const applicantId = item?.applicant?._id;
              const recruiterId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
              const currentStatus = item?.status;

              const displayStatus =
                currentStatus?.toLowerCase() === 'accepted'
                  ? 'Accepted'
                  : currentStatus?.toLowerCase() === 'rejected'
                  ? 'Rejected'
                  : null;

              return (
                <TableRow key={item._id} className="hover:bg-[#eef4ff] text-[#475569] transition">
                  <TableCell className="px-4 py-3 font-medium">{item?.applicant?.fullname}</TableCell>
                  <TableCell className="px-4 py-3 break-words max-w-xs">{item?.applicant?.email}</TableCell>
                  <TableCell className="px-4 py-3">{item?.applicant?.phoneNumber}</TableCell>
                  <TableCell className="px-4 py-3">
                    {item.applicant?.profile?.resume ? (
                      <a
                        className="text-indigo-600 hover:underline"
                        href={item.applicant.profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={item.applicant.profile.resumeOriginalName}
                      >
                        {item.applicant.profile.resumeOriginalName}
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {item?.applicant?.createdAt
                      ? new Date(item.applicant.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    {displayStatus ? (
                      <span
                        className={`px-3 py-1 text-sm rounded-full font-semibold ${badgeColors[displayStatus]}`}
                      >
                        {displayStatus}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="p-1 text-gray-600 hover:text-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="More actions"
                            disabled={displayStatus === 'Accepted' || displayStatus === 'Rejected'}
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-40 bg-white border border-gray-200 rounded-md shadow-lg p-2"
                          align="end"
                        >
                          {shortlistingStatus.map((status) => (
                            <div
                              key={status}
                              onClick={() => statusHandler(status, item._id, displayStatus)}
                              className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer text-center transition ${statusColors[status]}`}
                            >
                              {status}
                            </div>
                          ))}
                        </PopoverContent>
                      </Popover>

                      <button
                        className="px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                        onClick={() => {
                          if (jobId && recruiterId && applicantId) {
                            router.push(`/chat/${jobId}/${recruiterId}/${applicantId}`);
                          } else {
                            toast.error('Missing job, recruiter, or applicant ID');
                          }
                        }}
                      >
                        Chat
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-gray-400">
                No applicants found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
