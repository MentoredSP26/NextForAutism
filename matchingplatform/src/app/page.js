import Image from "next/image";
import styles from "./page.module.css";
import TodoList from "@/components/todo section/page";
import RecentActivity from "@/components/Admin Recent Activities/page";

export default function Home() {
  return (
    <p>
      <RecentActivity />
    </p>
    
  );
}
