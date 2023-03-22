import { ICreateTodoRequest, IEditTodoRequest, TTodo } from "./todo.types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../../app/store";
import { todoApi } from "../../api/Todo.api";

export interface TodoState {
  todos: TTodo[];
  text: string;
  fetchingStatus: "idle" | "loading" | "failed"; //status: переименовать в статусс
  mutatingStatus: "idle" | "loading" | "failed"; //mutatingProtress : boolean (сделаььб так началник сказал)
  errorMessage?: string;
  editText: string;
  showInput: boolean;
  deletingProgress: number[];
}

const initialState: TodoState = {
  todos: [],
  text: "",
  fetchingStatus: "idle",
  mutatingStatus: "idle",
  editText: "",
  showInput: false,
  deletingProgress: [],
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
    setEditText: (state, action: PayloadAction<string>) => {
      state.editText = action.payload;
    },
    editTodo: (
      state,
      action: PayloadAction<{ id: number; completed?: boolean }>
    ) => {
      state.todos.map((todo) => {
        if (todo.id === action.payload.id) {
          const newTodo = todo;
          if (!state.editText) newTodo.title = state.editText;
          if (action.payload.completed)
            newTodo.completed = action.payload.completed;
          return newTodo;
        } else return todo;
      });
    },
    setShowInput: (state, action: PayloadAction<boolean>) => {
      state.showInput = action.payload;
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    toggleDeleteProgress: (state, action: PayloadAction<number>) => {
      if (state.deletingProgress.includes(action.payload))
        state.deletingProgress = state.deletingProgress.filter(
          (id) => id !== action.payload
        );
      else state.deletingProgress.push(action.payload);
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

    builder.addCase(postTodo.pending, (state) => {
      state.mutatingStatus = "loading";
    });
    builder.addCase(postTodo.fulfilled, (state) => {
      state.mutatingStatus = "idle";
    });
    builder.addCase(postTodo.rejected, (state, { payload }) => {
      state.mutatingStatus = "failed";
      state.errorMessage = payload;
    });

    builder.addCase(patchTodo.pending, (state) => {
      state.mutatingStatus = "loading";
    });
    builder.addCase(patchTodo.fulfilled, (state) => {
      state.mutatingStatus = "idle";
    });
    builder.addCase(patchTodo.rejected, (state, { payload }) => {
      state.mutatingStatus = "failed";
      state.errorMessage = payload;
    });

    builder.addCase(removeTodo.fulfilled, (state) => {
      state.mutatingStatus = "idle";
    });
    builder.addCase(removeTodo.rejected, (state, { payload }) => {
      state.mutatingStatus = "failed";
      state.errorMessage = payload;
    });
  },
});

export const addTodo = (): AppThunk => async (dispatch, getState) => {
  const todoDTO = { userId: 1, title: getState().todo.text, completed: false };
  const todo = await dispatch(postTodo(todoDTO)).unwrap();
  dispatch(createTodo(todo));
  dispatch(setText(""));
};

export const updateTodo =
  (id: number, completed?: boolean): AppThunk =>
  async (dispatch, getState) => {
    const title = getState().todo.editText;
    const todoDTO = title ? { id, title, completed } : { id, completed };
    await dispatch(patchTodo(todoDTO));

    dispatch(editTodo({ id, completed }));
    dispatch(setShowInput(false));
  };
export const cutTodo =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    dispatch(toggleDeleteProgress(id));
    await dispatch(removeTodo(id));
    dispatch(deleteTodo(id));
    dispatch(toggleDeleteProgress(id));
  };

export const postTodo = createAsyncThunk<
  TTodo,
  ICreateTodoRequest,
  { rejectValue: string }
>("todo/postTodo", async (todo, { rejectWithValue }) => {
  try {
    const { data } = await todoApi.addTodo(todo);
    return data;
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});
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
export const patchTodo = createAsyncThunk<
  TTodo,
  IEditTodoRequest,
  { rejectValue: string }
>("todo/patchTodo", async (todo, { rejectWithValue }) => {
  try {
    const { data } = await todoApi.editTodo(todo);
    return data;
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});
export const removeTodo = createAsyncThunk<
  undefined,
  number,
  { rejectValue: string }
>("todo/removeTodo", async (id, { rejectWithValue }) => {
  try {
    await todoApi.deleteTodo(id);
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});
export const {
  setText,
  createTodo,
  setEditText,
  editTodo,
  setShowInput,
  deleteTodo,
  toggleDeleteProgress,
} = todoSlice.actions;

export default todoSlice.reducer;
