import Image from "next/image";
import styles from "./page.module.css";
import App from "./admin/page";

export default function Home() {
  return (
    <div>
      <p>This is the home page (Next 4 Autism).</p>
      <App />
    </div>
  );
}
