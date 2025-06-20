"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface FilterOption {
  display: string;
  value: string;
}

interface Props {
  filterKey: string;
  filterDisplayKey?: string;
  placeholder?: string;
  filterOptions: string[] | FilterOption[];
}

const FilterWithSearch: React.FC<Props> = ({
  filterKey,
  filterDisplayKey,
  placeholder,
  filterOptions,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Normalize options to always be FilterOption objects
  const normalizedOptions: FilterOption[] = filterOptions.map((option) => {
    if (typeof option === "string") {
      return { display: option, value: option };
    }
    return option;
  });

  // Get the selected value from URL params
  const selectedValue = searchParams.get(filterKey) || "";

  // Find the selected option to display
  const selectedOption = selectedValue
    ? normalizedOptions.find((option) => option.value === selectedValue)
    : null;

  // Filter options based on search input
  const filteredOptions = searchInput
    ? normalizedOptions.filter((option) =>
        option.display.toLowerCase().includes(searchInput.toLowerCase())
      )
    : normalizedOptions;

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchInput]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchInput(""); // Clear search when closing
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        return;
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearchInput("");
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleOptionSelect = (option: FilterOption) => {
    setSearchInput("");
    setIsOpen(false);
    setHighlightedIndex(-1);

    // Create new URLSearchParams from current search params
    const params = new URLSearchParams(searchParams);
    params.set(filterKey, option.value);

    // Update the URL
    router.push(`?${params.toString()}`);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleClearSelection = () => {
    setSearchInput("");
    setIsOpen(false);
    setHighlightedIndex(-1);

    // Create new URLSearchParams from current search params
    const params = new URLSearchParams(searchParams);
    params.delete(filterKey);

    // Update the URL
    router.push(`?${params.toString()}`);
  };

  const handleOptionMouseEnter = (index: number) => {
    setHighlightedIndex(index);
  };

  // Determine what to show in the input
  const inputDisplayValue = isOpen
    ? searchInput
    : selectedOption?.display || "";

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputDisplayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={
            placeholder || `Search ${filterDisplayKey || filterKey}...`
          }
          className="bg-theme-300 text-white border-theme-100 focus-visible:border-theme-100 focus-visible:ring-white flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[1px] h-9 placeholder:text-white/70 pr-8"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="h-4 w-4 text-white/70" />
        </div>
        {selectedOption && (
          <button
            type="button"
            onClick={handleClearSelection}
            className="absolute inset-y-0 right-8 mb-0.5 flex items-center pr-2 text-white/70 hover:text-white"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="bg-theme-300 text-white absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border border-theme-100 shadow-md p-1">
          {filteredOptions.map((option, index) => (
            <div
              key={`${option.value}-${index}`}
              onClick={() => handleOptionSelect(option)}
              onMouseEnter={() => handleOptionMouseEnter(index)}
              className={`text-white relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 px-2 text-sm outline-none select-none ${
                highlightedIndex === index
                  ? "bg-theme-200"
                  : "hover:bg-theme-200"
              }`}
            >
              {option.display}
            </div>
          ))}
        </div>
      )}

      {isOpen && filteredOptions.length === 0 && searchInput && (
        <div className="bg-theme-300 text-white absolute z-50 w-full mt-1 rounded-md border border-theme-100 shadow-md p-2">
          <div className="text-sm text-white/70">No results found</div>
        </div>
      )}
    </div>
  );
};

export default FilterWithSearch;
