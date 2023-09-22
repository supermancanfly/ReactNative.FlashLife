import firebaseDb from "../../database/firebaseDb";

export const SignUpRequest = async (email, password) => {
  try {
    return await firebaseDb
      .auth()
      .createUserWithEmailAndPassword(email, password);
  } catch (error) {
    return error;
  }
};

// export default SignUpRequest;