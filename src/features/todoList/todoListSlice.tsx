import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface TodoItem {
  id: number;
  content: string;
  isDone: boolean;
}

function getTodoList():TodoItem[] {
  const tmp = localStorage.getItem("todos");
  if (tmp !== null) {
    const todos = JSON.parse(tmp);
    if (Array.isArray(todos)) {
      return todos;
    }
  } 
  return [];
}

function saveTodoList(todoList: TodoItem[]) {
  localStorage.setItem("todos", JSON.stringify(todoList));
}

const initialState: {
  items: TodoItem[];
  editId: number | null;
  todo: string;
} = {
  items: getTodoList(),
  editId: null,
  todo: "",
};

export const todoListSlice = createSlice({
  name: 'todoList',
  initialState,
  reducers: {
    itemAdded: (state) => {
      // Not to add empty string
      if (state.todo.length === 0) {
        return;
      }
      const id = state.items.length > 0 ? state.items[state.items.length - 1].id + 1 : 0;
      state.items.push({
        id,
        content: state.todo,
        isDone: false
      });
      state.todo = "";
    },

    itemDeleted: (state, action: {payload: number}) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1)
        state.items.splice(index, 1);
    },
    
    itemEdited: (state) => {
      const index = state.items.findIndex(item => item.id === state.editId);
      if (index !== -1) {
        if (state.todo === "" && typeof state.editId === "number") {
          const index = state.items.findIndex(item => item.id === state.editId);
          if (index !== -1) {
            state.items.splice(index, 1);
            state.editId = null;
          }
          return;
        }
        state.items[index].content = state.todo;
        state.todo = "";
        state.editId = null;
      }
    },

    switchChecked: (state, action: {payload: number}) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.items[index].isDone = !state.items[index].isDone;
      }
    },

    editIdUpdated: (state, action: {payload: number}) => {
      state.editId = action.payload;
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.todo = state.items[index].content;
      }
    },

    todoChanged: (state, action: {payload: string}) => {
      state.todo = action.payload;
    },

    saved: (state) => {
      saveTodoList(state.items);
    }
  }
});

export const selectTodoItems = (state: RootState) => state.todoList.items;
export const selectEditId = (state: RootState) => state.todoList.editId;
export const selectTodo = (state: RootState) => state.todoList.todo;
export const {
  itemAdded, 
  itemEdited, 
  itemDeleted, 
  switchChecked, 
  editIdUpdated, 
  todoChanged,
  saved,
} = todoListSlice.actions;
export default todoListSlice.reducer;