import axios from "../index";
import { ICreateTodoRequest, TTodo } from "../../features/todo/todo.types";

export const todoApi = {
  getTodos: () => axios.get<TTodo[]>("todos"),
  addTodo: (todo: ICreateTodoRequest) => axios.post<TTodo>("todos", todo),
  editTodo: (todo: TTodo) =>
    axios.put<TTodo>(`todos/${todo.id}`, {
      userId: todo.userId,
      title: todo.title,
      completed: todo.completed,
    }),
  deleteTodo: (id: number) => axios.delete(`todos/${id}`)
};
