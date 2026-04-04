"use client"
import Image from "next/image";
import styles from "./page.module.css";
import TodoList from "@/components/todo section/page";

export default function Home() {
  return (
    <p>
      <TodoList />
    </p>
    
  );
}