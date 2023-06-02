import React, { useEffect, useState } from "react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const newTodo = {
        label: inputValue,
        done: false
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
    }
  };

  useEffect(() => {
    fetchTodosFromServer();
  }, []);

  const fetchTodosFromServer = () => {
    fetch("https://assets.breatheco.de/apis/fake/todos/user/ginajohana")
      .then(response => response.json())
      .then(response => {
        setTodos(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const syncTodosWithServer = (updatedTodos) => {
    fetch("https://assets.breatheco.de/apis/fake/todos/user/ginajohana", {
      method: "PUT",
      body: JSON.stringify(updatedTodos),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data); 
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleDelete = (label) => {
    const updatedTodos = todos.filter((todo) => todo.label !== label);
    setTodos(updatedTodos);
    syncTodosWithServer(updatedTodos);
  };

  const handleClearAll = () => {
    setTodos([]);
    syncTodosWithServer([]);
  };

  useEffect(() => {
    syncTodosWithServer(todos);
  }, [todos]);

  return (
    <div className="notebook my-5">
      <h1 className="title">To Do</h1>
      <ul className="todo-list">
        <li>
          <input
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyPress={handleKeyPress}
            placeholder="What to do"
            className="input-task"
          />
        </li>
        {todos.length === 0 ? (
          <li key="empty-task" className="empty-task">
            No tasks, add tasks
          </li>
        ) : (
          todos.map((todo, index) => (
            <li key={index}>
              <span>{todo.label}</span>
              <button
                className="delete-button"
                onClick={() => handleDelete(todo.label)}
              >
                X
              </button>
            </li>
          ))
        )}
      </ul>
      <div className="task-count">{todos.length} item left</div>
      <button className="clear-button" onClick={handleClearAll}>
        Clear All
      </button>
    </div>
  );
};

export default Home;
