import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Companies, defaultCompany } from "@/models/company";

interface Props {
  companies?: Companies;
}

const CompaniesTable: React.FC<Props> = ({ companies = [] }) => {
  return (
    <div className="rounded-md bg-theme-300 text-white mb-10 md:mb-24">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Employee Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company, index) => (
            <TableRow key={company.id || index}>
              <TableCell className="font-medium text-center">
                {company.company_name || "-"}
              </TableCell>
              <TableCell className="text-center">
                <a
                  href={`https://${company.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-400 hover:underline"
                >
                  {company.domain || "-"}
                </a>
              </TableCell>
              <TableCell className="text-center">
                {company.industry || "-"}
              </TableCell>
              <TableCell className="text-center">
                {company.city || "-"}
              </TableCell>
              <TableCell className="text-center">{company.country}</TableCell>
              <TableCell className="text-center">
                {company.employee_size || "-"}
              </TableCell>
            </TableRow>
          ))}
          {companies.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-white">
                No companies found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
