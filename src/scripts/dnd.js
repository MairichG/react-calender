import { arrayMove } from "@dnd-kit/sortable";

export const findDayByTaskId = (tasksByDay, taskId) => {
  if (!tasksByDay || typeof tasksByDay !== "object" || !taskId) {
    return null;
  }

  for (const [dayId, tasks] of Object.entries(tasksByDay)) {
    if (!Array.isArray(tasks)) {
      continue;
    }
    if (tasks.some((task) => task?.id === taskId)) {
      return dayId;
    }
  }

  return null;
};

export const moveTask = (tasksByDay, activeId, overId) => {
  if (!tasksByDay || typeof tasksByDay !== "object") {
    return {};
  }

  const nextTasksByDay = Object.fromEntries(
    Object.entries(tasksByDay).map(([dayId, tasks]) => [
      dayId,
      Array.isArray(tasks) ? [...tasks] : [],
    ])
  );

  if (!activeId || !overId) {
    return nextTasksByDay;
  }

  const sourceDayId = findDayByTaskId(nextTasksByDay, activeId);
  if (!sourceDayId) {
    return nextTasksByDay;
  }

  const overTaskDayId = findDayByTaskId(nextTasksByDay, overId);
  const overDayId = Object.prototype.hasOwnProperty.call(nextTasksByDay, overId)
    ? overId
    : null;
  const targetDayId = overTaskDayId || overDayId;

  if (!targetDayId) {
    return nextTasksByDay;
  }

  const sourceTasks = nextTasksByDay[sourceDayId];
  const activeIndex = sourceTasks.findIndex((task) => task?.id === activeId);
  if (activeIndex === -1) {
    return nextTasksByDay;
  }

  if (sourceDayId === targetDayId) {
    const overIndex = sourceTasks.findIndex((task) => task?.id === overId);
    if (overIndex === -1 || overIndex === activeIndex) {
      return nextTasksByDay;
    }
    nextTasksByDay[sourceDayId] = arrayMove(sourceTasks, activeIndex, overIndex);
    return nextTasksByDay;
  }

  const [activeTask] = sourceTasks.splice(activeIndex, 1);
  const targetTasks = nextTasksByDay[targetDayId];
  const overIndex = targetTasks.findIndex((task) => task?.id === overId);
  const insertIndex = overIndex === -1 ? targetTasks.length : overIndex;
  targetTasks.splice(insertIndex, 0, activeTask);

  return nextTasksByDay;
};
