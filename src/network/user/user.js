import firebaseDb from "../../database/firebaseDb";

// export const AddUser = async (name, email, uid, profileImg) => {
//   try {
//     return await firebaseDb
//       .database()
//       .ref("users/" + uid)
//       .set({
//         name: name,
//         email: email,
//         uuid: uid,
//         profileImg: profileImg,
//       });
//   } catch (error) {
//     return error;
//   }
// };


export const AddUser = async (name, email, uid, profileImg) => {
  // this.dbRef = firebaseDb.firestore().collection('users');

 
   
  try {
    

    return await firebaseDb.firestore().collection('users').add({
      name:name,
      email: email,
      uuid: uid,
      profileImg: profileImg,
    })
    
  } catch (error) {
    console.log("error"+error)
    return error;
  }


};

// export const AddUser = async (name, email, uid, profileImg) => {
//   try {
//     return await firebaseDb
//       .database()
//       .ref("users/" + uid)
//       .set({
//         name: name,
//         email: email,
//         uuid: uid,
//         profileImg: profileImg,
//       });
//   } catch (error) {
//     return error;
//   }
// };


export const UpdateUser = async (uuid, imgSource) => {
  try {
    return await firebaseDb
      .database()
      .ref("users/" + uuid)
      .update({
        profileImg: imgSource,
      });
  } catch (error) {
    return error;
  }
};