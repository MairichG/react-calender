import React from 'react';
import styles from './tag.module.css';

function TagComponent({name}) {
  return (
    <main className={styles.main}>
        <div className={styles.text}>{name}</div>
    </main>
  );
}

export default TagComponent;