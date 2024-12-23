import { paramsType } from "@/app/page"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validateSearchParams = (searchParams: paramsType): boolean => {
  if (
    searchParams.variables > 0 &&
    searchParams.constraints > 0 &&
    (searchParams.function === "maximize" || searchParams.function === "minimize")
  )
    return true;
  else return false;
}
