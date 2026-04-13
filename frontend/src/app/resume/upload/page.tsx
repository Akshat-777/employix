"use client";

import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setResumeAnalysis } from "@/redux/resumeSlice";
import MatchedJobs from "@/components/MatchedJobs";
import { RootState } from "@/redux/store";
import { toast } from "sonner";

const UploadResumePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const dispatch = useDispatch();
  const { extractedSkills, recommendedJobs } = useSelector(
    (state: RootState) => state.resume
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setAnalyzed(false);
  };

  const handleUpload = async () => {
    if (!file) {
        toast.error("Please select a PDF file");
        return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
      const res = await axios.post(
        `${apiUrl}/api/v1/upload-resume`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      dispatch(setResumeAnalysis(res.data));
      setAnalyzed(true);
      toast.success("Resume analyzed successfully!");

    } catch (error: any) {
      console.error("Error uploading resume:", error.response?.data || error.message);
      toast.error("Error analyzing resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 px-6 py-12 text-gray-800 animate-fadeIn">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-xl p-8 md:p-10 transition-transform hover:scale-[1.01]">
          <h2 className="text-3xl font-bold mb-4 text-indigo-700">
            Upload Your Resume
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Upload a PDF resume to extract your skills and receive tailored job recommendations.
          </p>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full mb-4 px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition"
          />

          <button
            onClick={handleUpload}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading || !file}
          >
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </button>

          {analyzed && extractedSkills?.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                Extracted Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {extractedSkills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 text-sm font-medium rounded-full bg-indigo-100 text-indigo-700 border border-indigo-300 shadow-sm hover:scale-105 transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analyzed && recommendedJobs?.length > 0 && (
            <div className="mt-12 bg-indigo-50 border border-indigo-200 rounded-2xl p-6 shadow-inner">
              <MatchedJobs />
            </div>
          )}
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out;
          }
        `}</style>
      </div>
  );
};

export default UploadResumePage;
