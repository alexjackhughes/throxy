import { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import CompaniesFilters from "@/app/components/CompaniesFilters";
import CompaniesContainer from "./components/CompaniesContainer";
import UploadFile from "@/components/UploadFile";
import Search from "@/components/Search";

export const metadata: Metadata = {
  title: "Throxy",
};

export default function Home() {
  return (
    <div className="flex flex-col gap-4 bg-theme-500 h-screen">
      <div className="flex flex-col mx-auto max-w-5xl mt-10 md:mt-24 mb-10 w-full px-4 gap-8">
        <PageHeader
          title="Company Directory"
          description="Browse, filter, and upload your company data"
        />
        <UploadFile />
        <Search placeholder="You can search by company name or domain" />
        <CompaniesFilters />
        <CompaniesContainer />
      </div>
    </div>
  );
}
