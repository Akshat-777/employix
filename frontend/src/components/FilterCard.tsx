"use client";

import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useEffect } from 'react';

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    array: ["5 - 10 LPA", "10 - 30 LPA", "30 - 60 LPA"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const dispatch = useDispatch();

  const changeHandler = (value: string) => setSelectedValue(value);

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-indigo-100 to-blue-50 text-gray-800 border border-indigo-200 rounded-2xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">🎯 Filter Jobs</h2>
      <hr className="border-indigo-300 mb-4" />

      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {filterData.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-800">{section.filterType}</h3>
            <div className="space-y-3">
              {section.array.map((item, idx) => {
                const id = `radio-${index}-${idx}`;
                return (
                  <div
                    key={id}
                    className="flex items-center space-x-3 hover:scale-[1.01] transition-transform duration-300"
                  >
                    <RadioGroupItem
                      id={id}
                      value={item}
                      className="w-5 h-5 border-2 border-indigo-500 rounded-full data-[state=checked]:bg-indigo-600 focus:outline-none transition"
                    />
                    <Label
                      htmlFor={id}
                      className="cursor-pointer text-gray-700 hover:text-indigo-600 transition duration-300"
                    >
                      {item}
                    </Label>
                  </div>
                );
              })}
            </div>
            {index !== filterData.length - 1 && (
              <hr className="my-4 border-indigo-200" />
            )}
          </div>
        ))}
      </RadioGroup>

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FilterCard;
