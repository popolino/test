import { TTodo } from "./todo.types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { todoApi } from "../../api/todoApi/todo.api";
import {
  isFulfilledAction,
  isPendingAction,
  isRejectedAction,
} from "../../utils";

export interface TodoState {
  todos: TTodo[];
  newTodoText: string;
  editTodoText: string;
  status: "idle" | "loading" | "failed";
  message: any;
  editable: TTodo | null;
  meta: {
    fetching: boolean;
    creating: boolean;
    updating: boolean;
    deleting: number[];
  };
}

const initialState: TodoState = {
  todos: [],
  newTodoText: "",
  editTodoText: "",
  status: "idle",
  editable: null,
  message: "",
  meta: {
    fetching: false,
    creating: false,
    updating: false,
    deleting: [],
  },
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setNewTodoText: (state, action: PayloadAction<string>) => {
      state.newTodoText = action.payload;
    },
    setEditTodoText: (state, action: PayloadAction<string>) => {
      state.editTodoText = action.payload;
    },
    setEditable: (state, action: PayloadAction<TTodo | null>) => {
      if (state.editable?.id === action.payload?.id) return;
      state.editable = action.payload;
      state.editTodoText = action.payload?.title || "";
    },
    editTodo: (state, action: PayloadAction<TTodo>) => {
      state.todos = state.todos.map((todo) =>
        action.payload.id === todo.id ? action.payload : todo
      );
    },
    toggleDeleting: (state, action: PayloadAction<number>) => {
      if (state.meta.deleting.includes(action.payload))
        state.meta.deleting = state.meta.deleting.filter(
          (id) => id !== action.payload
        );
      else state.meta.deleting.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    // FETCH

    builder.addCase(fetchTodos.pending, (state) => {
      state.meta.fetching = true;
    });
    builder.addCase(fetchTodos.fulfilled, (state, { payload }) => {
      state.meta.fetching = false;
      state.todos = payload;
    });
    builder.addCase(fetchTodos.rejected, (state) => {
      state.meta.fetching = false;
    });

    // ADD

    builder.addCase(addTodoAsync.pending, (state) => {
      state.meta.creating = true;
    });
    builder.addCase(addTodoAsync.fulfilled, (state, { payload }) => {
      state.meta.creating = false;
      state.todos.push(payload);
      state.newTodoText = "";
    });
    builder.addCase(addTodoAsync.rejected, (state) => {
      state.meta.creating = false;
    });

    // EDIT

    builder.addCase(editTodoAsync.pending, (state) => {
      state.meta.updating = true;
    });
    builder.addCase(editTodoAsync.fulfilled, (state, { payload }) => {
      state.meta.updating = false;
      state.todos = state.todos.map((todo) =>
        payload.id === todo.id ? payload : todo
      );
      state.editTodoText = "";
      state.editable = null;
    });
    builder.addCase(editTodoAsync.rejected, (state) => {
      state.meta.updating = false;
    });

    // DELETE

    builder.addCase(deleteTodoAsync.fulfilled, (state, { payload }) => {
      const todoTitle = state.todos.find((todo) => todo.id === payload)?.title;
      state.todos = state.todos.filter((todo) => todo.id !== payload);
      if(!todoTitle) return
      state.message = `Задание ${todoTitle} удалено`
    });

    builder.addMatcher(isPendingAction, (state) => {
      state.status = "loading";
      state.message = "";
    });
    builder.addMatcher(isFulfilledAction, (state) => {
      state.status = "idle";
    });
    builder.addMatcher(isRejectedAction, (state, { payload }) => {
      state.status = "failed";
      if (!payload) return;
      state.message = payload;
    });
  },
});

export const fetchTodos = createAsyncThunk(
  "todoApi/fetchTodos",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await todoApi.getTodos();
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const deleteTodoAsync = createAsyncThunk(
  "todoApi/deleteTodoAsync",
  async (id: number, { rejectWithValue, dispatch }) => {
    dispatch(todoActions.toggleDeleting(id));
    try {
      await todoApi.deleteTodo(id);
      dispatch(todoActions.toggleDeleting(id));
      return id;
    } catch (e: any) {
      dispatch(todoActions.toggleDeleting(id));
      return rejectWithValue(e.message);
    }
  }
);

export const editTodoAsync = createAsyncThunk(
  "todoApi/editTodoAsync",
  async (todo: TTodo, { rejectWithValue }) => {
    try {
      const { data } = await todoApi.editTodo(todo);
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);
export const optimisticEditTodoAsync = createAsyncThunk(
  "todoApi/optimisticEditTodoAsync",
  async (todo: TTodo, { rejectWithValue, getState, dispatch }) => {
    const globalState = getState() as RootState;
    const oldTodo = globalState.todo.todos.find((t) => t.id === todo.id);
    if (!oldTodo) return;
    dispatch(todoActions.editTodo(todo));
    try {
      await todoApi.editTodo(todo);
      return todo;
    } catch (e: any) {
      dispatch(todoActions.editTodo(oldTodo));
      return rejectWithValue(e.message);
    }
  }
);

export const addTodoAsync = createAsyncThunk(
  "todoApi/addTodoAsync",
  async (_, { rejectWithValue, getState }) => {
    const globalState = getState() as RootState;
    try {
      const todo = {
        userId: 1,
        title: globalState.todo.newTodoText,
        completed: false,
      };
      const { data } = await todoApi.addTodo(todo);
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const { reducer: todoReducer, actions: todoActions } = todoSlice;
