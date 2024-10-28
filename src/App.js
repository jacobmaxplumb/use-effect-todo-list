import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [message, setMessage] = useState("text must be at least 5 characters long");

  const getTodos = async () => {
    const { data: todoItems } = await axios.get("http://localhost:9000/todos");
    setTodos(todoItems);
  };

  const addTodo = async () => {
    const todoItem = { text: text, completed: false };
    const { data } = await axios.post("http://localhost:9000/todos", todoItem);
    setTodos([...todos, data]);
    setText('');
  };

  const markTodoAsCompleted = async (todo) => {
    const todoItem = {...todo, completed: true};
    await axios.put(`http://localhost:9000/todos/${todo.id}`, todoItem);
    getTodos();
  }

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    if (text.trim().length < 5) {
      setIsDisabled(true);
      setMessage("text must be at least 5 characters long");
    } else {
      setIsDisabled(false);
      setMessage("");
    }
  }, [text]);

  return (
    <div style={{ margin: "10px" }}>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      {message && <p>{message}</p>}
      <button disabled={isDisabled} onClick={addTodo}>Add</button>
      {todos.map((todo) => (
        <div
          onClick={() => markTodoAsCompleted(todo)}
          style={{ textDecoration: todo.completed ? "line-through" : "" }}
          key={todo.id}
        >
          {todo.text}
        </div>
      ))}
    </div>
  );
}

export default App;
