import { useEffect, useRef, useState } from "react";
import styles from "./AddTaskModal.module.css";

function AddTaskModal({
  isOpen,
  mode = "add",
  initialData,
  initialDayId,
  dayOptions = [],
  onCancel,
  onAdd,
  onSave,
  onDelete,
}) {
  const [title, setTitle] = useState("");
  const [requiredMin, setRequiredMin] = useState(60);
  const [spentMin, setSpentMin] = useState(0);
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDayId, setSelectedDayId] = useState("");
  const rangeRef = useRef(null);

  useEffect(() => {
    const parsedRequired = Number.parseInt(requiredMin, 10);
    const safeRequired = Number.isNaN(parsedRequired)
      ? 1
      : Math.max(1, parsedRequired);
    setSpentMin((prev) => Math.min(prev, safeRequired));
  }, [requiredMin]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (mode === "edit" && initialData) {
      setTitle(initialData.title || "");
      setRequiredMin(
        Number.isFinite(initialData.requiredMin) ? initialData.requiredMin : 60
      );
      setSpentMin(
        Number.isFinite(initialData.spentMin) ? initialData.spentMin : 0
      );
      setTag(
        Array.isArray(initialData.tags)
          ? initialData.tags.join(", ")
          : initialData.tag || ""
      );
      setDescription(initialData.description || "");
      setSelectedDayId(initialDayId || dayOptions[0]?.id || "");
      return;
    }
    setTitle("");
    setRequiredMin(60);
    setSpentMin(0);
    setTag("");
    setDescription("");
    setSelectedDayId(initialDayId || dayOptions[0]?.id || "");
  }, [isOpen, mode, initialData, initialDayId, dayOptions]);

  const requiredMax = Math.max(
    1,
    Number.isNaN(Number.parseInt(requiredMin, 10))
      ? 1
      : Number.parseInt(requiredMin, 10)
  );
  const spentPct = Math.max(0, Math.min(100, (spentMin / requiredMax) * 100));
  useEffect(() => {
    if (!rangeRef.current) {
      return;
    }
    rangeRef.current.style.setProperty("--fill", `${spentPct}%`);
  }, [spentPct]);

  if (!isOpen) {
    return null;
  }

  const buildPayload = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return null;
    }
    const parsedRequired = Number.parseInt(requiredMin, 10);
    const safeRequired = Number.isNaN(parsedRequired)
      ? 1
      : Math.max(1, parsedRequired);
    const parsedSpent = Number.parseInt(spentMin, 10);
    const safeSpent = Number.isNaN(parsedSpent)
      ? 0
      : Math.min(Math.max(0, parsedSpent), safeRequired);
    const tags = tag
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    return {
      title: trimmedTitle,
      requiredMin: safeRequired,
      spentMin: safeSpent,
      tags,
      description: description.trim(),
      dayId: selectedDayId || initialDayId,
    };
  };

  const handleAdd = () => {
    const payload = buildPayload();
    if (!payload) {
      return;
    }
    onAdd?.(payload);
  };

  const handleSave = () => {
    const payload = buildPayload();
    if (!payload) {
      return;
    }
    onSave?.(payload);
  };

  const handleDelete = () => {
    const ok = window.confirm("Delete this task?");
    if (!ok) {
      return;
    }
    onDelete?.();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.title}>
          {mode === "edit" ? "Edit task" : "Add task"}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="task-title">
            Title
          </label>
          <input
            id="task-title"
            className={styles.control}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task title"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="task-required">
            Required time (minutes)
          </label>
          <input
            id="task-required"
            className={styles.control}
            type="number"
            min="1"
            value={requiredMin}
            onChange={(event) => setRequiredMin(event.target.value)}
          />
        </div>

        {mode === "edit" && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="task-spent">
              Spent time
            </label>
            <div className={styles.rangeWrap}>
              <input
                id="task-spent"
                type="range"
                min="0"
                max={requiredMax}
                value={spentMin}
                onChange={(event) =>
                  setSpentMin(Number.parseInt(event.target.value, 10) || 0)
                }
                ref={rangeRef}
                className={styles.range}
              />
              <div className={styles.rangeValue}>{spentMin} min</div>
            </div>
          </div>
        )}

        {mode === "edit" && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="task-day">
              Date
            </label>
            <select
              id="task-day"
              className={styles.control}
              value={selectedDayId}
              onChange={(event) => setSelectedDayId(event.target.value)}
            >
              {dayOptions.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="task-tag">
            Tag (comma-separated)
          </label>
          <input
            id="task-tag"
            className={styles.control}
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            placeholder="Optional tag"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="task-desc">
            Description
          </label>
          <textarea
            id="task-desc"
            className={`${styles.control} ${styles.textarea}`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional description"
          />
        </div>

        <div className={styles.actions}>
          {mode === "edit" && (
            <button
              className={`${styles.btn} ${styles.btnDanger}`}
              type="button"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
          <button className={styles.btn} type="button" onClick={onCancel}>
            Cancel
          </button>
          {mode === "edit" ? (
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              type="button"
              onClick={handleSave}
            >
              Save
            </button>
          ) : (
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              type="button"
              onClick={handleAdd}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddTaskModal;
