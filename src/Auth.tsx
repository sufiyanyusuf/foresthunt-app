import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import React, { useState, useEffect } from "react";
import App from "./App";
import { AuthState } from './types'

const googleProvider = new firebase.auth.GoogleAuthProvider();
const twitterProvider = new firebase.auth.TwitterAuthProvider();

// Find these options in your Firebase console
firebase.initializeApp({
    apiKey: "AIzaSyBsTPnpcAedeMKi0CFYQ8GoDyp_Za_NRQc",
    authDomain: "radar-70d48.firebaseapp.com",
    databaseURL: "https://radar-70d48.firebaseio.com",
    projectId: "radar-70d48",
    storageBucket: "radar-70d48.appspot.com",
    messagingSenderId: "370591165789",
    appId: "1:370591165789:web:e93184c91a4b6bd3ae8cb4",
    measurementId: "G-FZZ7M0EX62"
});

export default function Auth() {

  const [authState, setAuthState] = useState<AuthState>({ status: "loading", user:null, token:null });


    useEffect(() => {

    return firebase.auth().onAuthStateChanged(async user => {
        if (user) {
            // console.log(user)
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaim =
            idTokenResult.claims["https://hasura.io/jwt/claims"];
        
        if (hasuraClaim) {
            setAuthState({ status: "in", user, token });
        } else {
            // Check if refresh is required.
            const metadataRef = firebase
            .database()
            .ref("metadata/" + user.uid + "/refreshTime");

            metadataRef.on("value", async () => {
            // Force refresh to pick up the latest custom claims changes.
                const token = await user.getIdToken(true);
                setAuthState({ status: "in", user, token });
                localStorage.setItem("token", token);
                localStorage.setItem('userId',user.uid)
            });
        }
        } else {
        setAuthState({ status: "out", user:null, token:null  });
        }
    });
        
    }, []);


    let content;
    // console.log(authState)
    if (authState.status === "loading") {
        content = null;
    } else {
        content = (
            <>
            {/* <div>
                {authState.status === "in" ? (
                <div>
                    <h2>Welcome, {authState.user.displayName}</h2>
                    <button onClick={signOut}>Sign out</button>
                </div>
                    ) : (
                <div>
                    <button onClick={signInWithGoogle}>Sign in with Google</button>
                    <button onClick={signInWithTwitter}>Sign in with Twitter</button>
                </div>
                )}
            </div> */}

            <App authState={authState} />
            </>

        );
    }

    return <div className="auth">{content}</div>;
}