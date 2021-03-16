import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { useState } from "react";
firebase.initializeApp(firebaseConfig);
function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    photo: "",
    password: "",
    error: "",
    success: false,
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => {
        const { displayName, photoURL, email } = res.user;
        const signInInfo = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(signInInfo);
        console.log(displayName, email, photoURL);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        const signOutInfo = {
          isSignedIn: false,
          name: "",
          email: "",
          photo: "",
        };
        setUser(signOutInfo);
      })
      .catch((err) => console.log(err));
  };
  const handleSubmit = (e) => {
    if (newUser && user.email && user.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    if (!newUser && user.email && user.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log("signed in users name:", res.user);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    e.preventDefault();
  };
  const handleBlur = (e) => {
    let handleValid = true;
    if (e.target.name === "email") {
      const validateEmail = /\S+@\S+\.\S+/.test(e.target.value);
      handleValid = validateEmail;
    }
    if (e.target.name === "password") {
      const passLength = e.target.value.length > 6;
      const passValidation = /\d{1}/.test(e.target.value);
      handleValid = passLength && passValidation;
    }
    if (handleValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  };
  const updateUserName = (name) => {
    var user = firebase.auth().currentUser;

    user
      .updateProfile({
        displayName: name,
      })
      .then(function () {
        console.log("user name updated successfully");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleFbSignIn = () => {
    console.log('clicked')
    firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then((result) => {
        const user = result.user;
        console.log("clicked button!",user);
      })
      .catch((error) => {
       console.log(error)
      });
  };

  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}{" "}
      <br />
      <button onClick={handleFbSignIn}>Sign in with Facebook</button>
      {user.isSignedIn && (
        <div>
          <p>Welcome,{user.name}!</p>
          <p>Your email is: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      )}
      <h1>Our own Authentication</h1>
      <input
        type="checkbox"
        onChange={() => setNewUser(!newUser)}
        name="newUser"
      />
      <label htmlFor="newUser">New User Sign up</label>
      <br />
      <form onSubmit={handleSubmit}>
        {newUser && (
          <input
            type="text"
            placeholder="Name"
            name="email"
            required
            onBlur={handleBlur}
          />
        )}
        <br />
        <input
          type="text"
          placeholder="Email"
          name="email"
          required
          onBlur={handleBlur}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          name="password"
          required
          onBlur={handleBlur}
        />
        <br />
        <input type="submit" value={newUser ? "Sign Up" : "Sign In"} />
      </form>
      <p style={{ color: "red" }}>{user.error}</p>
      {user.success && (
        <p style={{ color: "green" }}>
          User {newUser ? "created" : "logged in"} successfully!
        </p>
      )}
    </div>
  );
}

export default App;
