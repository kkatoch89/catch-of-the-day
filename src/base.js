import Rebase from 're-base';
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
	apiKey: 'AIzaSyBVfgP0fThUU0IboEuEngQsnI7A3-T8EPk',
	authDomain: 'catch-of-the-day-f1622.firebaseapp.com',
	databaseURL: 'https://catch-of-the-day-f1622-default-rtdb.firebaseio.com',
});

const base = Rebase.createClass(firebaseApp.database());

// This is a named export
export { firebaseApp };

// This is a default export
export default base;
