import axios from "./index";
import { TTodo } from "../features/todo/todo.types";

export const todoApi = {
  getTodos: () => axios.get<TTodo[]>("tods"),
};
