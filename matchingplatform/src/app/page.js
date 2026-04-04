"use client"
import Image from "next/image";
import styles from "./page.module.css";
<<<<<<< HEAD
import App from "./admin/page";

export default function Home() {
  return (
    <div>
      <App />
    </div>

=======
import TodoList from "@/components/todo section/page";

export default function Home() {
  return (
    <p>
      <TodoList />
    </p>
    
>>>>>>> 1d27642 (todo done)
  );
}