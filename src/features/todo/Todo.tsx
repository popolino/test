import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addTodo, createTodo, fetchTodos, setText } from "./Todo.slice";

const Todo = () => {
  const { text, todos } = useAppSelector((state) => state.todo);
  const dispatch = useAppDispatch();
  const handleChangeText = (text: string) => dispatch(setText(text));
  const handleCreateTodo = () => dispatch(addTodo());
  useEffect(() => {
    fetchTodos();
  }, []);
  return (
    <>
      <div>
        <input
          type="text"
          value={text}
          onChange={(event) => handleChangeText(event.target.value)}
        />
        <button onClick={handleCreateTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            {todo.title}
          </li>
        ))}
      </ul>
    </>
  );
};
export default Todo;
