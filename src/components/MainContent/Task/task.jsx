import React from "react";
import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./task.module.css";
import TagComponent from "../Tag/tag.jsx";
import { taskProgressPct } from "../../../scripts/planner.js";

function TaskContent({ title, description, time, tags, fillPct, peek }) {
  return (
    <>
      <div className={styles.TnI}>
        <div className={styles.title}>{title}</div>

        <div className={styles.timeFrame}>
          <div className={styles.taskProgress} data-peek={peek ? "true" : "false"}>
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
            <TagComponent key={tag} name={tag} />
          ))}
        </div>
      </div>

      <div className={styles.description}>{description}</div>
    </>
  );
}

function SortableTaskComponent({
  taskId,
  title,
  description,
  time,
  tags,
  requiredMin,
  spentMin,
  isDragging,
  onClick,
}) {
  const t = useRef(null);
  const dragStartedRef = useRef(false);
  const [peek, setPeek] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({ id: taskId });
  const rawPct = taskProgressPct({ requiredMin, spentMin });
  const fillPct = rawPct > 0 ? Math.max(rawPct, 8) : 0;

  useEffect(() => {
    if (isDragging) {
      dragStartedRef.current = true;
    }
  }, [isDragging]);

  const handleClick = (event) => {
    if (isDragging || dragStartedRef.current) {
      if (!isDragging) {
        dragStartedRef.current = false;
      }
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  return (
    <main
      ref={setNodeRef}
      className={styles.main}
      data-peek={peek ? "true" : "false"}
      data-dragging={sortableIsDragging ? "true" : "false"}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      onMouseEnter={() => {
        t.current = setTimeout(() => setPeek(true), 600); // 600ms “подержать”
      }}
      onMouseLeave={() => {
        clearTimeout(t.current);
        setPeek(false);
      }}
      onPointerDown={() => {
        dragStartedRef.current = false;
      }}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      <TaskContent
        title={title}
        description={description}
        time={time}
        tags={tags}
        fillPct={fillPct}
        peek={peek}
      />
    </main>
  );
}

function OverlayTaskComponent({
  title,
  description,
  time,
  tags,
  requiredMin,
  spentMin,
}) {
  const rawPct = taskProgressPct({ requiredMin, spentMin });
  const fillPct = rawPct > 0 ? Math.max(rawPct, 8) : 0;

  return (
    <main className={styles.main} data-peek="true">
      <TaskContent
        title={title}
        description={description}
        time={time}
        tags={tags}
        fillPct={fillPct}
        peek={true}
      />
    </main>
  );
}

function TaskComponent(props) {
  if (props.overlay) {
    return <OverlayTaskComponent {...props} />;
  }

  return <SortableTaskComponent {...props} />;
}

export default TaskComponent;
