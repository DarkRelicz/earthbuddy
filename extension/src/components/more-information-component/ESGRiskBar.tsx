import React from "react";

type Category = {
  label: string;
  range: string;
};

interface ESGRiskBarProps {
  score: number | null;
}

const ESGRiskBar: React.FC<ESGRiskBarProps> = ({ score }) => {
  const categories: Category[] = [
    { label: "Negligible", range: "0-10" },
    { label: "Low", range: "10-20" },
    { label: "Medium", range: "20-30" },
    { label: "High", range: "30-40" },
    { label: "Severe", range: "40+" },
  ];

  const getCategory = (score: number | null): string => {
    if (score == null) return "unknown error";
    if (score < 0) return "missing data";
    if (score <= 10) return "Negligible";
    if (score <= 20) return "Low";
    if (score <= 30) return "Medium";
    if (score <= 40) return "High";
    return "Severe";
  };

  const getCategoryColor = (label: string): string => {
    switch (label) {
      case "Negligible":
        return "bg-green-200";
      case "Low":
        return "bg-yellow-200";
      case "Medium":
        return "bg-orange-300";
      case "High":
        return "bg-red-400";
      case "Severe":
        return "bg-red-500";
      default:
        return "bg-gray-100";
    }
  };

  const activeCategory = getCategory(score);

  return (
    <div className="flex text-gray-700 shadow-sm rounded-sm overflow-hidden border border-gray-200 mt-4 mb-2">
      {categories.map(({ label, range }) => {
        const isActive = label === activeCategory;
        const colorClass = isActive ? getCategoryColor(label) : "bg-gray-100";

        return (
          <div
            key={label}
            className={`flex flex-col items-center justify-center px-2 py-1 flex-1 text-center ${colorClass}`}
          >
            <div className="font-medium">{label}</div>
            <div className="text-[10px]">{range}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ESGRiskBar;
