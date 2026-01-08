import { clampMin } from "./time.js";

export const sumTaskMinutes = (tasks = []) =>
  tasks.reduce(
    (sum, task) =>
      sum + clampMin(task?.requiredMin ?? task?.plannedMinutes ?? 0),
    0
  );

export const sumSpentMinutes = (tasks = []) =>
  tasks.reduce(
    (sum, task) => sum + clampMin(task?.spentMin ?? task?.spentMinutes ?? 0),
    0
  );

export const getDayStats = ({ tasks = [], dayCapacityMin = 0 } = {}) => {
  const requiredMin = sumTaskMinutes(tasks);
  const spentMin = sumSpentMinutes(tasks);
  const safeCapacity = clampMin(dayCapacityMin);
  const leftMin = Math.max(0, safeCapacity - requiredMin);
  const overloadMin = Math.max(0, requiredMin - safeCapacity);

  return {
    requiredMin,
    spentMin,
    leftMin,
    overloadMin,
  };
};

export const clampPct = (value) => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, value));
};

export const taskProgressPct = (task) => {
  const requiredMin = clampMin(task?.requiredMin ?? 0);
  const spentMin = clampMin(task?.spentMin ?? 0);
  if (requiredMin <= 0) {
    return 0;
  }
  return clampPct((spentMin / requiredMin) * 100);
};

export const dayLoadPct = ({ tasks = [], capacityMin = 0 } = {}) => {
  const requiredMin = sumTaskMinutes(tasks);
  const safeCapacity = clampMin(capacityMin);
  if (safeCapacity <= 0) {
    return 0;
  }
  return clampPct((requiredMin / safeCapacity) * 100);
};

export const getCumulativeStats = (
  dayIndex,
  dayWindow = [],
  tasksByDay = {},
  dayCaps = {}
) => {
  const safeIndex = Math.max(0, dayIndex);
  let usedMin = 0;
  let capMin = 0;

  for (let i = 0; i <= safeIndex && i < dayWindow.length; i += 1) {
    const dayId = dayWindow[i]?.id;
    if (!dayId) {
      continue;
    }
    const tasks = Array.isArray(tasksByDay[dayId]) ? tasksByDay[dayId] : [];
    usedMin += sumTaskMinutes(tasks);
    const cap = dayCaps?.[dayId];
    capMin += Number.isFinite(cap) ? cap : 0;
  }

  const pct = capMin > 0 ? clampPct((usedMin / capMin) * 100) : 0;
  return { usedMin, capMin, pct };
};

// Example usage:
// const tasks = [{ plannedMinutes: 60, spentMinutes: 30 }];
// const stats = getDayStats({ tasks, dayCapacityMin: 120 });
// stats.requiredMin === 60
