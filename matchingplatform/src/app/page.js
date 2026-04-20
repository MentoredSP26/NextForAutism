"use client"
import Image from "next/image";
import styles from "./page.module.css";
import App from "./admin/page";
import TodoList from "../components/TodoList/TodoList.jsx"

export default function Home() {
  return (
    <div>
      <p>This is the home page (Next 4 Autism).</p>
      {/* <App /> */}
      <TodoList />
    </div>
    
  );
}