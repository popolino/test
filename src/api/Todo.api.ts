import axios from "./index";
import {
  ICreateTodoRequest,
  IEditTodoRequest,
  TTodo,
} from "../features/todo/todo.types";

export const todoApi = {
  getTodos: () => axios.get<TTodo[]>("todos"),
  addTodo: (todo: ICreateTodoRequest) => axios.post<TTodo>("todos", todo),
  editTodo: (todo: IEditTodoRequest) =>
    axios.patch<TTodo>(
      `todos/${todo.id}`,
      todo.title
        ? {
            title: todo.title,
            completed: todo.completed,
          }
        : { completed: todo.completed }
    ),
  deleteTodo: (id: number) => axios.delete(`todos/${id}`),
};
