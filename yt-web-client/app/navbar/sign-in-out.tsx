'use client';

import { Fragment } from 'react';
import { signInWithGoogle, signOutAuth } from '../utils/firebase/firebase';
import styles from './sign-in-out.module.css';
import { User } from "firebase/auth";


interface SignInOutProps {
    user: User | null;
}


export default function SignInOut({ user }: SignInOutProps) {
    return (
        <Fragment>
            {user? (
                // If user is signed in, show a welcome message (or something else)
                <button className={styles.signinout} onClick={signOutAuth}>
                    Sign Out
                </button>
            ) : (
                // If user is not signed in, show sign-in button
                <button className={styles.signinout} onClick={signInWithGoogle}>
                    Sign In
                </button>
            )}
        </Fragment>
    );
}