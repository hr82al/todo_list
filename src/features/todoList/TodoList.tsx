import {
  selectTodoItems,
  itemAdded,
  itemDeleted,
  itemEdited,
  switchChecked,
  TodoItem,
  selectEditId,
  editIdUpdated,
  todoChanged,
  selectTodo,
  saved,
} from './todoListSlice'
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { BiEditAlt, BiSolidMessageSquareAdd } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai'


function ItemEditor({ itemId }: { itemId: number }) {
  const dispatch = useAppDispatch();
  function handleDelete(id: number) {
    dispatch(itemDeleted(id));
  }

  function handleStartEdit(id: number) {
    dispatch(editIdUpdated(id));
  }

  return (
    <span className='edit-btns'>
      <AiFillDelete onClick={() => handleDelete(itemId)} />
      <BiEditAlt onClick={() => handleStartEdit(itemId)} />
    </span>
  )
}

function ListItem({item}: {item: TodoItem}) { 
  const [isShowMenu, setIsShowMenu] = useState(false);
  const dispatch = useAppDispatch();

  function handleCheck(id: number) {
    dispatch(switchChecked(id));
  }

  return (
    <li
      className='edit-li'
      onMouseOver={() => setIsShowMenu(true)}
      onMouseLeave={() => setIsShowMenu(false)}
    >
      <input
        style={{padding: "auto"}}
        type="checkbox"
        checked={item.isDone}
        onChange={() => handleCheck(item.id)}
        name="checked-item"
      />
      {item.content}
      {isShowMenu && (
        <ItemEditor itemId={item.id} />
      )}
    </li>
  );
}

export default function TodoList() {
  const todo = useAppSelector(selectTodo);
  const todoList =  useAppSelector(selectTodoItems);
  const editId = useAppSelector(selectEditId);
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return () => {
      dispatch(saved());
    }
  })

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    dispatch(todoChanged(e.target.value));
  }

  if (editId !== null) {
    inputRef.current?.focus();
  }

  const items = todoList.map((item: TodoItem) => {
    return <ListItem key={item.id} item={item} />
  });

  function handleSubmit() {
    if (editId !== null) {
      handleConfirmEdit();
    } else {
      handleAdd();
    }
  }
  function handleConfirmEdit() {
    dispatch(itemEdited());
  }

  function handleAdd() {
    dispatch(itemAdded());
    inputRef.current?.focus();
  }

  function handleEnter(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key == 'Enter' &&  e.shiftKey) {
      handleSubmit();
    }
  }

  return (
    <div>
      <h1>ToDo List</h1>
      <ul>
        {items}
      </ul>
      <div className='todo-input'>
        <textarea
          ref={inputRef}
          onChange={handleChange}
          onKeyUp={handleEnter}
          placeholder='Input your ToDo and press a ➕ button at bottom or Shift➕Enter'
          value={todo}
          name="add-todo-item"
        />
        <button onClick={handleSubmit}>
          {editId !== null ? (
            <BiEditAlt />
          ) : (
            <BiSolidMessageSquareAdd />
          )}
        </button>
      </div>
    </div>
  );
}
