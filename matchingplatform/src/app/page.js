import Image from "next/image";
import styles from "./page.module.css";
import NavBar from '../components/navbar/page';
import AdminHeader from '../components/adminHeader/page';

export default function Home() {
  const buttons = [
    { page: 'Dashboard', path: '/dashboard', icon: "home.png" },
    { page: 'Profile', path: '/profile', icon: 'profile.png' },
  ];
  return (
    <div>
      <NavBar buttons={buttons} profile='Aspiring' user='user' email='email'/>
      {/* <p>
        This is the home page (Next 4 Autism).
      </p> */}
    </div>
  );
}
