"use client";

import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { Briefcase, Building2, Users, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminJobsTable from '@/components/admin/AdminJobsTable';

const AdminDashboard = () => {
    useGetAllAdminJobs();
    useGetAllCompanies();

    const { allAdminJobs } = useSelector((store: RootState) => store.job);
    const { companies } = useSelector((store: RootState) => store.company);

    const stats = useMemo(() => {
        const totalApplications = allAdminJobs.reduce((acc, job) => acc + (job.applications?.length || 0), 0);
        return [
            {
                title: "Total Companies",
                value: companies.length,
                icon: <Building2 className="text-blue-600" size={24} />,
                color: "bg-blue-50 border-blue-100",
                description: "Registered organizations"
            },
            {
                title: "Jobs Posted",
                value: allAdminJobs.length,
                icon: <Briefcase className="text-pink-600" size={24} />,
                color: "bg-pink-50 border-pink-100",
                description: "Active & closed listings"
            },
            {
                title: "Total Applicants",
                value: totalApplications,
                icon: <Users className="text-indigo-600" size={24} />,
                color: "bg-indigo-50 border-indigo-100",
                description: "Across all job listings"
            },
            {
                title: "Growth",
                value: "+12%",
                icon: <TrendingUp className="text-green-600" size={24} />,
                color: "bg-green-50 border-green-100",
                description: "Monthly increase"
            }
        ];
    }, [allAdminJobs, companies]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8faff] via-[#f0f4ff] to-[#f9fafe] p-6 lg:p-12 text-gray-800">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
                    <div>
                        <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight">Recruiter Dashboard</h1>
                        <p className="text-indigo-600 font-medium mt-1">Welcome back! Here's what's happening with your hiring today.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-indigo-100">
                        <Calendar className="text-indigo-500" size={18} />
                        <span className="text-sm font-semibold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`${stat.color} border-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-2xl`}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-bold text-gray-600 uppercase tracking-wider">{stat.title}</CardTitle>
                                    <div className="p-2 bg-white rounded-lg shadow-sm">{stat.icon}</div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-extrabold text-gray-900">{stat.value}</div>
                                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-indigo-50 overflow-hidden animate-fadeInUp">
                    <div className="px-8 py-6 border-b border-indigo-50 flex items-center justify-between bg-indigo-50/30">
                        <h2 className="text-2xl font-bold text-indigo-900">Recent Job Postings</h2>
                    </div>
                    <div className="p-4 md:p-8 overflow-x-auto">
                        <AdminJobsTable />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
