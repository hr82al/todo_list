import { configureStore } from "@reduxjs/toolkit";
import todolistReducer from '../features/todoList/todoListSlice'

export const store = configureStore({
  reducer: {
    todoList: todolistReducer,
  },
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;