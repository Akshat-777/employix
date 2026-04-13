"use client";

import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterParams, clearFilters } from '@/redux/jobSlice';
import { RootState } from '@/redux/store';
import { Button } from './ui/button';
import { XCircle } from 'lucide-react';

const DEFAULT_FILTER_PARAMS = { Location: '', Industry: '', Salary: '' };

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
  const dispatch = useDispatch();
  const { filterParams: filterParamsFromStore } = useSelector((store: RootState) => store.job);
  const filterParams = filterParamsFromStore || DEFAULT_FILTER_PARAMS;

  const changeHandler = (category: string, value: string) => {
    dispatch(setFilterParams({ category, value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-indigo-100 to-blue-50 text-gray-800 border border-indigo-200 rounded-2xl shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-4">
         <h2 className="text-2xl font-bold text-indigo-700">🎯 Filter Jobs</h2>
         <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilters}
            className="text-gray-500 hover:text-red-500 hover:bg-red-50 gap-1"
          >
            <XCircle size={16} /> 
            <span className="text-xs">Clear</span>
         </Button>
      </div>
      <hr className="border-indigo-300 mb-4" />

      {filterData.map((section, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">{section.filterType}</h3>
          <RadioGroup 
            value={filterParams[section.filterType as keyof typeof filterParams]} 
            onValueChange={(value) => changeHandler(section.filterType, value)}
          >
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
                      className="w-5 h-5 border-2 border-indigo-500 rounded-full data-[state=checked]:bg-indigo-600 focus:outline-none transition shrink-0"
                    />
                    <Label
                      htmlFor={id}
                      className="cursor-pointer text-gray-700 hover:text-indigo-600 transition duration-300 text-sm font-medium"
                    >
                      {item}
                    </Label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
          {index !== filterData.length - 1 && (
            <hr className="my-4 border-indigo-200" />
          )}
        </div>
      ))}

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
