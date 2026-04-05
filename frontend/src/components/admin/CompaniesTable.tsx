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
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Edit2, MoreHorizontal, Briefcase } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector((store: RootState) => store.company);
  const { user } = useSelector((store: RootState) => store.auth); 
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const filtered = companies.filter((company: any) => {
      const matchesSearch =
        !searchCompanyByText || company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());

      const isCreatedByUser =
        company?.userId === user._id || company?.userId?._id === user._id;

      return matchesSearch && isCreatedByUser;
    });

    setFilteredCompanies(filtered);
  }, [companies, searchCompanyByText, user]);

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#d6d9e0] bg-[#f7f8fc] shadow-md animate-fadeIn">
      <Table className="min-w-full">
        <TableHeader className="bg-[#e9efff] border-b border-[#d6d9e0]">
          <TableRow>
            <TableHead className="text-[#444c66] font-semibold">Logo</TableHead>
            <TableHead className="text-[#444c66] font-semibold">Name</TableHead>
            <TableHead className="text-[#444c66] font-semibold">Description</TableHead>
            <TableHead className="text-[#444c66] font-semibold">Website</TableHead>
            <TableHead className="text-[#444c66] font-semibold">Location</TableHead>
            <TableHead className="text-[#444c66] font-semibold">Date</TableHead>
            <TableHead className="text-[#444c66] font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCompanies.map(company => (
            <TableRow
              key={company._id}
              className="hover:bg-[#eef3ff] transition-all duration-300"
            >
              <TableCell>
                <Avatar className="bg-white border border-gray-200 shadow-sm">
                  <AvatarImage src={company.logo} alt={company.name} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                    {company?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>

              <TableCell className="text-[#2e3252] font-medium">{company.name}</TableCell>
              <TableCell className="text-[#667085] text-sm">{company.description || '—'}</TableCell>

              <TableCell>
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4f46e5] underline hover:text-[#4338ca]"
                    onClick={e => e.stopPropagation()}
                  >
                    Visit
                  </a>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </TableCell>

              <TableCell className="text-[#5a6473] text-sm">{company.location || '—'}</TableCell>
              <TableCell className="text-[#7c869b] text-sm">
                {new Date(company.createdAt).toLocaleDateString()}
              </TableCell>

              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      onClick={e => e.stopPropagation()}
                      className="p-2 rounded-full hover:bg-[#dee6ff] transition"
                    >
                      <MoreHorizontal size={20} className="text-[#4f46e5]" />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-52 p-3 bg-white border border-gray-200 rounded-xl shadow-xl space-y-2"
                    align="end"
                  >
                    <div
                      onClick={e => {
                        e.stopPropagation();
                        router.push(`/admin/companies/${company._id}`);
                      }}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition font-medium cursor-pointer"
                    >
                      <Edit2 size={18} className="text-indigo-600" />
                      <span>Edit Company</span>
                    </div>

                    <div
                      onClick={e => {
                        e.stopPropagation();
                        router.push(`/admin/companies/${company._id}/jobs`);
                      }}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-green-700 bg-green-50 hover:bg-green-100 transition font-medium cursor-pointer"
                    >
                      <Briefcase size={18} className="text-green-600" />
                      <span>View Jobs</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}

          {filteredCompanies.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No companies found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
