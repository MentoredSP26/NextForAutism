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
import RecentActivity from "@/components/Admin Recent Activities/page";

export default function Home() {
  return (
    <p>
      <RecentActivity />
    </p>
    
>>>>>>> 1d27642 (todo done)
  );
}