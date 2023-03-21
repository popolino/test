import { TTodo } from "./todo.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TodoState {
  todos: TTodo[];
  text: string;
  fetchingStatus: "idle" | "loading" | "failed";
}

const initialState: TodoState = {
  todos: [],
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
  },
});

export const { setText } = todoSlice.actions;

export default todoSlice.reducer;
