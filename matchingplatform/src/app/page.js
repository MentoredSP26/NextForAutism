import Image from "next/image";
import styles from "./page.module.css";
import NavBar from '../components/NavBar/page';
import ContainerBox from '../components/ContainerBox/page'

export default function Home() {
  const buttons = [
            {text: 'Dashboard',
            path:null},
            {text: 'Profile',
            path:null}  
        ]
  return (<div>
    <NavBar buttons={buttons}/>
      <p>
        This is the home page (Next 4 Autism).
      </p>
    </div>

  );
}
