import "./App.css";
import { useEffect, useState } from "react";
import TaskListComponent from "./components/MainContent/TaskList/taskList.jsx";
import TypeView from "./components/MainContent/TypeView/typeView.jsx";
import { loadPlanner, savePlanner } from "./scripts/storage.js";
import AddTaskModal from "./components/Modal/AddTaskModal.jsx";
import { buildDayWindow, dateKey, getWindowStart } from "./scripts/date.js";
//import SideBarSelectComponent from "./components/SideBar/SideBarSelect/sideBarSelectIco.jsx";

import avatar from "./assets/SideBar/ProfileIco/simpleGLEBico.png";


function App() {
  const defaultDays = buildDayWindow(5);
  const defaultDayCaps = defaultDays.reduce((acc, day) => {
    acc[day.id] = 120;
    return acc;
  }, {});
  const defaultTasksByDay = defaultDays.reduce((acc, day) => {
    acc[day.id] = [];
    return acc;
  }, {});
  const defaultPlannerData = {
    days: defaultDays,
    dayCaps: defaultDayCaps,
    tasksByDay: defaultTasksByDay,
  };
  const [plannerData, setPlannerData] = useState(() => {
    const stored = loadPlanner();
    if (!stored) {
      return defaultPlannerData;
    }
    const storedDays = Array.isArray(stored.days) ? stored.days : [];
    const storedDayCaps =
      stored.dayCaps && typeof stored.dayCaps === "object" ? stored.dayCaps : {};
    const storedTasks =
      stored.tasksByDay && typeof stored.tasksByDay === "object"
        ? stored.tasksByDay
        : {};

    const dateKeyPattern = /^\d{4}-\d{2}-\d{2}$/;
    const hasDateKeys =
      storedDays.length > 0 &&
      storedDays.every((day) => dateKeyPattern.test(day.id));

    if (!hasDateKeys) {
      return defaultPlannerData;
    }

    const mergedTasksByDay = {};
    const mergedDayCaps = {};
    Object.keys(storedTasks).forEach((key) => {
      const dayTasks = storedTasks[key];
      mergedTasksByDay[key] = Array.isArray(dayTasks) ? dayTasks : [];
    });
    defaultPlannerData.days.forEach((day) => {
      if (!mergedTasksByDay[day.id]) {
        mergedTasksByDay[day.id] = [];
      }
      const cap = storedDayCaps[day.id];
      mergedDayCaps[day.id] = Number.isFinite(cap) ? cap : 120;
    });

    return {
      days: defaultPlannerData.days,
      dayCaps: mergedDayCaps,
      tasksByDay: mergedTasksByDay,
    };
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeDayId, setActiveDayId] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  useEffect(() => {
    savePlanner(plannerData);
  }, [plannerData]);

  useEffect(() => {
    const todayKey = dateKey(getWindowStart());
    setPlannerData((prev) => {
      const nextTasksByDay = { ...prev.tasksByDay };
      const todayTasks = Array.isArray(nextTasksByDay[todayKey])
        ? nextTasksByDay[todayKey]
        : [];
      let changed = false;

      Object.keys(nextTasksByDay).forEach((dayId) => {
        if (dayId >= todayKey) {
          return;
        }
        const dayTasks = Array.isArray(nextTasksByDay[dayId])
          ? nextTasksByDay[dayId]
          : [];
        if (!dayTasks.length) {
          return;
        }
        const pending = dayTasks.filter((task) => !task?.isDone);
        const done = dayTasks.filter((task) => task?.isDone);
        if (pending.length) {
          nextTasksByDay[dayId] = done;
          nextTasksByDay[todayKey] = [
            ...todayTasks,
            ...pending.map((task) => ({
              ...task,
              isDone: Boolean(task?.isDone),
            })),
          ];
          changed = true;
        }
      });

      if (!changed) {
        return prev;
      }

      return {
        ...prev,
        tasksByDay: nextTasksByDay,
      };
    });
  }, []);

  const handleOpenAdd = (dayId) => {
    setActiveDayId(dayId);
    setActiveTaskId(null);
    setModalMode("add");
    setIsAddOpen(true);
  };

  const handleOpenEdit = (dayId, taskId) => {
    setActiveDayId(dayId);
    setActiveTaskId(taskId);
    setModalMode("edit");
    setIsAddOpen(true);
  };

  const handleCancelAdd = () => {
    setIsAddOpen(false);
    setActiveDayId(null);
    setActiveTaskId(null);
  };

  const createTaskId = () =>
    `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  const handleAddTask = (data) => {
    if (!activeDayId) {
      return;
    }
    const tags = Array.isArray(data.tags)
      ? data.tags
      : data.tag
      ? [data.tag]
      : [];
    const newTask = {
      id: createTaskId(),
      title: data.title,
      description: data.description,
      tags,
      requiredMin: data.requiredMin,
      spentMin: data.spentMin || 0,
      isDone: false,
    };
    setPlannerData((prev) => {
      const currentTasks = prev.tasksByDay[activeDayId] || [];
      return {
        ...prev,
        tasksByDay: {
          ...prev.tasksByDay,
          [activeDayId]: [...currentTasks, newTask],
        },
      };
    });
    handleCancelAdd();
  };

  const handleSaveTask = (data) => {
    if (!activeDayId || !activeTaskId) {
      return;
    }
    const targetDayId = data.dayId || activeDayId;
    const tags = Array.isArray(data.tags)
      ? data.tags
      : data.tag
      ? [data.tag]
      : [];
    setPlannerData((prev) => {
      const currentTasks = prev.tasksByDay[activeDayId] || [];
      const updatedTask = currentTasks.find((task) => task.id === activeTaskId);
      if (!updatedTask) {
        return prev;
      }
      const nextTask = {
        ...updatedTask,
        title: data.title,
        description: data.description,
        tags,
        requiredMin: data.requiredMin,
        spentMin: data.spentMin,
        isDone: Boolean(updatedTask?.isDone),
      };
      const nextTasks = currentTasks.filter(
        (task) => task.id !== activeTaskId
      );
      const targetTasks =
        prev.tasksByDay[targetDayId] || (targetDayId === activeDayId ? [] : []);
      return {
        ...prev,
        tasksByDay: {
          ...prev.tasksByDay,
          [activeDayId]: targetDayId === activeDayId ? [...nextTasks, nextTask] : nextTasks,
          [targetDayId]:
            targetDayId === activeDayId
              ? [...nextTasks, nextTask]
              : [...targetTasks, nextTask],
        },
      };
    });
    handleCancelAdd();
  };

  const handleDeleteTask = () => {
    if (!activeDayId || !activeTaskId) {
      return;
    }
    setPlannerData((prev) => {
      const currentTasks = prev.tasksByDay[activeDayId] || [];
      const nextTasks = currentTasks.filter((task) => task.id !== activeTaskId);
      return {
        ...prev,
        tasksByDay: {
          ...prev.tasksByDay,
          [activeDayId]: nextTasks,
        },
      };
    });
    handleCancelAdd();
  };

  const activeTask =
    activeDayId && activeTaskId
      ? plannerData.tasksByDay[activeDayId]?.find(
          (task) => task.id === activeTaskId
        )
      : null;

  return (
    <div className="page">
      <main className="App">
        <div className="sidebar">
          <img src={avatar} alt="profile" className="profile"/>

          <div className="borderLine">
          </div>
        </div>

        <div className="mainContent">
          <div className="title">
            <div className="t1">Task-Manager</div>
            <div className="t2">v.0.2</div>
          </div>

          <div className="typeViewBar">
            <div className="typeView">
              <TypeView />
            </div>
            <div className="snfSelect"></div>
          </div>

          <div className="taskList">
            <TaskListComponent
              days={plannerData.days}
              tasksByDay={plannerData.tasksByDay}
              onAddTask={handleOpenAdd}
              onEditTask={handleOpenEdit}
              dayCaps={plannerData.dayCaps}
            />
          </div>
        </div>
      </main>
      <AddTaskModal
        isOpen={isAddOpen}
        mode={modalMode}
        initialData={activeTask}
        initialDayId={activeDayId}
        dayOptions={plannerData.days}
        onCancel={handleCancelAdd}
        onAdd={handleAddTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}

export default App;
