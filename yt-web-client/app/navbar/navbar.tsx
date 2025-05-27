import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Link href="/">
                <Image src="/youtube-logo.svg" alt="Youtube logo" width={90} height={20}/> 
            </Link>
        </nav>
    );
}