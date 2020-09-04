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
    await this.db
      .collection("users")
      .doc(userId)
      .update({ privateEmail, location, selfIntro });
  }

  async updateAvatar(userId, imageFile) {
    const avatarURL = await this.uploadAvatarImageFile(userId, imageFile);
    this.auth.currentUser.updateProfile({
      photoURL: avatarURL
    });
    await this.db
      .collection("users")
      .doc(userId)
      .update({ avatarURL });

    const userSnap = await this.db
      .collection("users")
      .doc(userId)
      .get();
    const roomsIJoined = userSnap.data().roomsIJoined;
    roomsIJoined.forEach(room => {
      this.db
        .collection("rooms")
        .doc(room.id)
        .collection("participants")
        .doc(userId)
        .update({
          avatarURL
        });
    });

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
        .catch(err => {
          reject(err);
        });
    });
  }

  sendImageFile(imageFile, metaData, roomID) {
    return new Promise((resolve, reject) => {
      this.storage
        .ref(`publicChats/${roomID}`)
        .child(imageFile.name + "_" + imageFile.lastModified)
        .put(imageFile, metaData)
        .then(snap => {
          snap.ref.getDownloadURL().then(url => {
            resolve(url);
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  async createRoom(userID, nickname, roomName, details, avatarURL) {
    const newRoomRef = this.db.collection("rooms").doc();
    const userRef = this.db.collection("users").doc(userID);
    await newRoomRef.set({
      name: roomName,
      details,
      createdAt: new Date(),
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
          name: roomName,
          id: newRoomRef.id
        }),
        roomsIJoined: this.fieldValue.arrayUnion({
          name: roomName,
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
    return this.db
      .collection("rooms")
      .orderBy("createdAt", "desc")
      .onSnapshot(cb);
  }

  async leaveRoom(userID, roomID, roomName) {
    const targetRoom = { id: roomID, name: roomName };
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
          name: roomName
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

  async sendMessage(content, createdBy, roomID) {
    await this.db
      .collection("rooms")
      .doc(roomID)
      .collection("messages")
      .add({
        content,
        type: "message",
        createdAt: new Date(),
        createdBy
      });
  }

  async sendImageMessage(imageURLs, createdBy, roomID) {
    await this.db
      .collection("rooms")
      .doc(roomID)
      .collection("messages")
      .add({
        content: imageURLs,
        type: "image",
        createdAt: new Date(),
        createdBy
      });
  }

  subscribeToRoomMessages(roomID, cb) {
    return this.db
      .collection("rooms")
      .doc(roomID)
      .collection("messages")
      .orderBy("createdAt", "asc")
      .onSnapshot(cb);
  }

  async getMessageCountFromPublicRoom(roomID) {
    const snap = await this.db
      .collection("rooms")
      .doc(roomID)
      .collection("messages")
      .get();

    return snap.size;
  }
}

const firebaseApp = new Firebase();
export default firebaseApp;
