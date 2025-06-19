import { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import CompaniesFilters from "@/app/components/CompaniesFilters";

export const metadata: Metadata = {
  title: "Throxy",
};

export default function Home() {
  return (
    <div className="flex flex-col gap-4 bg-slate-950 h-screen">
      <div className="flex flex-col mx-auto max-w-2xl mt-24 mb-10 w-full">
        <PageHeader
          title="Company Directory"
          description="Browse, filter, and upload your company data"
        />
        <CompaniesFilters />
      </div>
    </div>
  );
}
