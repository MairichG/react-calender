import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import styles from "./day.module.css";
import TaskComponent from "../Task/task.jsx";
import addIcon from "../../../assets/MainContent/Day/AddIcon.svg";
import { formatMinutes } from "../../../scripts/time.js";
import { getCumulativeStats } from "../../../scripts/planner.js";

function DayComponent({
  day,
  tasks,
  onAddTask,
  onEditTask,
  index,
  dayWindow,
  tasksByDay,
  dayCaps,
  isDragging,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: day.id });

  const { usedMin, capMin } = getCumulativeStats(
    index,
    dayWindow,
    tasksByDay,
    dayCaps
  );
  const isOverflow = usedMin > capMin;
  const rawPct = isOverflow
    ? 100
    : capMin > 0
    ? Math.min(usedMin / capMin, 1) * 100
    : 0;
  const fillPct = rawPct > 0 ? Math.max(rawPct, 8) : 0;
  const timeLabel = `${formatMinutes(usedMin)} / ${formatMinutes(capMin)}`;

  return (
    <main
      ref={setNodeRef}
      className={styles.main}
      data-over={isOver ? "true" : "false"}
    >
        <div className={styles.titleFrame}>
            <div className={styles.top}>
              <div className={styles.rectFrame}></div>
              <div className={styles.title}>{day.label}</div>
              <img
                src={addIcon}
                alt="addIcon"
                className={styles.addIcon}
                onClick={() => onAddTask?.(day.id)}
              />
            </div>
            <div
              className={styles.time}
              style={{
                color: isOverflow
                  ? "var(--Accents-Red, #ff4d4f)"
                  : undefined,
              }}
            >
              {timeLabel}
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressBar1}></div>
              <div
                className={styles.progressBar2}
                style={{
                  width: `${fillPct}%`,
                  background: isOverflow
                    ? "var(--Accents-Red, #ff4d4f)"
                    : "var(--Accents-Blue, #0088FF)",
                }}
              ></div>
            </div>
        </div>

        {tasks.length > 0 && (
          <div className={styles.tasksFrame}>
            <SortableContext
              items={tasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasks.map((task) => (
                <TaskComponent
                  key={task.id}
                  taskId={task.id}
                  title={task.title}
                  description={task.description}
                  time={`${formatMinutes(task.spentMin || 0)} / ${formatMinutes(
                    task.requiredMin || 0
                  )}`}
                  tags={task.tags || (task.tag ? [task.tag] : [])}
                  requiredMin={task.requiredMin}
                  spentMin={task.spentMin}
                  isDragging={isDragging}
                  onClick={() => onEditTask?.(day.id, task.id)}
                />
              ))}
            </SortableContext>
          </div>
        )}
    </main>
  );
}

export default DayComponent;
