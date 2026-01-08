import React from "react";
import styles from "./taskList.module.css";
import DayComponent from "../Day/day";

function TaskListComponent({
  days,
  tasksByDay,
  dayCaps,
  onAddTask,
  onEditTask,
}) {
  return (
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
        />
      ))}
    </main>
  );
}

export default TaskListComponent;
