"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Filter from "@/components/Filter";
import { employeeSizeOptions } from "@/models/company";
import Button from "@/components/Button";

const CompaniesFilters: React.FC = () => {
  const router = useRouter();

  const countryOptions = [
    "United States",
    "United Kingdom",
    "Canada",
    "Germany",
    "France",
    "Japan",
    "Australia",
    "Netherlands",
    "Sweden",
    "Switzerland",
  ];

  const cityOptions = [
    "New York",
    "London",
    "San Francisco",
    "Toronto",
    "Berlin",
    "Paris",
    "Tokyo",
    "Sydney",
    "Amsterdam",
    "Stockholm",
  ];

  const handleResetFilters = () => {
    // Navigate to the current page without any query parameters
    router.push(window.location.pathname);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 items-end">
      <Filter
        filterKey="country"
        filterDisplayKey="Country"
        filterOptions={countryOptions}
      />
      <Filter
        filterKey="employee_size"
        filterDisplayKey="Employee Size"
        filterOptions={employeeSizeOptions}
      />
      <Filter
        filterKey="city"
        filterDisplayKey="City"
        filterOptions={cityOptions}
      />
      <Button onClick={handleResetFilters} size="small">
        Reset Filters
      </Button>
    </div>
  );
};

export default CompaniesFilters;
