import { PageHeader } from "@/components/PageHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Throxy",
};

export default function Home() {
  return (
    <div className="flex flex-col gap-4 bg-slate-950 h-screen">
      <div className="flex flecx-col mx-auto max-w-xl mt-24 mb-10">
        <PageHeader
          title="Company Directory"
          description="Browse, filter, and upload your company data"
        />
      </div>
    </div>
  );
}
