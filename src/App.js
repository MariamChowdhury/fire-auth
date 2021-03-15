import "./App.css";
import firebase from 'firebase/app' 
import "firebase/auth";
import firebaseConfig from "./firebase.config";
firebase.initializeApp(firebaseConfig);
function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleClick =() => {
    firebase.auth()
  .signInWithPopup(provider)
  .then(res => {
   const {displayName,photoURL,phoneNumber}=res.user;
   console.log(displayName,phoneNumber,photoURL)
  })
   
  }
  return <div className='App'>
    <button onClick={handleClick} >Sign In</button>
  </div>;
}

export default App;
