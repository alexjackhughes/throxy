"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface Props {
  placeholder?: string;
}

const Search: React.FC<Props> = ({ placeholder = "Search..." }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the current search value from URL params
  const currentValue = searchParams.get("search") || "";

  // Local state for the input value (for immediate UI updates)
  const [inputValue, setInputValue] = useState(currentValue);

  // Update local input value when URL param changes (e.g., from external navigation)
  useEffect(() => {
    setInputValue(currentValue);
  }, [currentValue]);

  // Debounce effect to update URL params
  useEffect(() => {
    const timer = setTimeout(() => {
      // Create new URLSearchParams from current search params
      const params = new URLSearchParams(searchParams);

      if (inputValue) {
        // Set the search parameter
        params.set("search", inputValue);
      } else {
        // Remove the search parameter if no value
        params.delete("search");
      }

      // Only update URL if the value is different from current URL param
      if (inputValue !== currentValue) {
        router.push(`?${params.toString()}`);
      }
    }, 300);

    // Clean up the timeout if input changes before 300ms
    return () => clearTimeout(timer);
  }, [inputValue, router, searchParams, currentValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-4 w-4 text-white/70" />
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className="bg-theme-300 text-white border-theme-100 focus-visible:border-theme-100 focus-visible:ring-white flex w-full items-center gap-2 rounded-md border pl-10 pr-3 py-2 text-sm outline-none focus-visible:ring-[1px] h-12 placeholder:text-white/70"
      />
    </div>
  );
};

export default Search;
