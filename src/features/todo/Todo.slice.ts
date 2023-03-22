import { TTodo } from "./todo.types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodoMocks } from "./todo.mocks";
import { AppThunk } from "../../app/store";
import { todoApi } from "../../api/Todo.api";

export interface TodoState {
  todos: TTodo[];
  text: string;
  fetchingStatus: "idle" | "loading" | "failed";
  errorMessage: string | undefined;
}

const initialState: TodoState = {
  todos: [],
  text: "",
  fetchingStatus: "idle",
  errorMessage: undefined,
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
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.pending, (state) => {
      state.fetchingStatus = "loading";
    });
    builder.addCase(fetchTodos.fulfilled, (state, { payload }) => {
      state.todos = payload;
      state.fetchingStatus = "idle";
    });
    builder.addCase(fetchTodos.rejected, (state, { payload }) => {
      state.fetchingStatus = "failed";
      state.errorMessage = payload;
    });
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
export const fetchTodos = createAsyncThunk<
  TTodo[],
  void,
  { rejectValue: string }
>("todo/fetchTodos", async (_, { rejectWithValue }) => {
  try {
    const { data } = await todoApi.getTodos();
    return data;
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const { setText, createTodo } = todoSlice.actions;

export default todoSlice.reducer;
