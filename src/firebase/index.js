import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";
import md5 from "md5";
import firebaseConfig from "./config";

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.storage = firebase.storage();
    this.realtimeDB = firebase.database();
    this.fieldValue = firebase.firestore.FieldValue;
  }

  async createNewUser(
    email,
    password,
    nickname,
    privateEmail,
    location,
    selfIntro,
    createdAt
  ) {
    const photoURL = await fetch(
      `http://gravatar.com/avatar/${md5(email)}?d=identicon`
    ).then(response => response.url);

    const newUser = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );

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
        roomsIJoined: [],
        createdAt
      });

    await newUser.user.updateProfile({
      displayName: nickname
    });
  }

  checkAuth(cb) {
    return this.auth.onAuthStateChanged(cb);
  }

  async getUser(userId) {
    const userRef = this.db.collection("users").doc(userId);
    const userSnapshot = await userRef.get();
    let currentUser = userSnapshot.data();

    delete currentUser.createdAt;

    return currentUser;
  }

  async getUserAvatar(userId) {
    const userRef = this.db.collection("users").doc(userId);

    const friendsSnap = await userRef.collection("friends").get();
    const friendsRefs = friendsSnap.docs.map(doc => doc.data());

    const friendsPromise = friendsRefs.map(async ({ userRef }) => {
      const friendSnap = await userRef.get();
      const friend = friendSnap.data();

      return { id: friendSnap.id, ...friend };
    });
    const friends = await Promise.all(friendsPromise);

    return friends;
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
        avatarURL: user.photoURL,
        roomsIJoined: [],
        roomsICreated: [],
        createdAt: new Date()
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
      createdBy: userRef,
      messageCounts: 0,
      userMsgCount: { [this.auth.currentUser.uid]: 0 }
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

    await this.db
      .collection("users")
      .doc(userID)
      .update({
        roomsIJoined: this.fieldValue.arrayRemove(targetRoom)
      });

    const participantsRef = this.db
      .collection("rooms")
      .doc(roomID)
      .collection("participants");
    const participantsSnap = await participantsRef.get();

    if (participantsSnap.size === 1) {
      // 참가자 목록에 내가 마지막이면 방 삭제
      return this.db
        .collection("rooms")
        .doc(roomID)
        .delete();
    }

    await participantsRef.doc(userID).delete(); // 참가자 목록에서 나 삭제

    const roomRef = this.db.collection("rooms").doc(roomID);
    const roomSnap = await roomRef.get();

    const currentUserMsgCount = roomSnap.data().userMsgCount;
    delete currentUserMsgCount[userID];

    // userMsgCount에서 내 목록 삭제
    await roomRef.update({
      userMsgCount: currentUserMsgCount
    });
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

    const roomRef = this.db.collection("rooms").doc(roomID);
    const roomSnap = await roomRef.get();
    const roomData = roomSnap.data();
    const currentUserMsgCount = roomData.userMsgCount;
    const { messageCounts } = roomData;

    await roomRef.update({
      userMsgCount: { ...currentUserMsgCount, [userID]: messageCounts }
    });

    await roomRef
      .collection("participants")
      .doc(userID)
      .set({
        id: userID,
        avatarURL,
        nickname: userNickname
      });
  }

  async setPublicMsgCountEqual(roomID) {
    const roomRef = this.db.collection("rooms").doc(roomID);
    const roomSnap = await roomRef.get();
    const roomData = roomSnap.data();
    const currentUserMsgCount = roomData.userMsgCount;
    const { messageCounts } = roomData;

    await roomRef.update({
      userMsgCount: {
        ...currentUserMsgCount,
        [this.auth.currentUser.uid]: messageCounts
      }
    });
  }

  async sendMessage(content, roomID) {
    const roomRef = this.db.collection("rooms").doc(roomID);
    const userRef = this.db.collection("users").doc(this.auth.currentUser.uid);

    await roomRef.collection("messages").add({
      content,
      type: "message",
      createdAt: new Date(),
      createdBy: userRef
    });

    const roomSnap = await roomRef.get();
    const { userMsgCount } = roomSnap.data();
    userMsgCount[this.auth.currentUser.uid]++;

    await roomRef.update({
      userMsgCount,
      messageCounts: this.fieldValue.increment(1),
      lastMessageCreatedBy: this.auth.currentUser.uid
    });
  }

  async changePublicRoomMsgCount(publicRoomID) {
    const publicRoomRef = this.db.collection("rooms").doc(publicRoomID);

    const publicRoomSnap = await publicRoomRef.get();
    const { userMsgCount, messageCounts } = publicRoomSnap.data();
    userMsgCount[this.auth.currentUser.uid] = messageCounts;

    await publicRoomRef.update({
      userMsgCount
    });
  }

  async sendImageMessage(imageURLs, roomID) {
    const roomRef = this.db.collection("rooms").doc(roomID);
    const userRef = this.db.collection("users").doc(this.auth.currentUser.uid);

    await roomRef.collection("messages").add({
      content: imageURLs,
      type: "image",
      createdAt: new Date(),
      createdBy: userRef
    });

    const roomSnap = await roomRef.get();
    const { userMsgCount } = roomSnap.data();
    userMsgCount[this.auth.currentUser.uid]++;

    await roomRef.update({
      userMsgCount,
      messageCounts: this.fieldValue.increment(1)
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

  addTypingStatus(roomID) {
    const typingRef = this.realtimeDB.ref("typings").child(roomID);
    typingRef
      .child(this.auth.currentUser.uid)
      .set(this.auth.currentUser.displayName);
  }

  deleteTypingStatus(roomID) {
    const typingRef = this.realtimeDB.ref("typings").child(roomID);
    typingRef.child(this.auth.currentUser.uid).remove();
  }

  listenToTypings(roomID, addedCb, removedCb) {
    const connectedRef = this.realtimeDB.ref(".info/connected");
    const typingRef = this.realtimeDB.ref("typings").child(roomID);

    typingRef.on("child_added", addedCb);
    typingRef.on("child_removed", removedCb);

    connectedRef.on("value", snap => {
      if (snap.val() === true) {
        typingRef
          .child(this.auth.currentUser.uid)
          .onDisconnect()
          .remove()
          .then(err => {
            console.error(err);
          });
      }
    });

    return { typingRef, connectedRef };
  }

  listenToMessageCounts(roomID, cb) {
    return this.db
      .collection("rooms")
      .doc(roomID)
      .collection("messages")
      .onSnapshot(cb);
  }

  listenToUsers(cb) {
    this.db
      .collection("users")
      .orderBy("createdAt", "desc")
      .onSnapshot(cb);
  }

  async addFriend(friendID) {
    const userRef = this.db.collection("users").doc(friendID);

    try {
      await this.db
        .collection("users")
        .doc(this.auth.currentUser.uid)
        .collection("friends")
        .doc(friendID)
        .set({ userRef });
    } catch (error) {
      console.error(error);
    }
  }

  async removeFriend(friendID) {
    try {
      await this.db
        .collection("users")
        .doc(this.auth.currentUser.uid)
        .collection("friends")
        .doc(friendID)
        .delete();
    } catch (error) {
      console.error(error);
    }
  }

  listenToFriends(cb) {
    const unsubscribe = this.db
      .collection("users")
      .doc(this.auth.currentUser.uid)
      .collection("friends")
      .onSnapshot(cb);

    return unsubscribe;
  }

  listenToPrivateRooms(cb) {
    const unsubscribe = this.db
      .collection("privateRooms")
      .where("participants", "array-contains", this.auth.currentUser.uid)
      .where("messageCounts", ">", 0)
      .orderBy("messageCounts", "desc")
      .orderBy("lastMessageTimestamp", "desc")
      .onSnapshot(cb);

    return unsubscribe;
  }

  listenToPublicRooms(cb) {
    const unsubscribe = this.db
      .collection("rooms")
      .where("participants", "array-contains", this.auth.currentUser.uid)
      .onSnapshot(cb);

    return unsubscribe;
  }

  listenToPrivateMessages(privateRoomID, cb) {
    const unsubscribe = this.db
      .collection("privateRooms")
      .doc(privateRoomID)
      .collection("messages")
      .orderBy("createdAt", "asc")
      .onSnapshot(cb);

    return unsubscribe;
  }

  // 채팅을 입력할 때마다 내가 읽은 메시지 카운트도 1씩 증가
  async changePrivateRoomMsgCount(privateRoomID, friendID) {
    const privateRoomRef = this.db
      .collection("privateRooms")
      .doc(privateRoomID);

    const privateRoomSnap = await privateRoomRef.get();
    const { userMsgCount, messageCounts } = privateRoomSnap.data();

    await privateRoomRef.update({
      userMsgCount: {
        [this.auth.currentUser.uid]: messageCounts,
        [friendID]: userMsgCount[friendID]
      }
    });
  }

  // 처음 개인채팅방에 들어가면 전체 메시지 카운트랑 내가 읽은 메시지 카운트를 같게
  async setCountsEqual(privateRoomID) {
    const privateRoomRef = this.db
      .collection("privateRooms")
      .doc(privateRoomID);
    const privateRoomSnap = await privateRoomRef.get();

    // 처음 채팅을 시작할 때는 방이 만들어져 있지 않아서 privateRoomSnap.exists=false 나옴
    if (privateRoomSnap.exists) {
      const privateRoomData = privateRoomSnap.data();
      const friendID = privateRoomData.participants.find(
        participantID => participantID !== this.auth.currentUser.uid
      );

      await privateRoomRef.update({
        userMsgCount: {
          [this.auth.currentUser.uid]: privateRoomData.messageCounts,
          [friendID]: privateRoomData.userMsgCount[friendID]
        }
      });

      return privateRoomData.messageCounts;
    } else {
      return null;
    }
  }

  async sendPrivateMessage(friendID, content) {
    const myID = this.auth.currentUser.uid;

    const privateRoomID = makePrivateRoomID(myID, friendID);
    const createdAt = new Date();

    const privateRoomRef = this.db
      .collection("privateRooms")
      .doc(privateRoomID);

    const privateRoomSnap = await privateRoomRef.get();
    if (!privateRoomSnap.exists) {
      // 첫 메시지를 보낼 경우 아직 db의 privateRoom document가 안 만들어져 있기 때문에
      // 먼저 privateRoom document를 만든다.
      await privateRoomRef.set({
        lastMessageTimestamp: createdAt,
        messageCounts: 1,
        lastMessage: content,
        lastMessageCreatedBy: myID,
        userMsgCount: {
          [myID]: 1,
          [friendID]: 0
        },
        participants: [myID, friendID],
        userRefs: {
          [myID]: this.db.collection("users").doc(myID),
          [friendID]: this.db.collection("users").doc(friendID)
        }
      });
    } else {
      // 이미 privateRoom document가 있는 경우에는 방 정보를 업데이트
      const { userMsgCount } = privateRoomSnap.data();
      userMsgCount[myID]++;

      await privateRoomRef.update({
        lastMessageTimestamp: createdAt,
        lastMessageCreatedBy: myID,
        lastMessage: content,
        messageCounts: this.fieldValue.increment(1),
        userMsgCount
      });
    }

    // 위에서 방을 먼저 만들거나 업데이트한 후 메시지를 추가
    await privateRoomRef.collection("messages").add({
      content,
      type: "message",
      createdAt,
      createdBy: {
        id: this.auth.currentUser.uid,
        nickname: this.auth.currentUser.displayName
      }
    });
  }

  sendPrivateImageFile(imageFile, metaData, privateRoomID) {
    return new Promise((resolve, reject) => {
      this.storage
        .ref(`privateChats/${privateRoomID}`)
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

  async sendPrivateImageMessage(imageURLs, createdBy, privateRoomID, friendID) {
    const myID = this.auth.currentUser.uid;

    const createdAt = new Date();

    const privateRoomRef = this.db
      .collection("privateRooms")
      .doc(privateRoomID);

    const privateRoomSnap = await privateRoomRef.get();
    if (!privateRoomSnap.exists) {
      // 첫 메시지를 보낼 경우 아직 db의 privateRoom document가 안 만들어져 있기 때문에
      // 먼저 privateRoom document를 만든다.
      await privateRoomRef.set({
        lastMessageTimestamp: createdAt,
        messageCounts: 1,
        lastMessage: "- 이미지 파일 -",
        participants: [myID, friendID],
        userRefs: {
          [myID]: this.db.collection("users").doc(myID),
          [friendID]: this.db.collection("users").doc(friendID)
        }
      });
    } else {
      // 이미 privateRoom document가 있는 경우에는 방 정보를 업데이트
      const { userMsgCount } = privateRoomSnap.data();
      userMsgCount[myID]++;

      await privateRoomRef.update({
        lastMessageTimestamp: createdAt,
        messageCounts: this.fieldValue.increment(1),
        lastMessage: "- 이미지 파일 -",
        userMsgCount
      });
    }

    // 위에서 방을 먼저 만들거나 업데이트한 후 메시지를 추가
    await this.db
      .collection("privateRooms")
      .doc(privateRoomID)
      .collection("messages")
      .add({
        content: imageURLs,
        type: "image",
        createdAt: new Date(),
        createdBy
      });
  }

  setLoginStatus() {
    const connectedRef = this.realtimeDB.ref(".info/connected");
    const myPresenceRef = this.realtimeDB
      .ref("presence")
      .child(this.auth.currentUser.uid);

    connectedRef.on("value", snap => {
      if (snap.val() === true) {
        myPresenceRef.set(true);

        myPresenceRef
          .onDisconnect()
          .remove()
          .then(err => {
            console.error(err);
          });
      }
    });

    return connectedRef;
  }

  listenToLoginStatus(addedCb, removedCb) {
    const presenceRef = this.realtimeDB.ref("presence");

    presenceRef.on("child_added", addedCb);
    presenceRef.on("child_removed", removedCb);

    return presenceRef;
  }

  async checkUserLoginStatus(userID, cb) {
    const presenceRef = this.realtimeDB.ref("presence");
    presenceRef.child(userID).once("value", cb);
  }

  async checkDuplicateName(name) {
    const snap = await this.db
      .collection("rooms")
      .where("name", "==", name)
      .get();

    if (snap.empty) {
      return false;
    } else {
      return true;
    }
  }
}

export function makePrivateRoomID(myID, friendID) {
  return myID > friendID ? myID + friendID : friendID + myID;
}

const firebaseApp = new Firebase();
export default firebaseApp;
