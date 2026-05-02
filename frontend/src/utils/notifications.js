export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    return "unsupported";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  return Notification.requestPermission();
};

export const sendBrowserNotification = (title, options = {}) => {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  new Notification(title, {
    icon: "/icon.svg",
    ...options,
  });
};

export const getNextReminderDelay = (timeString = "07:00") => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const now = new Date();
  const next = new Date();

  next.setHours(hours || 7, minutes || 0, 0, 0);
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  return next.getTime() - now.getTime();
};

