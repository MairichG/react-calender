import React from "react";
import { useRef, useState } from "react";
import styles from "./task.module.css";
import TagComponent from "../Tag/tag.jsx";
import { taskProgressPct } from "../../../scripts/planner.js";

function TaskComponent({
  title,
  description,
  time,
  tags,
  requiredMin,
  spentMin,
  onClick,
}) {
  const t = useRef(null);
  const [peek, setPeek] = useState(false);
  const rawPct = taskProgressPct({ requiredMin, spentMin });
  const fillPct = rawPct > 0 ? Math.max(rawPct, 8) : 0;

  return (
     <main
      className={styles.main}
      data-peek={peek ? "true" : "false"}
      onMouseEnter={() => {
        t.current = setTimeout(() => setPeek(true), 600); // 600ms “подержать”
      }}
      onMouseLeave={() => {
        clearTimeout(t.current);
        setPeek(false);
      }}
      onClick={onClick}
    >
      <div className={styles.TnI}>
        <div className={styles.title}>{title}</div>

        <div className={styles.timeFrame}>
          <div
            className={styles.taskProgress}
            data-peek={peek ? "true" : "false"}
          >
            <div className={styles.taskProgressBg}></div>
            <div
              className={styles.taskProgressFill}
              style={{ width: `${fillPct}%` }}
            ></div>
          </div>

          <div className={styles.time}>{time}</div>
        </div>

        <div className={styles.tagsFrame}>
          {tags.map((tag) => (
            <TagComponent name={tag} />
          ))}
        </div>
      </div>

      <div className={styles.description}>{description}</div>
    </main>
  );
}

export default TaskComponent;
