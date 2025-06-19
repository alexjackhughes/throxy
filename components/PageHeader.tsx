import React from "react";

interface Props {
  title: string;
  description?: string;
}
export const PageHeader = ({ title, description }: Props) => {
  return (
    <div className="flex flex-col gap-2 text-center">
      <h1 className="text-4xl font-bold text-slate-100 tracking-tighter">
        {title}
      </h1>
      {description && <p className="text-slate-300 text-md">{description}</p>}
    </div>
  );
};
