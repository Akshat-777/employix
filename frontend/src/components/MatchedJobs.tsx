"use client";

import React from 'react';
import { useSelector } from 'react-redux';
import Job from './Job';
import { RootState } from '@/redux/store';

const MatchedJobs = () => {
  const { extractedSkills, recommendedJobs } = useSelector((state: RootState) => state.resume);

  const calculateMatchScore = (jobSkills: string[]) => {
    if (!jobSkills.length) return 0;
    const matched = jobSkills.filter(skill =>
      extractedSkills.some(s => s.toLowerCase() === skill.toLowerCase())
    );
    return matched.length / jobSkills.length;
  };

  const getSkillGap = (jobSkills: string[]) => {
    return jobSkills.filter(skill =>
      !extractedSkills.some(s => s.toLowerCase() === skill.toLowerCase())
    );
  };

  if (!recommendedJobs.length) return null;

  return (
    <div className="mt-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <h3 className="text-2xl font-bold text-indigo-700 mb-6">🎯 Matching Jobs For You</h3>

      <div className="space-y-8">
        {recommendedJobs.map((job: any, index: number) => {
          const jobSkills = job.requirements || [];
          const score = calculateMatchScore(jobSkills);
          const skillGap = getSkillGap(jobSkills);

          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6"
            >
              
              <Job job={job} />

              <div className="mt-6 text-sm text-gray-700">
               
                <div className="mb-4">
                  <p className="font-medium text-gray-600 mb-1">Match Score</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all"
                      style={{ width: `${score * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-indigo-600 mt-1">{(score * 100).toFixed(1)}% match</p>
                </div>

                <div>
                  <p className="font-medium text-gray-600 mb-2">Skill Gap</p>
                  {skillGap.length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                      {skillGap.map((skill: string, i: number) => (
                        <li
                          key={i}
                          className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs border border-red-200"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-green-600">✅ No skill gaps – You&apos;re ready to apply!</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MatchedJobs;
