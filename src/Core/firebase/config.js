import { decode, encode } from 'base-64';
import './timerConfig';
global.addEventListener = (x) => x;
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  // apiKey: 'AIzaSyAOWHBpPhKoNhcGFKHH_Q_0AtL2gV-imgQ',
  // authDomain: 'production-a9404.firebaseapp.com',
  // databaseURL: 'https://production-a9404.firebaseio.com',
  // projectId: 'production-a9404',
  // storageBucket: 'production-a9404.appspot.com',
  // messagingSenderId: '525472070731',
  // appId: '1:525472070731:web:ee873bd62c0deb7eba61ce',

  // apiKey: 'AIzaSyCP7j-F7AXgBrhx56NSBYVrhS_dKGg0SlA',
  // authDomain: 'chat-81668.firebaseapp.com',
  // databaseURL: 'https://chat-81668-default-rtdb.firebaseio.com/',
  // projectId: 'chat-81668',
  // storageBucket: 'chat-81668.appspot.com',
  // messagingSenderId: '720694137323',
  // appId: '1:720694137323:android:69506caa059d039deac9ae',

  apiKey: "AIzaSyCNasTG3FZ5gJi27frwDq2_g6DhHRvCztw",
  authDomain: "instaccess-49da7.firebaseapp.com",
  databaseURL: "https://instaccess-49da7.firebaseio.com/",
  projectId: "instaccess-49da7",
  storageBucket: "instaccess-49da7.appspot.com",
  messagingSenderId: "707780305981",
  appId: "1:707780305981:android:82814659beec870f47b654"

};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export { firebase };
