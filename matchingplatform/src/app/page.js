"use client"
import Image from "next/image";
import styles from "./page.module.css";
<<<<<<< HEAD
<<<<<<< HEAD
import App from "./admin/page";

export default function Home() {
  return (
<<<<<<< HEAD
    <div>
      <App />
    </div>

=======
    <p>
=======
import TodoList from "@/components/TodoList/page";
import RecentActivity from "@/components/RecentActivity/page";
=======
import App from "./admin/page";
import TodoList from "../components/TodoList/TodoList";
>>>>>>> 4e3a922 (wip, styling todo)

export default function Home() {
  return (
    <div>
<<<<<<< HEAD
>>>>>>> 78783ec (fix styling)
=======
      <p>This is the home page (Next 4 Autism).</p>
      {/* <App /> */}
>>>>>>> 4e3a922 (wip, styling todo)
      <TodoList />
    </div>
    
>>>>>>> e86dfc5 (redo duedate)
  );
}