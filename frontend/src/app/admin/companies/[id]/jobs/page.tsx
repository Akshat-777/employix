"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";

const CompanyJobsPage = () => {
  const params = useParams();
  const companyId = params.id as string;
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;

    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/company/${companyId}/jobs`, {
          withCredentials: true,
        });
        setJobs(res.data.jobs || []);
      } catch (error) {
        console.error("❌ Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [companyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fdfefe] via-[#f4f9fd] to-[#e8f1fa] text-gray-700 flex justify-center items-center">
        <p className="text-lg font-medium">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdfefe] via-[#f2f7fb] to-[#e4ecf5] text-gray-800">
      <main className="flex-grow px-6 py-10 animate-fadeIn">
        <h2 className="text-4xl font-bold mb-8 text-blue-600 tracking-wide border-b border-gray-300 pb-3">
          🏢 Jobs Posted by Company
        </h2>

        {jobs.length === 0 ? (
          <p className="text-gray-500 text-lg">No jobs found for this company.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-1 tracking-wide">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3 italic">
                  {job.company?.name || "—"}
                </p>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {job.description}
                </p>

                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong className="text-gray-700">📍 Location:</strong> {job.location}</li>
                  <li><strong className="text-gray-700">🕒 Type:</strong> {job.jobType}</li>
                  <li><strong className="text-gray-700">🎯 Experience:</strong> {job.experienceLevel} years</li>
                  <li><strong className="text-gray-700">💼 Openings:</strong> {job.position}</li>
                  <li><strong className="text-gray-700">💰 Salary:</strong> ₹{job.salary} LPA</li>
                  <li><strong className="text-gray-700">🧠 Skills:</strong> {job.requirements?.join(", ")}</li>
                  <li><strong className="text-gray-700">📅 Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}</li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CompanyJobsPage;
