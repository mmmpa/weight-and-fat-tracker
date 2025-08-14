import { redirect } from "react-router";

/**
 * Navigation utility functions
 */

/**
 * Get the current month URL path
 * @returns URL path string for current month (e.g., "/monthly/2024/08")
 */
export function getCurrentMonthPath(): string {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  return `/monthly/${currentYear}/${currentMonth}`;
}

/**
 * Redirect to current month page (for use in clientLoader)
 * @returns React Router redirect response
 */
export function redirectToCurrentMonth() {
  return redirect(getCurrentMonthPath());
}
