import React, { useState, useEffect } from "react";
import "./App.css";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [toShow, setToShow] = useState("all");

  const add = (e) => {
    if (e.key === "Enter") {
      setTasks((rest) => [
        ...rest,
        {
          name: e.target.value,
          isChecked: e.target.checked,
        },
      ]);
    }
  };

  //TODO : box de confirmation
  const deleteItem = (index) => {
    let itemsClone = [...tasks];
    confirmAlert({
      title: "Supprimer l'élément",
      message: "Êtes vous sûr de vouloir supprimer cet élément ?",
      buttons: [
        {
          label: "Oui",
          onClick: () => {
            itemsClone.splice(index, 1);
            setTasks(itemsClone);
          },
        },
        {
          label: "Non",
        },
      ],
    });
  };

  const checkAll = () => {
    let checkAllTasks = [...tasks];
    if (isAllChecked === false) {
      checkAllTasks.forEach((el) => {
        el.isChecked = true;
      });
      setTasks(checkAllTasks);
      setIsAllChecked(true);
    } else {
      checkAllTasks.forEach((el) => {
        el.isChecked = false;
      });
      setTasks(checkAllTasks);
      setIsAllChecked(false);
    }
  };

  const checked = (index) => (e) => {
    let tempTasks = [...tasks];
    if (tempTasks[index].isChecked === false) {
      tempTasks[index].isChecked = true;
    } else {
      tempTasks[index].isChecked = false;
    }
    setTasks(tempTasks);
  };

  const clearComplete = () => {
    let clearCompleteTasks = [...tasks];
    // NE FONCTIONNE PAS SUR 2 ELEMENTS DE SUITE A SUPPRIMER
    // clearCompleteTasks.forEach((el) => {
    //   let index = clearCompleteTasks.indexOf(el);
    //   if (el.isChecked === true) {
    //     clearCompleteTasks.splice(index, 1);
    //   }
    // });
    confirmAlert({
      title: "Supprimer les éléments compélés",
      message: "Êtes vous sûr de vouloir supprimer les éléments compélétés ?",
      buttons: [
        {
          label: "Oui",
          onClick: () => {
            for (
              let index = clearCompleteTasks.length - 1;
              index >= 0;
              index -= 1
            ) {
              if (clearCompleteTasks[index].isChecked === true) {
                clearCompleteTasks.splice(index, 1);
              }
            }
            setTasks(clearCompleteTasks);
          },
        },
        {
          label: "Non",
        },
      ],
    });
  };

  useEffect(() => {
    const storage = localStorage.getItem("task");
    if (storage) {
      setTasks(JSON.parse(storage));
    }
  }, []);

  useEffect(() => {
    if (tasks) {
      localStorage.setItem("task", JSON.stringify(tasks));
    }
  }, [tasks]);

  return (
    <div className="App">
      <h2>TOUDOU APP</h2>
      <input
        className="add-item"
        type="text"
        placeholder="Insert toudou item"
        onKeyPress={add}
      />
      {toShow === "all"
        ? tasks.map((item, index) => (
            <div className="single-item" key={index}>
              <div>
                <input
                  id={index}
                  className="single-task"
                  type="checkbox"
                  checked={item.isChecked}
                  onClick={checked(index)}
                />
                <label for={index}>{item.name}</label>
              </div>
              <i
                className="fas fa-trash-alt"
                onClick={() => deleteItem(index)}
              ></i>
            </div>
          ))
        : toShow === "active"
        ? tasks
            .filter((item) => {
              if (item.isChecked === false) {
                return true;
              } else {
                return false;
              }
            })
            .map((filtereditem, index) => (
              <div className="single-item" key={index}>
                <div>
                  <input
                    id={index}
                    className="single-task"
                    type="checkbox"
                    checked={filtereditem.isChecked}
                    onClick={checked(index)}
                  />
                  <label for={index}>{filtereditem.name}</label>
                </div>
                <i
                  className="fas fa-trash-alt"
                  onClick={() => deleteItem(index)}
                ></i>
              </div>
            ))
        : toShow === "complete" &&
          tasks
            .filter((item) => {
              if (item.isChecked === true) {
                return true;
              } else {
                return false;
              }
            })
            .map((filtereditem, index) => (
              <div className="single-item" key={index}>
                <div>
                  <input
                    id={index}
                    className="single-task"
                    type="checkbox"
                    checked={filtereditem.isChecked}
                    onClick={checked(index)}
                  />
                  <label for={index}>{filtereditem.name}</label>
                </div>
                <i
                  className="fas fa-trash-alt"
                  onClick={() => deleteItem(index)}
                ></i>
              </div>
            ))}
      <hr />
      <div className="check-all">
        <label>
          <input type="checkbox" onClick={checkAll} checked={isAllChecked} />
          Check all
        </label>
        <p>
          {tasks.filter((item) => item.isChecked === false).length} items left
        </p>
      </div>

      <hr />
      <div className="buttons">
        <button onClick={() => setToShow("all")}>All</button>
        <button onClick={() => setToShow("active")}>Active</button>
        <button onClick={() => setToShow("complete")}>Complete</button>
        <button onClick={clearComplete}>Clear Completed</button>
      </div>
    </div>
  );
};

export default App;
