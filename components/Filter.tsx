"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  filterKey: string;
  filterDisplayKey?: string;
  placeholder?: string;
  filterOptions: string[];
}

const Filter: React.FC<Props> = ({
  filterKey,
  filterDisplayKey,
  placeholder,
  filterOptions,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the current value from URL params
  const currentValue = searchParams.get(filterKey) || "";

  const handleFilterChange = (value: string) => {
    // Create new URLSearchParams from current search params
    const params = new URLSearchParams(searchParams);

    if (value) {
      // Set the filter parameter
      params.set(filterKey, value);
    } else {
      // Remove the filter parameter if no value selected
      params.delete(filterKey);
    }

    // Update the URL
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      value={currentValue}
      onChange={(e) => handleFilterChange(e.target.value)}
      className="px-3 py-2 border text-sm border-white bg-slate-950 text-slate-100 ring-2 ring-white/0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none w-full"
    >
      <option value="">
        {placeholder || `Select ${filterDisplayKey || filterKey}`}
      </option>
      {filterOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Filter;
