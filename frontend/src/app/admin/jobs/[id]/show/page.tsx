"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { Loader2 } from 'lucide-react';

const ShowJobPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setJob(res.data.job);
        }
      } catch (err) {
        console.error('Failed to load job details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchJob();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#e6f0ff] to-[#f9fbff] text-indigo-700">
        <Loader2 className="animate-spin h-6 w-6 mr-2" />
        <span className="text-lg font-medium tracking-wide">Loading job...</span>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#e6f0ff] to-[#f9fbff]">
        <p className="text-red-600 text-lg font-semibold">❌ Job not found or failed to load.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#e6f0ff] to-[#f9fbff]">
      <div className="flex-grow px-6 py-10 animate-fadeIn">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-indigo-800 mb-6 tracking-tight">{job.title}</h1>

          <section className="space-y-5 text-gray-700 text-base leading-relaxed">
            <div className="flex flex-wrap gap-6 mb-6">
              <InfoLabel label="Company" value={job.company?.name} />
              <InfoLabel label="Location" value={job.location} />
              <InfoLabel label="Salary" value={`₹${job.salary} LPA`} />
              <InfoLabel label="Job Type" value={job.jobType} />
              <InfoLabel label="Experience Level" value={`${job.experienceLevel} years`} />
              <InfoLabel label="Open Positions" value={job.position} />
            </div>

            <div>
              <p className="text-indigo-900 font-semibold text-lg mb-1">Job Description</p>
              <p className="whitespace-pre-line text-gray-600">{job.description}</p>
            </div>

            <div>
              <p className="text-indigo-900 font-semibold text-lg mb-1">Required Skills</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {Array.isArray(job.requirements)
                  ? job.requirements.map((req: string, i: number) => <li key={i}>{req}</li>)
                  : <li>{job.requirements}</li>}
              </ul>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

const InfoLabel = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col min-w-[120px]">
    <span className="text-indigo-700 font-semibold">{label}:</span>
    <span className="text-gray-800 font-medium">{value || '—'}</span>
  </div>
);

export default ShowJobPage;
