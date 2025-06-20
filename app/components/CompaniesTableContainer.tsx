"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Companies } from "@/models/company";
import CompaniesTable from "./CompaniesTable";

// Fetcher function for SWR
const fetcher = async (url: string): Promise<Companies> => {
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch companies: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

const CompaniesTableContainer: React.FC = () => {
  const searchParams = useSearchParams();

  // Build query parameters from URL search params
  const queryParams = new URLSearchParams();

  const country = searchParams.get("country");
  const employeeSize = searchParams.get("employee_size");
  const city = searchParams.get("city");
  const search = searchParams.get("search");

  if (country) queryParams.set("country", country);
  if (employeeSize) queryParams.set("employee_size", employeeSize);
  if (city) queryParams.set("city", city);
  if (search) queryParams.set("search", search);

  // Create the API URL with query parameters
  const apiUrl = `/api/companies?${queryParams.toString()}`;

  // Use SWR for data fetching
  const {
    data: companies,
    error,
    isLoading,
  } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  if (isLoading) {
    return (
      <div className="rounded-md bg-theme-300 text-white p-8 text-center">
        Loading companies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-500 text-white p-8 text-center">
        Error: {error.message}
      </div>
    );
  }

  return <CompaniesTable companies={companies || []} />;
};

export default CompaniesTableContainer;
