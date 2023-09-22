import { firebase } from './config';

export const usersRef = firebase.firestore().collection('users');
export const chatfeedRef = firebase.firestore().collection('social_feeds');
export const channelsRef = firebase.firestore().collection('channels');
export const getUserData = async (userId) => {
  try {
    const user = await usersRef.doc(userId).get();
    return user;
  } catch (error) {
    console.log(error);
    return {
      error: 'Oops! an error occurred. Please try again',
      success: false,
    };
  }
};

//new i have added
export const addUserData = async (userData) => {
  try {
    // const userRef = usersRef.doc(userId);

    await usersRef.add({
      ...userData,
    });

    return { success: true };
  } catch (error) {
    return { error, success: false };
  }
};


export const updateUserData = async (userId, userData) => {
  // console.log("updateUserData"+userId+"---------------------"+JSON.stringify(userData))
  try {
    const userRef = usersRef.doc(userId);

    await userRef.update({
      ...userData,
    });

    return { success: true };
  } catch (error) {
    return { error, success: false };
  }
};

export const subscribeUsers = (callback) => {
  return usersRef.onSnapshot((querySnapshot) => {
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    return callback(users);
  });
};


// //newly added
// export const channelsUsers = (callback,userID,newUser) => {
//   console.log("channelsUsers")
//  const document=chatfeedRef
//     .doc(userID).collection('chat_feed').doc(userID).get();
// console.log("document"+JSON.stringify(document))

//     const channels = [];

//     return callback(channels);

// };

//newly added
export const channelsUsers = (callback,userID,newUser,item) => {
  // console.log("item"+JSON.stringify(item)+"-------newUser------"+JSON.stringify(newUser))
  return chatfeedRef.doc(newUser.userID)
  .collection("chat_feed")
  .onSnapshot((querySnapshot) => {
    // console.log("------querySnapshot-------------1"+JSON.stringify(querySnapshot))
    
    const channels = [];
    querySnapshot.forEach(doc => {
      let newData=doc.data();
      if(newData.participants.length==1){
if(newUser.userID==newData.participants[0].id){
      newData.title=newUser.firstName+" "+newUser.lastName;
      // newData.participants[0]=newUser;
      newData.participants[0].firstName=newUser.firstName;
      newData.participants[0].lastName=newUser.lastName;
     let data=newData;
      chatfeedRef.doc(data.participants[0].id).collection("chat_feed")
    .doc(data.id).update({
      ...data
    });
  }
}
      // const data = doc.data();
      // console.log(doc.id, data);
    });
  

    

//     querySnapshot.forEach((doc) => {
//       console.log("doc"+JSON.stringify(doc))
//       channels.push(doc.data());
//       console.log("id"+doc.data().id)
//       console.log("userID"+userID)
//       console.log("dparticcients"+doc.data().participants[0].userID)


//   let newData=doc.data();

// console.log("------newData-------------1"+JSON.stringify(newData))


// for(let i=0;i<newData.participants.length;i++){
//   if(userID==newData.participants[i].userID ){
    
//     newData.participants[i]= newUser
//   }
// }

// console.log("------newData-------------2"+JSON.stringify(newData))

//     });
    return callback(channels);
  });
};


// //newly added
// export const channelsUsers = (callback,userID,newUser) => {
//   return channelsRef.onSnapshot((querySnapshot) => {
//     const channels = [];
//     querySnapshot.forEach((doc) => {
//       console.log("doc"+JSON.stringify(doc))
//       channels.push(doc.data());
//       console.log("id"+doc.data().id)
//       console.log("userID"+userID)
//       console.log("dparticcients"+doc.data().participants[0].userID)


//   let newData=doc.data();

// console.log("------newData-------------1"+JSON.stringify(newData))


// for(let i=0;i<newData.participants.length;i++){
//   if(userID==newData.participants[i].userID ){
    
//     newData.participants[i]= newUser
//   }
// }

// console.log("------newData-------------2"+JSON.stringify(newData))


//   // channelsRef
//   //   .doc(doc.data().id).update({
//   //  ...newData
    
//   //   });

//     });
//     return callback(channels);
//   });
// };

export const subscribeCurrentUser = (userId, callback) => {
  const ref = usersRef
    .where('id', '==', userId)
    .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
      const docs = querySnapshot.docs;
      if (docs.length > 0) {
        callback(docs[0].data());
      }
    });
  return ref;
};
