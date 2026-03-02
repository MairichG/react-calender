import React, { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import styles from "./taskList.module.css";
import DayComponent from "../Day/day";
import TaskComponent from "../Task/task.jsx";
import { formatMinutes } from "../../../scripts/time.js";

function TaskListComponent({
  days,
  tasksByDay,
  dayCaps,
  onAddTask,
  onEditTask,
  onMoveTask,
}) {
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const activationConstraint = {
    delay: 300,
    tolerance: 100,
  };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint,
    }),
    useSensor(TouchSensor, {
      activationConstraint,
    })
  );

  const activeTask = useMemo(() => {
    if (!activeTaskId) {
      return null;
    }
    for (const tasks of Object.values(tasksByDay || {})) {
      if (!Array.isArray(tasks)) {
        continue;
      }
      const found = tasks.find((task) => task?.id === activeTaskId);
      if (found) {
        return found;
      }
    }
    return null;
  }, [activeTaskId, tasksByDay]);

  const handleDragStart = ({ active }) => {
    setIsDragging(true);
    setActiveTaskId(active?.id || null);
  };

  const handleDragEnd = ({ active, over }) => {
    setIsDragging(false);
    if (!over || !onMoveTask) {
      setActiveTaskId(null);
      return;
    }
    onMoveTask(active.id, over.id);
    setActiveTaskId(null);
  };

  const handleDragCancel = () => {
    setIsDragging(false);
    setActiveTaskId(null);
  };
  const overlayTags = activeTask?.tags || (activeTask?.tag ? [activeTask.tag] : []);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <main className={styles.main}>
        {days.map((day, index) => (
          <DayComponent
            key={day.id}
            index={index}
            day={{ ...day, capacityMin: dayCaps?.[day.id] ?? 120 }}
            tasks={tasksByDay[day.id] || []}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            dayWindow={days}
            tasksByDay={tasksByDay}
            dayCaps={dayCaps}
            isDragging={isDragging}
          />
        ))}
      </main>
      <DragOverlay>
        {activeTask ? (
          <TaskComponent
            overlay={true}
            taskId={`overlay-${activeTask.id}`}
            title={activeTask.title}
            description={activeTask.description}
            time={`${formatMinutes(activeTask.spentMin || 0)} / ${formatMinutes(
              activeTask.requiredMin || 0
            )}`}
            tags={overlayTags}
            requiredMin={activeTask.requiredMin}
            spentMin={activeTask.spentMin}
            onClick={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default TaskListComponent;
