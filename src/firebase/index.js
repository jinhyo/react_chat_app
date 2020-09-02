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
    this.fieldValue = firebase.firestore.FieldValue;
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
        avatarURL: photoURL,
        roomsICreated: [],
        roomsIJoined: []
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
    this.auth.currentUser.updateProfile({
      photoURL: avatarURL
    });
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

  async createRoom(userID, nickname, roomName, details, avatarURL) {
    const newRoomRef = this.db.collection("rooms").doc();
    const userRef = this.db.collection("users").doc(userID);
    await newRoomRef.set({
      name: roomName,
      details,
      createdAt: new Date(),
      messageCounts: 0,
      createdBy: userRef
    });

    await newRoomRef
      .collection("participants")
      .doc(userID)
      .set({
        id: userID,
        nickname,
        avatarURL
      });

    await this.db
      .collection("users")
      .doc(userID)
      .update({
        roomsICreated: this.fieldValue.arrayUnion({
          roomName,
          id: newRoomRef.id
        }),
        roomsIJoined: this.fieldValue.arrayUnion({
          roomName,
          id: newRoomRef.id
        })
      });

    return newRoomRef.id;
  }

  async getParticipants(roomID) {
    const snap = await this.db
      .collection("rooms")
      .doc(roomID)
      .collection("participants")
      .get();
    return snap.docs.map(doc => doc.data());
  }

  subscribeToAllRooms(cb) {
    this.db
      .collection("rooms")
      .orderBy("createdAt", "desc")
      .onSnapshot(cb);
  }

  async leaveRoom(userID, roomID, roomName) {
    const targetRoom = { id: roomID, roomName };
    console.log("targetRoom", targetRoom);

    await this.db
      .collection("users")
      .doc(userID)
      .update({
        roomsIJoined: this.fieldValue.arrayRemove(targetRoom)
      });

    await this.db
      .collection("rooms")
      .doc(roomID)
      .collection("participants")
      .doc(userID)
      .delete();
  }

  async joinRoom(userID, userNickname, avatarURL, roomName, roomID) {
    await this.db
      .collection("users")
      .doc(userID)
      .update({
        roomsIJoined: this.fieldValue.arrayUnion({
          id: roomID,
          roomName: roomName
        })
      });

    await this.db
      .collection("rooms")
      .doc(roomID)
      .collection("participants")
      .doc(userID)
      .set({
        id: userID,
        avatarURL,
        nickname: userNickname
      });
  }
}

const firebaseApp = new Firebase();
export default firebaseApp;
