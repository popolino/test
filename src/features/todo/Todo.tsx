import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addTodo,
  createTodo,
  cutTodo,
  deleteTodo,
  editTodo,
  fetchTodos,
  setEditText,
  setShowInput,
  setText,
  updateTodo,
} from "./Todo.slice";

const Todo = () => {
  const {
    text,
    todos,
    fetchingStatus,
    errorMessage,
    mutatingStatus,
    editText,
    showInput,
    deletingProgress,
  } = useAppSelector((state) => state.todo);
  const dispatch = useAppDispatch();

  // const [showInput, setShowInput] = useState(false);
  const [currentActive, setCurrentActive] = useState<number>();
  const handleShowInput = (showInput: boolean) =>
    dispatch(setShowInput(showInput));
  const handleClickTodo = (id: number, title: string) => {
    handleChangeEditText(title);
    setCurrentActive(id);
    handleShowInput(currentActive !== id);
  };
  const handleEditTodo = (id: number, completed?: boolean) => {
    dispatch(updateTodo(id, completed));
  };
  const handleChangeEditText = (text: string) => dispatch(setEditText(text));
  const handleChangeText = (text: string) => dispatch(setText(text));
  const handleCreateTodo = () => dispatch(addTodo());
  const handleDeleteTodo = (id: number) => dispatch(cutTodo(id));

  useEffect(() => {
    dispatch(fetchTodos());
  }, []);
  return (
    <>
      <div>
        <input
          type="text"
          value={text}
          onChange={(event) => handleChangeText(event.target.value)}
        />
        <button onClick={handleCreateTodo}>
          {mutatingStatus === "loading" ? "..." : "Add"}
        </button>
      </div>
      {errorMessage && <div>{errorMessage}</div>}
      {fetchingStatus === "idle" && (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <div style={{ display: "flex", gap: "20px" }}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleEditTodo(todo.id, !todo.completed)}
                />
                <div
                  onClick={() => handleClickTodo(todo.id, todo.title)}
                  className={todo.completed ? "completed" : ""}
                >
                  {todo.title}
                </div>
                <button onClick={() => handleDeleteTodo(todo.id)}>
                  {deletingProgress.some((id) => id === todo.id)
                    ? "..."
                    : "Delete"}
                </button>
              </div>
              {showInput && currentActive === todo.id && (
                <div>
                  <input
                    type="text"
                    value={editText}
                    onChange={(event) =>
                      handleChangeEditText(event.target.value)
                    }
                  />
                  <button onClick={() => handleEditTodo(todo.id)}>
                    {mutatingStatus === "loading" ? "..." : "Edit"}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {fetchingStatus === "loading" && <div>Loading...</div>}
    </>
  );
};
export default Todo;
