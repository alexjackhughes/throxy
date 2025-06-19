import React from "react";

interface Props {
  title: string;
  description?: string;
}
export const PageHeader: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="flex flex-col gap-2 text-center">
      <h1 className="text-4xl font-bold text-white tracking-tighter">
        {title}
      </h1>
      {description && <p className="text-theme-50 text-md">{description}</p>}
    </div>
  );
};
