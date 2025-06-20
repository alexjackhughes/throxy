"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Filter from "@/components/Filter";
import { employeeSizeOptions } from "@/models/company";
import Button from "@/components/Button";
import FilterByCountry from "./FilterByCountry";
import FilterByCity from "./FilterbyCity";

const CompaniesFilters: React.FC = () => {
  const router = useRouter();

  const handleResetFilters = () => {
    // Navigate to the current page without any query parameters
    router.push(window.location.pathname);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 items-end">
      <FilterByCountry />
      <Filter
        filterKey="employee_size"
        filterDisplayKey="Employee Size"
        filterOptions={employeeSizeOptions}
      />
      <FilterByCity />
      <Button onClick={handleResetFilters} size="small">
        Reset Filters
      </Button>
    </div>
  );
};

export default CompaniesFilters;
