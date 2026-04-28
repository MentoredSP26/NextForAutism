"use client"
import Image from "next/image";
import styles from "./page.module.css";
import App from "./admin/page";
import TodoList from "../components/TodoList/TodoList.jsx"
import EstablishedProfile from "./established/profile.jsx";

export default function Home() {
  return (
    <div>
      <EstablishedProfile />
    </div>
    
  );
}