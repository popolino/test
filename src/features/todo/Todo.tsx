import React, { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import {
  addTodoAsync,
  editTodoAsync,
  fetchTodos,
  optimisticEditTodoAsync,
  todoActions,
  deleteTodoAsync,
} from "./Todo.slice";
import { TTodo } from "./todo.types";
import { useActionCreators } from "../../app/store";
import { useSnackbar } from "notistack";

const allActions = {
  ...todoActions,
  deleteTodoAsync,
  fetchTodos,
  addTodoAsync,
  editTodoAsync,
  optimisticEditTodoAsync,
};

const Todo = () => {
  const actions = useActionCreators(allActions);

  const newTodoText = useAppSelector((state) => state.todo.newTodoText);
  const editable = useAppSelector((state) => state.todo.editable);
  const editTodoText = useAppSelector((state) => state.todo.editTodoText);
  const todos = useAppSelector((state) => state.todo.todos);
  const status = useAppSelector((state) => state.todo.status);
  const message = useAppSelector((state) => state.todo.message);
  const fetching = useAppSelector((state) => state.todo.meta.fetching);
  const creating = useAppSelector((state) => state.todo.meta.creating);
  const updating = useAppSelector((state) => state.todo.meta.updating);
  const deleting = useAppSelector((state) => state.todo.meta.deleting);

  const { enqueueSnackbar } = useSnackbar();

  const handleChangeNewTodoText = (text: string) =>
    actions.setNewTodoText(text);
  const handleChangeEditTodoText = (text: string) =>
    actions.setEditTodoText(text);
  const handleCreateTodo = () => actions.addTodoAsync();
  const handleEditTodo = () =>
    editable && actions.editTodoAsync({ ...editable, title: editTodoText });
  const handleChangeTodoCompleted = (todo: TTodo) =>
    actions.optimisticEditTodoAsync({ ...todo, completed: !todo.completed });
  const handleSetEditable = (todo: TTodo) => actions.setEditable(todo);
  const handleDeleteTodo = (id: number) => actions.deleteTodoAsync(id);

  useEffect(() => {
    message &&
      enqueueSnackbar(message, {
        variant: status === "failed" ? "error" : "info",
      });
  }, [message]);

  useEffect(() => {
    actions.fetchTodos();
  }, []);
  return (
    <div className="wrapper">
      <div>
        <input
          type="newTodoText"
          value={newTodoText}
          onChange={(event) => handleChangeNewTodoText(event.target.value)}
        />
        <button onClick={handleCreateTodo} disabled={creating}>
          {!creating ? "Add" : "* * *"}
        </button>
      </div>

      <ul>
        {fetching ? (
          <div className="loading">loading...</div>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? "completed" : ""}>
              <div className="todo">
                <div>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleChangeTodoCompleted(todo)}
                  />
                  {editable?.id !== todo.id ? (
                    <div onClick={() => handleSetEditable(todo)}>
                      <p>{todo.title}</p>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={editTodoText}
                        onChange={(event) =>
                          handleChangeEditTodoText(event.target.value)
                        }
                      />
                      <button
                        onClick={() => handleEditTodo()}
                        disabled={updating}
                        className={updating ? "loading" : ""}
                      >
                        {updating ? "* * *" : "save"}
                      </button>
                    </div>
                  )}
                </div>
                <button onClick={() => handleDeleteTodo(todo.id)}>{deleting.some(id => id === todo.id) ? '* * *' : 'delete'}</button>
              </div>
            </li>
          ))
        )}
      </ul>
      {}
      {!fetching && !todos.length && <div>there is no tasks yet</div>}
    </div>
  );
};
export default Todo;
