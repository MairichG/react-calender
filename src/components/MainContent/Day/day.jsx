import React from 'react';
import styles from './day.module.css';
import TaskComponent from "../Task/task.jsx";
import addIcon from "../../../assets/MainContent/Day/AddIcon.svg";


function DayComponent({tags}) {
  return (
    <main className={styles.main}>
        <div className={styles.titleFrame}>
            <img src={addIcon} alt="addIcon" className={styles.addIcon}/>
            <div className={styles.timeFrame}>
                <div className={styles.timeSVG}>
                    <div style={{
                        width: "99px",
                        height: "5px",
                        borderRadius: "6px",
                        background: "var(--color-25, #262626)"
                    }}></div>

                    <div style={{
                        position: "absolute",
                        top: "0px",
                        width: "44px",
                        height: "5px",
                        borderRadius: "6px",
                        background: "var(--color-3, #373737)"
                    }}></div>
                </div>
                <div className={styles.time}>1h30m/2h</div>
            </div>
            <div className={styles.title}>Monday</div>
            <div className={styles.rectFrame}></div>
        </div>

        <div className={styles.tasksFrame}>
            <TaskComponent
                title="Do a Homework"
                description={`
                            блаблабла`}
                time="1h30m/2h"
                tags={tags}
            />
            <TaskComponent
                title="Do a Homework"
                description={`
                            блаблабла`}
                time="1h30m/2h"
                tags={tags}
            />

            <TaskComponent
                title="Do a Homework"
                description={`
                            блаблабла`}
                time="1h30m/2h"
                tags={tags}
            />
        </div>
    </main>
  );
}

export default DayComponent;