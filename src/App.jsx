import "./App.css";
import TaskListComponent from "./components/MainContent/TaskList/taskList.jsx";
import TypeView from "./components/MainContent/TypeView/typeView.jsx";
import SideBarSelectComponent from "./components/SideBar/SideBarSelect/sideBarSelectIco.jsx";

function App() {
  const tags = ["Homework"];

  return (
    <div className="page">
      <main className="App">
        <div className="sidebar">
          <div className="profile"></div>
          <div className="selectBar">
            <SideBarSelectComponent />
          </div>
          <div className="borderLine"></div>
        </div>

        <div className="mainContent">
          <div className="title">
            <div className="t1">Task-Manager</div>
            <div className="t2">v.0.2</div>
          </div>

          <div className="typeViewBar">
            <div className="typeView"><TypeView /></div>
            <div className="snfSelect"></div>
          </div>

          <div className="taskList">
            <TaskListComponent tags={tags} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
