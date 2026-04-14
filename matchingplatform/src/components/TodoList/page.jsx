"use client";
import { useState } from 'react';
import { initialTodos } from './todos.js';

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
    <div className='todo bar'>
      <h1>
        To do
      </h1>
      <h2>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <div>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggle(todo.id)}
              />
              {' '}
              {todo.completed ? <s>{todo.text}</s> : todo.text}
            </div>
            <p>{todo.decription}</p>
            <p>Due in {getDaysUntil(todo.duedate)} day</p>
          </li>
        ))}
      </ul>
      </h2>
    </div>
  );
}
