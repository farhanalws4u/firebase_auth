import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyAK9rbkpxapbxs8Nv1O5QGJe_hDBN1k6pk",
  authDomain: "fir-auth-fc1c9.firebaseapp.com",
  projectId: "fir-auth-fc1c9",
  storageBucket: "fir-auth-fc1c9.appspot.com",
  messagingSenderId: "482609815050",
  appId: "1:482609815050:web:736936e7ead9a98950c9f3",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

export const db = firebase.firestore();

// generating user documnet.....

export const generateUserDocument = async (user, formData) => {
  if (!user) return;
  // const userRef = db.doc(`users/${user.uid}`);
  const userRef = db.collection("users").doc(user.uid);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email } = user;
    try {
      await userRef.set({
        displayName: formData.firstName,
        email,
        ...formData,
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

// getting the user document....

export const getUserDocument = async (uid) => {
  if (!uid) return null;
  try {
    const userDocument = await db.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data(),
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

// detecting the auth state change and then saving the user's info to the local storage.....

// auth.onAuthStateChanged(async (user) => {
//   if (user) {
//     const currentUser = await getUserDocument(user.uid);

//     localStorage.setItem("currentUser", JSON.stringify(currentUser));
//   } else {
//     localStorage.removeItem("currentUser");
//   }
// });
