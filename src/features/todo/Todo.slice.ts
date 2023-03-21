import { TTodo } from "./todo.types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodoMocks } from "./todo.mocks";
import { AppThunk } from "../../app/store";
import { todoApi } from "../../api/Todo.api";

export interface TodoState {
  todos: TTodo[];
  text: string;
  fetchingStatus: "idle" | "loading" | "failed";
}

const initialState: TodoState = {
  todos: TodoMocks,
  text: "",
  fetchingStatus: "idle",
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
    createTodo: (state, action: PayloadAction<TTodo>) => {
      state.todos.push(action.payload);
    },
  },
});

export const addTodo = (): AppThunk => (dispatch, getState) => {
  dispatch(
    createTodo({
      id: 2,
      userId: 1,
      title: getState().todo.text,
      completed: true,
    })
  );
  dispatch(setText(""));
};
export const fetchTodos = createAsyncThunk(
  "todo/fetchTodos",
  async (_, thunkAPI) => {
    console.log("sfsdv");
    const result = await todoApi.getTodos();
    console.log(result);
  }
);

export const { setText, createTodo } = todoSlice.actions;

export default todoSlice.reducer;
