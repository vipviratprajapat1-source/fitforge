import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNowStrict, startOfDay } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: Date | string, pattern = "MMM d, yyyy") {
  return format(new Date(value), pattern);
}

export function formatRelativeDistance(value: Date | string) {
  return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function levelProgress(xp: number) {
  const previousLevelXp = Math.floor(xp / 250) * 250;
  return Math.min(100, Math.round(((xp - previousLevelXp) / 250) * 100));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function lines(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function todayKey(date = new Date()) {
  return startOfDay(date).toISOString();
}

export function percentage(current: number, target: number) {
  if (!target) {
    return 0;
  }

  return Math.min(100, Math.round((current / target) * 100));
}
