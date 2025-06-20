"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";

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
  const pathname = usePathname();

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

    // Update the URL with current pathname preserved
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentValue} onValueChange={handleFilterChange}>
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={placeholder || `Select ${filterDisplayKey || filterKey}`}
        />
      </SelectTrigger>
      <SelectContent>
        {filterOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Filter;
