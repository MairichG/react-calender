import React from "react";
import { useRef, useState } from "react";
import styles from "./task.module.css";
import TagComponent from "../Tag/tag.jsx";

function TaskComponent({ title, description, time, tags }) {
  const t = useRef(null);
  const [peek, setPeek] = useState(false);

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
      }}>
      <div className={styles.TnI}>
        <div className={styles.title}>{title}</div>

        <div className={styles.timeFrame}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="88"
            height="5"
            viewBox="0 0 88 5"
            fill="none"
          >
            <rect width="88" height="5" rx="2.5" fill="#262626" />
            <rect width="33" height="5" rx="2.5" fill="#0088FF" />
          </svg>
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
