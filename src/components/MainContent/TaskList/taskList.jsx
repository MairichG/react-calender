import React from "react";
import styles from "./taskList.module.css";
import DayComponent from "../Day/day";

function TaskListComponent({ tags }) {
  return <main className={styles.main}>
    <DayComponent tags={tags} />
    <DayComponent tags={tags} />
    <DayComponent tags={tags} />
    <DayComponent tags={tags} />
    <DayComponent tags={tags} />
  </main>;
}

export default TaskListComponent;
