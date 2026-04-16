"use client"
import Image from "next/image";
import styles from "./page.module.css";
import TodoList from "@/components/TodoList/page";
import RecentActivity from "@/components/RecentActivity/page";

export default function Home() {
  return (
    <div>
      <TodoList />
    </div>
    
  );
}