import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import md5 from "md5";
import firebaseConfig from "./config";

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.storage = firebase.storage();
  }

  async createNewUser(
    email,
    password,
    nickname,
    privateEmail,
    location,
    selfIntro
  ) {
    const photoURL = await fetch(
      `http://gravatar.com/avatar/${md5(email)}?d=identicon`
    ).then(response => response.url);

    const newUser = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );
    await newUser.user.updateProfile({
      displayName: nickname
    });

    await this.db
      .collection("users")
      .doc(newUser.user.uid)
      .set({
        nickname,
        email,
        privateEmail,
        location,
        selfIntro,
        avatarURL: photoURL
      });
  }

  checkAuth(cb) {
    return this.auth.onAuthStateChanged(cb);
  }

  async getUser(userId) {
    const snapshot = await this.db
      .collection("users")
      .doc(userId)
      .get();
    const currentUser = await snapshot.data();
    return currentUser;
  }

  async checkUniqueNickname(nickname) {
    const snapshot = await this.db
      .collection("users")
      .where("nickname", "==", nickname)
      .get();

    const isAvailable = snapshot.empty;
    return isAvailable;
  }

  async logOut() {
    await this.auth.signOut();
    window.location.reload();
  }

  async logIn(email, password) {
    await this.auth.signInWithEmailAndPassword(email, password);
  }

  async logInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("email");
    provider.addScope("profile");

    const { user } = await this.auth.signInWithPopup(provider);
    await this.db
      .collection("users")
      .doc(user.uid)
      .set({
        nickname: user.displayName,
        email: user.email,
        privateEmail: true,
        location: "",
        selfIntro: "",
        avatarURL: user.photoURL
      });
  }

  async updateProfile(userId, privateEmail, location, selfIntro) {
    console.log("updateProfile");

    await this.db
      .collection("users")
      .doc(userId)
      .update({ privateEmail, location, selfIntro });
    console.log("end updateProfile");
  }

  async updateAvatar(userId, imageFile) {
    const avatarURL = await this.uploadAvatarImageFile(userId, imageFile);
    console.log("avatarURL", avatarURL);

    await this.db
      .collection("users")
      .doc(userId)
      .update({ avatarURL });
    return avatarURL;
  }

  uploadAvatarImageFile(userId, imageFile) {
    return new Promise((resolve, reject) => {
      this.storage
        .ref(`avatars/${userId}`)
        .put(imageFile)
        .then(snap => {
          snap.ref.getDownloadURL().then(url => {
            resolve(url);
          });
        })
        .catch(reject);
    });
  }
}

const firebaseApp = new Firebase();
export default firebaseApp;
