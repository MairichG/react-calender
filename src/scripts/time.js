export const clampMin = (value, min = 0, max = Number.POSITIVE_INFINITY) => {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
};

export const minutesFromHM = (hours = 0, minutes = 0) => {
  const safeHours = Number.isFinite(hours) ? hours : 0;
  const safeMinutes = Number.isFinite(minutes) ? minutes : 0;
  return Math.max(0, Math.round(safeHours * 60 + safeMinutes));
};

export const formatMinutes = (totalMinutes = 0) => {
  const safeMinutes = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;
  const hoursPart = hours ? `${hours}h` : "";
  const minutesPart = `${minutes}m`;
  return `${hoursPart}${minutesPart}`;
};

export const parseDuration = (value, fallbackMin = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return clampMin(Math.round(value));
  }
  if (typeof value !== "string") {
    return clampMin(fallbackMin);
  }

  const trimmed = value.trim().toLowerCase();
  if (!trimmed) {
    return clampMin(fallbackMin);
  }

  const withUnits = trimmed.match(/(\d+)\s*h\s*(\d+)?\s*m?/);
  if (withUnits) {
    const hours = Number.parseInt(withUnits[1], 10);
    const minutes = Number.parseInt(withUnits[2] || "0", 10);
    return minutesFromHM(hours, minutes);
  }

  const raw = Number.parseInt(trimmed, 10);
  if (Number.isNaN(raw)) {
    return clampMin(fallbackMin);
  }
  return clampMin(raw);
};

// Example usage:
// const required = minutesFromHM(1, 30); // 90
// const label = formatMinutes(90); // "1h30m"
// const parsed = parseDuration("2h15m"); // 135
