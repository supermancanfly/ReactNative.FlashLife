import * as firebaseDb from 'firebase';
// import firestore from 'firebase/firestore';
import 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyCNasTG3FZ5gJi27frwDq2_g6DhHRvCztw",
    authDomain: "instaccess-49da7.firebaseapp.com",
    databaseURL: "https://instaccess-49da7.firebaseio.com/",
    projectId: "instaccess-49da7",
    storageBucket: "instaccess-49da7.appspot.com",
    messagingSenderId: "707780305981",
    appId: "1:707780305981:android:82814659beec870f47b654"


    // apiKey: 'AIzaSyCP7j-F7AXgBrhx56NSBYVrhS_dKGg0SlA',
    // authDomain: 'chat-81668.firebaseapp.com',
    // databaseURL: 'https://chat-81668-default-rtdb.firebaseio.com/',
    // projectId: 'chat-81668',
    // storageBucket: 'chat-81668.appspot.com',
    // messagingSenderId: '720694137323',
    // appId: '1:720694137323:android:69506caa059d039deac9ae',
};
if (!firebaseDb.apps.length) {
    firebaseDb.initializeApp(firebaseConfig);
 }else {
    firebaseDb.app(); // if already initialized, use that one
 }
// firebaseDb.initializeApp(firebaseConfig);
firebaseDb.firestore();
firebaseDb.firestore().settings({ experimentalForceLongPolling: true }); //add this..
export default firebaseDb;