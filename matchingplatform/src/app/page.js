"use client"
import Image from "next/image";
import styles from "./page.module.css";
import App from "./admin/page";
import TodoList from "../components/TodoList/TodoList.jsx"
import WeeklyMaterials from "../components/WeeklyMaterials/WeeklyMaterials.jsx";

export default function Home() {
  return (
    <div>
      <WeeklyMaterials />
    </div>
    
  );
}