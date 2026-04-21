"use client";
import './style.css';
import { useState } from 'react';
import { initialTodos } from './todos.js';
import ContainerBox from '../ContainerBox/page';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);


  function toggle(id) {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function getDaysUntil(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);

  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}



  return (
    <div>
      <ContainerBox header={<h1>To-do</h1>} body={
        <ul>
          {todos.map(todo => (
            <li key={todo.id} className="todo-row">  
              
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggle(todo.id)}
              />

              <div className="text-block">
                <div className="title">
                  {todo.completed ? <s>{todo.text}</s> : todo.text}
                </div>
                <div className="description">{todo.decription}</div>
              
              </div>

              <div className="due">
                Due in {getDaysUntil(todo.duedate)} days
              </div>
              
            </li>
          ))}
        </ul>
      } width='80vw'/>
    </div>
  );
}
