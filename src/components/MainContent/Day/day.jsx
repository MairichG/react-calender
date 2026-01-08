import React from "react";
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
}) {
  const { usedMin, capMin, pct } = getCumulativeStats(
    index,
    dayWindow,
    tasksByDay,
    dayCaps
  );
  const spentMin = tasks.reduce((sum, task) => sum + (task?.spentMin || 0), 0);
  const rawPct = pct;
  const fillPct = rawPct > 0 ? Math.max(rawPct, 8) : 0;
  const timeLabel = `${formatMinutes(usedMin)} / ${formatMinutes(capMin)}`;

  return (
    <main className={styles.main}>
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
            <div className={styles.time}>{timeLabel}</div>
            <div className={styles.progressBar}>
              <div className={styles.progressBar1}></div>
              <div
                className={styles.progressBar2}
                style={{ width: `${fillPct}%` }}
              ></div>
            </div>
        </div>

        {tasks.length > 0 && (
          <div className={styles.tasksFrame}>
            {tasks.map((task) => (
              <TaskComponent
                key={task.id}
                title={task.title}
                description={task.description}
                time={`${formatMinutes(task.spentMin || 0)} / ${formatMinutes(
                  task.requiredMin || 0
                )}`}
                tags={task.tags || (task.tag ? [task.tag] : [])}
                requiredMin={task.requiredMin}
                spentMin={task.spentMin}
                onClick={() => onEditTask?.(day.id, task.id)}
              />
            ))}
          </div>
        )}
    </main>
  );
}

export default DayComponent;
