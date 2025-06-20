import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EmployeeSize } from "../models/company";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapEmployeeSize(rawSize?: string): EmployeeSize {
  if (!rawSize) {
    return "1‑10";
  }

  const size = rawSize.toLowerCase().trim();

  if (
    size.includes("1-10") ||
    size.includes("1‑10") ||
    size === "1-10" ||
    size === "small"
  ) {
    return "1‑10";
  }
  if (size.includes("11-50") || size.includes("11‑50")) {
    return "11‑50";
  }
  if (size.includes("51-200") || size.includes("51‑200")) {
    return "51‑200";
  }
  if (size.includes("201-500") || size.includes("201‑500")) {
    return "201‑500";
  }
  if (
    size.includes("501-1000") ||
    size.includes("501‑1 000") ||
    size.includes("501-1 000")
  ) {
    return "501‑1 000";
  }
  if (
    size.includes("1001-5000") ||
    size.includes("1 001‑5 000") ||
    size.includes("1001-5000")
  ) {
    return "1 001‑5 000";
  }
  if (size.includes("5001-10000") || size.includes("5 001‑10 000")) {
    return "5 001‑10 000";
  }
  if (size.includes("10000+") || size.includes("10 000+") || size === "large") {
    return "10 000+";
  }

  // Default fallback
  return "1‑10";
}
