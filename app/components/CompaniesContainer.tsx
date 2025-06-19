"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Companies } from "@/models/company";
import CompaniesTable from "./CompaniesTable";

const CompaniesContainer: React.FC = () => {
  const [companies, setCompanies] = useState<Companies>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters from URL search params
        const queryParams = new URLSearchParams();

        const country = searchParams.get("country");
        const employeeSize = searchParams.get("employee_size");
        const city = searchParams.get("city");

        if (country) queryParams.set("country", country);
        if (employeeSize) queryParams.set("employee_size", employeeSize);
        if (city) queryParams.set("city", city);

        // Make API request to /api/companies with query parameters
        const apiUrl = `/api/companies${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch companies: ${response.status} ${response.statusText}`
          );
        }

        const fetchedCompanies: Companies = await response.json();
        setCompanies(fetchedCompanies);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch companies"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="rounded-md bg-theme-300 text-white p-8 text-center">
        Loading companies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-500 text-white p-8 text-center">
        Error: {error}
      </div>
    );
  }

  return <CompaniesTable companies={companies} />;
};

export default CompaniesContainer;
