'use client';

import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import SignInOut from "./sign-in-out";
import { onAuthStateChangedHelper } from "../utils/firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Upload from "./upload";


export default function Navbar() {
    // Initialize user state
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    });

    return (
        <nav className={styles.navbar}>
            <Link href="/">
                <Image src="/youtube-logo.svg" alt="Youtube logo" width={90} height={20}/> 
            </Link>
            {
                user &&  <Upload/>
            }
            <SignInOut user={user} />
        </nav>
    );
}