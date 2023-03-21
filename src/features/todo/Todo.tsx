import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setText } from "./Todo.slice";
import { TodoMocks } from "./todo.mocks";

const Todo = () => {
  const text = useAppSelector((state) => state.todo.text);
  const dispatch = useAppDispatch();
  const handleChangeText = (text: string) => dispatch(setText(text));
  return (
    <>
      <div>
        <input
          type="text"
          value={text}
          onChange={(event) => handleChangeText(event.target.value)}
        />
        <button>Add</button>
      </div>
      <ul>
        <li>ccc</li>
        {TodoMocks.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            {todo.title}
          </li>
        ))}
      </ul>
    </>
  );
};
export default Todo;
