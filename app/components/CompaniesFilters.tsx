import React from "react";
import Filter from "@/components/Filter";
import { employeeSizeOptions } from "@/models/company";

const CompaniesFilters: React.FC = () => {
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

  return (
    <div className="flex flex-col md:flex-row gap-3 mt-10">
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
    </div>
  );
};

export default CompaniesFilters;
