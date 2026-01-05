import { useLayoutEffect, useRef, useState } from "react";
import styles from "./typeView.module.css";

const TYPE_VIEWS = ["Rows", "Columns", "Table"];

export default function TypeView() {
  const [active, setActive] = useState(1); // Columns по умолчанию
  const [hovered, setHovered] = useState(null);

  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const currentIndex = hovered ?? active;

  const moveIndicator = (index) => {
    const el = itemRefs.current[index];
    const parent = containerRef.current;
    if (!el || !parent) return;

    const elRect = el.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    setIndicator({
      left: elRect.left - parentRect.left,
      width: elRect.width,
    });
  };

  useLayoutEffect(() => {
    moveIndicator(currentIndex);

    const onResize = () => moveIndicator(currentIndex);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [currentIndex]);

  return (
    <div className={styles.typeView} ref={containerRef}>
      {TYPE_VIEWS.map((label, i) => (
        <button
          key={label}
          ref={(el) => (itemRefs.current[i] = el)}
          className={`${styles.item} ${i === active ? styles.active : ""}`}
          onClick={() => setActive(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          type="button"
        >
          {label}
        </button>
      ))}

      <div
        className={styles.indicator}
        style={{
          transform: `translateX(${indicator.left}px)`,
          width: `${indicator.width}px`,
        }}
      />
    </div>
  );
}