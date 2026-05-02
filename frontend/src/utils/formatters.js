export const formatMinutes = (minutes) => `${minutes} min`;
export const formatCalories = (value) => `${Math.round(value)} cal`;
export const formatDate = (value) =>
  new Date(value).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const formatShortDate = (value) =>
  new Date(value).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

export const getTodayKey = () => new Date().toISOString().slice(0, 10);

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

