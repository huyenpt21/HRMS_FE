import firebase from 'firebase/compat/app';
import { getStorage } from 'firebase/storage';

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyA7rqmB5ih5T2jTY4Kjpk8t36RZVhYiEYk',
  authDomain: 'hrms-3e889.firebaseapp.com',
  projectId: 'hrms-3e889',
  storageBucket: 'hrms-3e889.appspot.com',
  messagingSenderId: '443781173655',
  appId: '1:443781173655:web:bc7eb6d9d5b0d1b17274d2',
};

const app = firebase.initializeApp(firebaseConfig);
const storageFirebase = getStorage(app);

export { storageFirebase };
