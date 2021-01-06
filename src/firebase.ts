import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDGwsmetTEEDX6lDxdtGjP9Q3nkmDmezw4',
  authDomain: 'imessage-clone-redux.firebaseapp.com',
  databaseURL: 'https://imessage-clone-redux.firebaseio.com',
  projectId: 'imessage-clone-redux',
  storageBucket: 'imessage-clone-redux.appspot.com',
  messagingSenderId: '861336926452',
  appId: '1:861336926452:web:84219d43aef1d4682146a1',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  db.enablePersistence()
    .then(() => console.log('persistence enabled'))
    .catch(function (err) {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
        console.log(err.code);
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
        console.log(err.code);
      }
    });
}

export { auth, provider };
export default db;
