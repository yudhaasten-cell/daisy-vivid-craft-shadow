import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIdNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat("id-ID", options).format(value);
}

export function formatSignedPct(value: number, digits = 2) {
  const abs = Math.abs(value).toFixed(digits);
  if (value > 0.0000001) return `+${abs}%`;
  if (value < -0.0000001) return `−${abs}%`;
  return `${(0).toFixed(digits)}%`;
}

export function formatUsdIdr(value: number) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
    Math.round(value),
  );
}
