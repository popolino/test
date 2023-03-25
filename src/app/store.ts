import {
  configureStore,
  ThunkAction,
  Action,
  ActionCreatorsMapObject,
  AsyncThunk,
} from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import { todoReducer } from "../features/todo/Todo.slice";
import { useAppDispatch } from "./hooks";
import { useMemo } from "react";
import bindActionCreators from "react-redux/es/utils/bindActionCreators";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todo: todoReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export const useActionCreators = <Actions extends ActionCreatorsMapObject>(actions: Actions): BoundActions<Actions> => {
  const dispatch = useAppDispatch();

  // @ts-ignore
  return useMemo(() => bindActionCreators(actions, dispatch), []);
};

type BoundActions<Actions extends ActionCreatorsMapObject> = {
  [key in keyof Actions]: Actions[key] extends AsyncThunk<any, any, any>
    ? BoundAsyncThunk<Actions[key]>
    : Actions[key];
};

type BoundAsyncThunk<Thunk extends AsyncThunk<any, any, any>> = (
  ...args: Parameters<Thunk>
) => ReturnType<ReturnType<Thunk>>;
