import "./App.css";
import React, { useState, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { GoogleAuthProvider } from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  addDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

firebase.initializeApp({
  apiKey: "AIzaSyA_vDOn8vlG3lzQ0a_QOziAhREv1dzRBmk",
  authDomain: "superchat-a7cc9.firebaseapp.com",
  projectId: "superchat-a7cc9",
  storageBucket: "superchat-a7cc9.appspot.com",
  messagingSenderId: "834483305054",
  appId: "1:834483305054:web:dcb61ac344252f442e52cf",
  measurementId: "G-YRJ238K9ZQ",
});

function App() {
  const auth = firebase.auth();
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header"></header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const auth = firebase.auth();

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  const auth = firebase.auth();

  return (
    auth.currentUser && <button onClick={() => auth.SignOut()}>Sign Out</button>
  );
}

function ChatMessage(props) {
  const { text, uid, photoUrl } = props.message;
  const auth = firebase.auth();

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoUrl} />
      <p>{text}</p>
    </div>
  );
}

function ChatRoom() {
  const dummy = useRef();
  const app = firebase.initializeApp({
    apiKey: "AIzaSyA_vDOn8vlG3lzQ0a_QOziAhREv1dzRBmk",
    authDomain: "superchat-a7cc9.firebaseapp.com",
    projectId: "superchat-a7cc9",
    storageBucket: "superchat-a7cc9.appspot.com",
    messagingSenderId: "834483305054",
    appId: "1:834483305054:web:dcb61ac344252f442e52cf",
    measurementId: "G-YRJ238K9ZQ",
  });

  const [value, loading, error] = useCollection(
    collection(getFirestore(app), "messages"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    const docData = {
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: user.uid,
      photoUrl: user.photoURL,
    };
    await addDoc(collection(getFirestore(app), "messages"), docData);
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {value &&
          value.docs.map((msg, index) => (
            <ChatMessage key={msg.id} uid={msg.id} message={msg.data()} />
          ))}
        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">SEND</button>
      </form>
    </>
  );
}

export default App;
