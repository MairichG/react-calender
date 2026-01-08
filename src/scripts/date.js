export const dateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const addDays = (date, amount) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

export const getWindowStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const buildDayWindow = (count) => {
  const start = getWindowStart();
  const formatter = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  return Array.from({ length: count }, (_, index) => {
    const date = addDays(start, index);
    return {
      id: dateKey(date),
      date,
      label: formatter.format(date),
    };
  });
};
