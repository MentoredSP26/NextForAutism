let nextId = 0;

export function createTodo(text, decription, duedate, completed = false) {
  return {
    id: nextId++,
    text,
    decription,
    duedate,
    completed
  };
}

export const initialTodos = [
  createTodo('Assignment Week 3', 'Professional Development Assignment', 'Due in Two days', false),
  createTodo('Meeting Week 2', 'Meet with Established Professional', 'In 1 day', true),
  createTodo('Meeting Week 4', false),
];
